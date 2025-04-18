from flask import request, jsonify, make_response
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from src.extensions import mongo
from src.config import ACCESS_TOKEN_SECRET
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

otp_store = {}

# Send OTP via Email (using Gmail SMTP server)
def send_otp(email):
    if not email:
        print("[DEBUG] No email provided.")
        return jsonify({'error': 'Email is required'}), 400

    email = email.lower()

    user_collection = mongo.db.users
    if user_collection.find_one({'email': email}):
        print(f"[ERROR] Email already registered: {email}")
        return jsonify({'error': 'Email already in use'}), 400
    
    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=5)  # OTP expires in 5 minutes

    otp_store[email] = {'otp': otp, 'expiry': otp_expiry}

    print(f"[DEBUG] OTP for {email}: {otp}")  # Log OTP generation

    # Get email configuration from environment variables
    sender_email = os.getenv("EMAIL_USER")
    receiver_email = email
    password = os.getenv("EMAIL_PASS")
    subject = "Your OTP Code"
    body = f"Your OTP code is {otp}. It will expire in 5 minutes."

    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to the email server and send the email
        print("[DEBUG] Connecting to Gmail SMTP server...")
        server = smtplib.SMTP('smtp.gmail.com', 587)  # Gmail SMTP server
        server.starttls()  # Use TLS (encryption)
        print("[DEBUG] Logging into email server...")
        server.login(sender_email, password)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()

        print("[DEBUG] OTP sent successfully to:", receiver_email)
        return jsonify({'message': 'OTP sent successfully'}), 200

    except Exception as e:
        print(f"[ERROR] Failed to send OTP: {str(e)}")  # Log error if sending fails
        return jsonify({'error': f'Failed to send OTP: {str(e)}'}), 500

# Verify OTP
def verify_otp(email, otp):
    print(f"[DEBUG] Verifying OTP for {email}")
    
    if not email or not otp:
        return jsonify({'error': 'Email and OTP are required'}), 400

    email = email.lower()
    stored_otp_data = otp_store.get(email)

    if not stored_otp_data:
        print(f"[ERROR] No OTP found for {email}")
        return jsonify({'error': 'OTP not sent or expired'}), 400

    # Check if OTP has expired
    if datetime.utcnow() > stored_otp_data['expiry']:
        del otp_store[email]
        print(f"[DEBUG] OTP expired for {email}")
        return jsonify({'error': 'OTP expired'}), 400

    if stored_otp_data['otp'] == otp:
        del otp_store[email]  # Clear OTP after successful verification
        print(f"[DEBUG] OTP verified successfully for {email}")
        return jsonify({'message': 'OTP verified successfully'}), 200
    else:
        print(f"[ERROR] Invalid OTP for {email}")
        return jsonify({'error': 'Invalid OTP'}), 400

# User Signup
def signup_user(req):
    print("[DEBUG] Starting signup process...")

    data = req.get_json()
    avatar = req.files.get('avatar')
    cover_image = req.files.get('coverImage')

    required_fields = ['fullName', 'email', 'username', 'password']
    for field in required_fields:
        if not data.get(field):
            print(f"[ERROR] Missing required field: {field}")
            return jsonify({'error': f'{field} is required'}), 400

    full_name = data['fullName']
    email = data['email'].lower()
    username = data['username'].lower()
    password = data['password']

    # OTP verification step
    otp = data.get('otp')
    print(f"[DEBUG] Verifying OTP for email {email}")
    otp_verification_result = verify_otp(email, otp)
    if otp_verification_result[0].status_code != 200:  # If OTP verification fails
        return otp_verification_result

    user_collection = mongo.db.users

    if user_collection.find_one({'email': email}):
        print(f"[ERROR] Email already in use: {email}")
        return jsonify({'error': 'Email already in use'}), 400

    if user_collection.find_one({'username': username}):
        print(f"[ERROR] Username already in use: {username}")
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

    print(f"[DEBUG] Signup successful for {email}")
    return response

# User Login
def login_user(req):
    print("[DEBUG] Starting login process...")
    
    data = req.get_json()
    print("Login request data:", data)
    email = data.get('email', '')
    if not isinstance(email, str):
        return jsonify({'error': 'Invalid email format'}), 400
    email = email.lower()
    password = data.get('password', '')

    user = mongo.db.users.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        print(f"[ERROR] Invalid email or password for {email}")
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode({'id': str(user['_id']), 'exp': datetime.utcnow() + timedelta(days=7)}, ACCESS_TOKEN_SECRET)

    user['_id'] = str(user['_id'])
    user.pop('password')

    response = make_response(jsonify({'user': user}))
    response.set_cookie('token', token, httponly=True, samesite='Lax')

    print(f"[DEBUG] Login successful for {email}")
    return response

# User Logout
def logout_user():
    print("[DEBUG] Logging out user...")
    response = make_response(jsonify({'message': 'Logged out'}))
    response.set_cookie('token', '', expires=0)
    return response

# Get User Info
def get_me(current_user):
    print(f"[DEBUG] Fetching info for user {current_user['_id']}")
    current_user['_id'] = str(current_user['_id'])
    current_user.pop('password')
    return jsonify({'user': current_user})

# Update User Info
def update_user(req, current_user):
    print(f"[DEBUG] Updating info for user {current_user['_id']}")

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

    print(f"[DEBUG] User info updated for {current_user['_id']}")
    return jsonify({'user': user})

# Change Password
def change_password(req, current_user):
    print(f"[DEBUG] Changing password for user {current_user['_id']}")

    data = req.get_json()
    old_pass = data.get('oldPassword')
    new_pass = data.get('newPassword')

    if not check_password_hash(current_user['password'], old_pass):
        print(f"[ERROR] Incorrect old password for {current_user['_id']}")
        return jsonify({'error': 'Incorrect old password'}), 401

    hashed_new = generate_password_hash(new_pass)
    mongo.db.users.update_one({'_id': ObjectId(current_user['_id'])}, {'$set': {'password': hashed_new}})
    
    print(f"[DEBUG] Password updated successfully for {current_user['_id']}")
    return jsonify({'message': 'Password updated successfully'})
