from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify

def role_required(*roles):
    """
    Decorator to restrict access to users with specific roles.
    Usage: @role_required('admin', 'doctor')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in roles:
                return jsonify({'error': 'Access forbidden: insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# All currency values in the system are now standardized to INR (₹).
# Please use the following utility function for formatting:

def format_inr(amount):
    return f"₹{amount:,.2f}"
