from functools import wraps
from flask import jsonify
from utils.api_error import ApiError

def async_handler(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ApiError as e:
            return jsonify({
                "message": e.message,
                "errors": e.errors,
                "success": False,
                "stack": e.stack
            }), e.status_code
        except Exception as e:
            return jsonify({
                "message": "Internal Server Error",
                "error": str(e),
                "success": False
            }), 500
    return decorated_function
