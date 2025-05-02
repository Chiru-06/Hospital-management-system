from flask import Blueprint, request, jsonify, current_app
from models import Doctor, Appointment
from extensions import db
from datetime import datetime

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/doctors', methods=['GET'])
def get_doctors():
    try:
        current_app.logger.info("Attempting to fetch all doctors")
        doctors = Doctor.query.filter_by(is_active=True).all()
        current_app.logger.info(f"Successfully fetched {len(doctors)} doctors")
        return jsonify([doctor.to_dict() for doctor in doctors])
    except Exception as e:
        current_app.logger.error(f"Error fetching doctors: {str(e)}")
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    try:
        current_app.logger.info(f"Attempting to fetch doctor with id {id}")
        doctor = Doctor.query.get_or_404(id)
        current_app.logger.info(f"Successfully fetched doctor {id}")
        return jsonify(doctor.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching doctor {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/doctors/<int:id>/availability', methods=['GET'])
def check_doctor_availability(id):
    try:
        date = request.args.get('date')
        time = request.args.get('time')
        
        if not date or not time:
            return jsonify({'error': 'Date and time are required'}), 400
            
        # Check if doctor exists and is active
        doctor = Doctor.query.filter_by(id=id, is_active=True).first()
        if not doctor:
            return jsonify({'error': 'Doctor not found or inactive'}), 404
            
        # Check for existing appointments at the same date and time
        existing_appointment = Appointment.query.filter_by(
            doctor_id=id,
            date=date,
            time=time,
            status='scheduled'
        ).first()
        
        is_available = not existing_appointment
        
        return jsonify([{
            'doctor_id': id,
            'date': date,
            'time': time,
            'is_available': is_available
        }])
        
    except Exception as e:
        current_app.logger.error(f"Error checking doctor availability: {str(e)}")
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/doctors', methods=['POST'])
def create_doctor():
    try:
        data = request.get_json()
        current_app.logger.info(f"Attempting to create doctor with data: {data}")
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'specialization', 'phone', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                current_app.logger.error(f"Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        doctor = Doctor(
            first_name=data['first_name'],
            last_name=data['last_name'],
            specialization=data['specialization'],
            phone=data['phone'],
            email=data['email']
        )
        db.session.add(doctor)
        db.session.commit()
        current_app.logger.info(f"Successfully created doctor with id {doctor.id}")
        return jsonify(doctor.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating doctor: {str(e)}")
        return jsonify({'error': str(e)}), 400

@doctors_bp.route('/doctors/<int:id>', methods=['PUT'])
def update_doctor(id):
    try:
        current_app.logger.info(f"Attempting to update doctor with id {id}")
        doctor = Doctor.query.get_or_404(id)
        data = request.get_json()
        
        if 'first_name' in data:
            doctor.first_name = data['first_name']
        if 'last_name' in data:
            doctor.last_name = data['last_name']
        if 'specialization' in data:
            doctor.specialization = data['specialization']
        if 'phone' in data:
            doctor.phone = data['phone']
        if 'email' in data:
            doctor.email = data['email']
        if 'is_active' in data:
            doctor.is_active = data['is_active']
        
        db.session.commit()
        current_app.logger.info(f"Successfully updated doctor with id {id}")
        return jsonify(doctor.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating doctor {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@doctors_bp.route('/doctors/<int:id>', methods=['DELETE'])
def delete_doctor(id):
    try:
        current_app.logger.info(f"Attempting to delete doctor with id {id}")
        doctor = Doctor.query.get_or_404(id)
        doctor.is_active = False
        db.session.commit()
        current_app.logger.info(f"Successfully deactivated doctor with id {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deactivating doctor {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400 