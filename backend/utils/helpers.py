from flask import jsonify

def success_response(data=None, message="Success", code=200):
    response = {
        "status": "success",
        "message": message,
        "data": data or {}
    }
    return jsonify(response), code

def error_response(message="An error occurred", code=400, errors=None):
    response = {
        "status": "error",
        "message": message
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), code
