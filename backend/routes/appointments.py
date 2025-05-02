from flask import Blueprint, request, jsonify, current_app
from models.appointment import Appointment
from extensions import db
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/appointments', methods=['GET'])
def get_appointments():
    try:
        current_app.logger.info("Attempting to fetch all appointments")
        appointments = Appointment.query.all()
        current_app.logger.info(f"Successfully fetched {len(appointments)} appointments")
        return jsonify([appointment.to_dict() for appointment in appointments])
    except Exception as e:
        current_app.logger.error(f"Error fetching appointments: {str(e)}")
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/appointments/<int:id>', methods=['GET'])
def get_appointment(id):
    try:
        current_app.logger.info(f"Attempting to fetch appointment with id {id}")
        appointment = Appointment.query.get_or_404(id)
        current_app.logger.info(f"Successfully fetched appointment {id}")
        return jsonify(appointment.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching appointment {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/appointments', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        current_app.logger.info(f"Attempting to create appointment with data: {data}")
        
        # Validate required fields
        required_fields = ['patient_id', 'doctor_id', 'date', 'time']
        for field in required_fields:
            if field not in data or not data[field]:
                current_app.logger.error(f"Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        appointment = Appointment(
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            date=data['date'],
            time=data['time'],
            notes=data.get('notes', '')
        )
        db.session.add(appointment)
        db.session.commit()
        current_app.logger.info(f"Successfully created appointment with id {appointment.id}")
        return jsonify(appointment.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating appointment: {str(e)}")
        return jsonify({'error': str(e)}), 400

@appointments_bp.route('/appointments/<int:id>', methods=['PUT'])
def update_appointment(id):
    try:
        current_app.logger.info(f"Attempting to update appointment with id {id}")
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        
        if 'patient_id' in data:
            appointment.patient_id = data['patient_id']
        if 'doctor_id' in data:
            appointment.doctor_id = data['doctor_id']
        if 'date' in data:
            appointment.date = data['date']
        if 'time' in data:
            appointment.time = data['time']
        if 'status' in data:
            appointment.status = data['status']
        if 'notes' in data:
            appointment.notes = data['notes']
        
        db.session.commit()
        current_app.logger.info(f"Successfully updated appointment with id {id}")
        return jsonify(appointment.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating appointment {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@appointments_bp.route('/appointments/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    try:
        current_app.logger.info(f"Attempting to delete appointment with id {id}")
        appointment = Appointment.query.get_or_404(id)
        db.session.delete(appointment)
        db.session.commit()
        current_app.logger.info(f"Successfully deleted appointment with id {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting appointment {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400 