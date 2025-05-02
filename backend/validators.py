from datetime import datetime
import re
from typing import Dict, Any, Tuple

def validate_email(email: str) -> Tuple[bool, str]:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "Invalid email format"
    return True, ""

def validate_password(password: str) -> Tuple[bool, str]:
    """Validate password strength."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, ""

def validate_phone(phone: str) -> Tuple[bool, str]:
    """Validate phone number format."""
    pattern = r'^\+?1?\d{9,15}$'
    if not re.match(pattern, phone):
        return False, "Invalid phone number format"
    return True, ""

def validate_date(date_str: str) -> Tuple[bool, str]:
    """Validate date format (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True, ""
    except ValueError:
        return False, "Invalid date format. Use YYYY-MM-DD"

def validate_user_data(data: Dict[str, Any]) -> Tuple[bool, str]:
    """Validate user registration/login data."""
    if 'email' in data:
        is_valid, message = validate_email(data['email'])
        if not is_valid:
            return False, message
    
    if 'password' in data:
        is_valid, message = validate_password(data['password'])
        if not is_valid:
            return False, message
    
    return True, ""

def validate_patient_data(data: Dict[str, Any]) -> Tuple[bool, str]:
    """Validate patient data."""
    required_fields = ['first_name', 'last_name', 'date_of_birth', 'gender']
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"Missing required field: {field}"
    
    if 'email' in data and data['email']:
        is_valid, message = validate_email(data['email'])
        if not is_valid:
            return False, message
    
    if 'phone' in data and data['phone']:
        is_valid, message = validate_phone(data['phone'])
        if not is_valid:
            return False, message
    
    is_valid, message = validate_date(data['date_of_birth'])
    if not is_valid:
        return False, message
    
    return True, "" 