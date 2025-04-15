from functools import wraps
from flask import request, jsonify
import jwt
import os
from src.config import ACCESS_TOKEN_SECRET


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check for token in headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!', 'success': False}), 401

        try:
            data = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!', 'success': False}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!', 'success': False}), 401

        return f(current_user_id=current_user_id, *args, **kwargs)

    return decorated
