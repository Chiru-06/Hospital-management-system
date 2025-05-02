from flask import Blueprint, request, jsonify, current_app
from models import Patient
from extensions import db
from datetime import datetime
import re

patients_bp = Blueprint('patients', __name__)

def validate_phone(phone):
    # Indian phone number validation (10 digits starting with 6-9)
    pattern = r'^[6-9]\d{9}$'
    return bool(re.match(pattern, phone))

def validate_email(email):
    if not email:  # Allow empty email since we have a default value
        return True
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

@patients_bp.route('/patients', methods=['GET'])
def get_patients():
    try:
        current_app.logger.info("Attempting to fetch all patients")
        patients = Patient.query.all()
        current_app.logger.info(f"Successfully fetched {len(patients)} patients")
        return jsonify([patient.to_dict() for patient in patients])
    except Exception as e:
        current_app.logger.error(f"Error fetching patients: {str(e)}")
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/patients/<int:id>', methods=['GET'])
def get_patient(id):
    try:
        current_app.logger.info(f"Attempting to fetch patient with id {id}")
        patient = Patient.query.get_or_404(id)
        current_app.logger.info(f"Successfully fetched patient {id}")
        return jsonify(patient.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching patient {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/patients', methods=['POST'])
def create_patient():
    try:
        data = request.get_json()
        current_app.logger.info(f"Attempting to create patient with data: {data}")
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'phone']
        for field in required_fields:
            if field not in data or not data[field]:
                current_app.logger.error(f"Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate phone number
        if not validate_phone(data['phone']):
            current_app.logger.error("Invalid phone number format")
            return jsonify({'error': 'Invalid phone number format. Must be a valid Indian mobile number (10 digits starting with 6-9)'}), 400
        
        # Validate email if provided
        if 'email' in data and data['email'] and not validate_email(data['email']):
            current_app.logger.error("Invalid email format")
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate gender
        if data['gender'] not in ['Male', 'Female', 'Other']:
            current_app.logger.error("Invalid gender value")
            return jsonify({'error': 'Gender must be Male, Female, or Other'}), 400
        
        patient = Patient(
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
            gender=data['gender'],
            address=data.get('address', ''),
            phone=data['phone'],
            email=data.get('email', '')
        )
        db.session.add(patient)
        db.session.commit()
        current_app.logger.info(f"Successfully created patient with id {patient.id}")
        return jsonify(patient.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating patient: {str(e)}")
        return jsonify({'error': str(e)}), 400

@patients_bp.route('/patients/<int:id>', methods=['PUT'])
def update_patient(id):
    try:
        current_app.logger.info(f"Attempting to update patient with id {id}")
        patient = Patient.query.get_or_404(id)
        data = request.get_json()
        
        # Validate phone number if being updated
        if 'phone' in data:
            if not validate_phone(data['phone']):
                current_app.logger.error("Invalid phone number format")
                return jsonify({'error': 'Invalid phone number format. Must be a valid Indian mobile number (10 digits starting with 6-9)'}), 400
            patient.phone = data['phone']
        
        # Validate email if being updated
        if 'email' in data:
            if data['email'] and not validate_email(data['email']):
                current_app.logger.error("Invalid email format")
                return jsonify({'error': 'Invalid email format'}), 400
            patient.email = data['email']
        
        # Validate gender if being updated
        if 'gender' in data:
            if data['gender'] not in ['Male', 'Female', 'Other']:
                current_app.logger.error("Invalid gender value")
                return jsonify({'error': 'Gender must be Male, Female, or Other'}), 400
            patient.gender = data['gender']
        
        if 'first_name' in data:
            patient.first_name = data['first_name']
        if 'last_name' in data:
            patient.last_name = data['last_name']
        if 'date_of_birth' in data:
            patient.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        if 'address' in data:
            patient.address = data['address']
        
        db.session.commit()
        current_app.logger.info(f"Successfully updated patient with id {id}")
        return jsonify(patient.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating patient {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@patients_bp.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):
    try:
        current_app.logger.info(f"Attempting to delete patient with id {id}")
        patient = Patient.query.get_or_404(id)
        db.session.delete(patient)
        db.session.commit()
        current_app.logger.info(f"Successfully deleted patient with id {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting patient {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400 