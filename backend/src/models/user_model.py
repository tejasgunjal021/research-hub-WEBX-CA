import bcrypt
import jwt
import datetime
import os
from backend.src.config import Config
from bson.objectid import ObjectId

class User:
    def __init__(self, data):
        self.id = str(data.get("_id")) if data.get("_id") else None
        self.name = data.get("name")
        self.email = data.get("email")
        self.password = data.get("password")
        self.affiliation = data.get("affiliation", "")
        self.role = data.get("role", "user")
        self.expertise = data.get("expertise", "")
        self.researchInterests = data.get("researchInterests", "")
        self.isVerified = data.get("isVerified", False)
        self.refreshToken = data.get("refreshToken", None)

    def hash_password(self):
        if self.password:
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def is_password_correct(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def generate_access_token(self):
        payload = {
            "user_id": self.id,
            "email": self.email,
            "name": self.name,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=int(Config.ACCESS_TOKEN_EXPIRY.replace('d', '')))
        }
        return jwt.encode(payload, Config.ACCESS_TOKEN_SECRET, algorithm="HS256")

    def generate_refresh_token(self):
        payload = {
            "user_id": self.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=int(Config.REFRESH_TOKEN_EXPIRY.replace('d', '')))
        }
        return jwt.encode(payload, Config.REFRESH_TOKEN_SECRET, algorithm="HS256")
