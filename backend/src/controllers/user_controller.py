from flask import request, jsonify, make_response
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt

from src.extensions import mongo
from src.config import ACCESS_TOKEN_SECRET


def signup_user(req):
    data = req.get_json()
    avatar = req.files.get('avatar')
    cover_image = req.files.get('coverImage')

    required_fields = ['fullName', 'email', 'username', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    full_name = data['fullName']
    email = data['email'].lower()
    username = data['username'].lower()
    password = data['password']

    user_collection = mongo.db.users

    if user_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already in use'}), 400

    if user_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already in use'}), 400

    hashed_password = generate_password_hash(password)

    user_data = {
        "fullName": full_name,
        "email": email,
        "username": username,
        "password": hashed_password,
        "bio": "",
        "location": "",
        "website": "",
        "createdAt": datetime.utcnow()
    }

    result = user_collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    user_data.pop('password')

    token = jwt.encode({'id': user_data['_id'], 'exp': datetime.utcnow() + timedelta(days=7)}, ACCESS_TOKEN_SECRET)

    response = make_response(jsonify({'user': user_data}))
    response.set_cookie('token', token, httponly=True, samesite='Lax')
    return response


def login_user(req):
    data = req.get_json()
    print("Login request data:", data)
    email = data.get('email', '')
    if not isinstance(email, str):
        return jsonify({'error': 'Invalid email format'}), 400
    email = email.lower()
    password = data.get('password', '')

    user = mongo.db.users.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode({'id': str(user['_id']), 'exp': datetime.utcnow() + timedelta(days=7)}, ACCESS_TOKEN_SECRET)

    user['_id'] = str(user['_id'])
    user.pop('password')

    response = make_response(jsonify({'user': user}))
    response.set_cookie('token', token, httponly=True, samesite='Lax')
    return response


def logout_user():
    response = make_response(jsonify({'message': 'Logged out'}))
    response.set_cookie('token', '', expires=0)
    return response


def get_me(current_user):
    current_user['_id'] = str(current_user['_id'])
    current_user.pop('password')
    return jsonify({'user': current_user})


def update_user(req, current_user):
    data = req.form
    avatar = req.files.get('avatar')
    cover_image = req.files.get('coverImage')

    updates = {}
    for field in ['fullName', 'bio', 'location', 'website']:
        if data.get(field):
            updates[field] = data[field]

    mongo.db.users.update_one({'_id': ObjectId(current_user['_id'])}, {'$set': updates})
    user = mongo.db.users.find_one({'_id': ObjectId(current_user['_id'])})
    user['_id'] = str(user['_id'])
    user.pop('password')

    return jsonify({'user': user})


def change_password(req, current_user):
    data = req.get_json()
    old_pass = data.get('oldPassword')
    new_pass = data.get('newPassword')

    if not check_password_hash(current_user['password'], old_pass):
        return jsonify({'error': 'Incorrect old password'}), 401

    hashed_new = generate_password_hash(new_pass)
    mongo.db.users.update_one({'_id': ObjectId(current_user['_id'])}, {'$set': {'password': hashed_new}})
    return jsonify({'message': 'Password updated successfully'})
