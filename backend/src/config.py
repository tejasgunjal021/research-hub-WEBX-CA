import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file

# Server
PORT = int(os.getenv("PORT", 3000))

# Database
MONGO_URI = os.getenv("MONGO_URI")

# CORS
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "*")

# JWT tokens
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")
ACCESS_TOKEN_EXPIRY = os.getenv("ACCESS_TOKEN_EXPIRY", "1d")
REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET")
REFRESH_TOKEN_EXPIRY = os.getenv("REFRESH_TOKEN_EXPIRY", "7d")

# Cloudinary
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

EMAIL = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASS")
