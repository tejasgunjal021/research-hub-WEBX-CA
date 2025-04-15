from flask import Blueprint, request, jsonify
from src.controllers.user_controller import (
    signup_user,
    login_user,
    logout_user,
    get_me,
    update_user,
    change_password
)
from src.utils.auth import token_required

user_bp = Blueprint("user", __name__)

@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    print("Received signup data:", data) 
    return signup_user(request)

@user_bp.route("/login", methods=["POST"])
def login():
    return login_user(request)

@user_bp.route("/logout", methods=["POST"])
def logout():
    return logout_user()

@user_bp.route("/me", methods=["GET"])
@token_required
def me(current_user):
    return get_me(current_user)

@user_bp.route("/update", methods=["PATCH"])
@token_required
def update(current_user):
    return update_user(request, current_user)

@user_bp.route("/change-password", methods=["PATCH"])
@token_required
def change_pass(current_user):
    return change_password(request, current_user)
