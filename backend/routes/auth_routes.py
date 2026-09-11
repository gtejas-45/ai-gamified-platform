from flask import Blueprint, request
from utils.helpers import success_response, error_response

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """
    Verifies user token or mock credentials.
    """
    data = request.json or {}
    token = data.get('token')
    
    if not token:
        return error_response("Token missing", 400)

    # Return verified mock user object
    return success_response({
        "uid": "user_demo_123",
        "email": "student@rurallearn.org",
        "role": "student",
        "displayName": "Demo Student"
    }, "Token verified successfully")
