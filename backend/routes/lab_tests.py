from flask import Blueprint, request, jsonify, current_app
from models.lab_test import LabTest
from models.patient import Patient
from models.doctor import Doctor
from extensions import db
from datetime import datetime

lab_tests_bp = Blueprint('lab_tests', __name__)

@lab_tests_bp.route('/lab-tests', methods=['GET'])
def get_lab_tests():
    try:
        current_app.logger.info("Attempting to fetch all lab tests")
        lab_tests = LabTest.query.filter_by(is_active=True).order_by(LabTest.created_at.desc()).all()
        current_app.logger.info(f"Successfully fetched {len(lab_tests)} lab tests")
        return jsonify([test.to_dict() for test in lab_tests])
    except Exception as e:
        current_app.logger.error(f"Error fetching lab tests: {str(e)}")
        return jsonify({'error': 'Failed to fetch lab tests'}), 500

@lab_tests_bp.route('/lab-tests/<int:id>', methods=['GET'])
def get_lab_test(id):
    try:
        current_app.logger.info(f"Attempting to fetch lab test with id {id}")
        test = LabTest.query.get_or_404(id)
        if not test.is_active:
            return jsonify({'error': 'Lab test not found'}), 404
        return jsonify(test.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching lab test {id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch lab test'}), 500

@lab_tests_bp.route('/lab-tests', methods=['POST'])
def create_lab_test():
    try:
        data = request.get_json()
        current_app.logger.info(f"Received lab test data: {data}")
        
        # Validate required fields
        required_fields = ['patient_id', 'doctor_id', 'test_name', 'test_type', 'test_date']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            current_app.logger.error(f"Missing required fields: {missing_fields}")
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Check if patient exists
        patient = Patient.query.get(data['patient_id'])
        if not patient:
            current_app.logger.error(f"Patient with ID {data['patient_id']} not found")
            return jsonify({'error': f'Patient with ID {data["patient_id"]} not found'}), 400
        if not patient.is_active:
            current_app.logger.error(f"Patient with ID {data['patient_id']} is inactive")
            return jsonify({'error': f'Patient with ID {data["patient_id"]} is inactive'}), 400
            
        # Check if doctor exists
        doctor = Doctor.query.get(data['doctor_id'])
        if not doctor:
            current_app.logger.error(f"Doctor with ID {data['doctor_id']} not found")
            return jsonify({'error': f'Doctor with ID {data["doctor_id"]} not found'}), 400
        if not doctor.is_active:
            current_app.logger.error(f"Doctor with ID {data['doctor_id']} is inactive")
            return jsonify({'error': f'Doctor with ID {data["doctor_id"]} is inactive'}), 400
        
        # Create lab test
        try:
            lab_test = LabTest(
                patient_id=data['patient_id'],
                doctor_id=data['doctor_id'],
                test_name=data['test_name'],
                test_type=data['test_type'],
                test_date=datetime.strptime(data['test_date'], '%Y-%m-%d'),
                results=data.get('results', ''),
                status=data.get('status', 'pending'),
                notes=data.get('notes', ''),
                is_active=True
            )
            db.session.add(lab_test)
            db.session.commit()
            current_app.logger.info(f"Successfully created lab test {lab_test.id}")
            return jsonify(lab_test.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating lab test: {str(e)}")
            return jsonify({'error': f'Failed to create lab test: {str(e)}'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error processing lab test creation: {str(e)}")
        return jsonify({'error': str(e)}), 400

@lab_tests_bp.route('/lab-tests/<int:id>', methods=['PUT'])
def update_lab_test(id):
    try:
        current_app.logger.info(f"Attempting to update lab test {id}")
        test = LabTest.query.get_or_404(id)
        if not test.is_active:
            return jsonify({'error': 'Lab test not found'}), 404
            
        data = request.get_json()
        
        # Update fields
        if 'test_name' in data:
            test.test_name = data['test_name']
        if 'test_type' in data:
            test.test_type = data['test_type']
        if 'test_date' in data:
            test.test_date = datetime.strptime(data['test_date'], '%Y-%m-%d')
        if 'results' in data:
            test.results = data['results']
        if 'status' in data:
            test.status = data['status']
        if 'notes' in data:
            test.notes = data['notes']
            
        db.session.commit()
        current_app.logger.info(f"Successfully updated lab test {id}")
        return jsonify(test.to_dict())
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating lab test {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@lab_tests_bp.route('/lab-tests/<int:id>', methods=['DELETE'])
def delete_lab_test(id):
    try:
        current_app.logger.info(f"Attempting to delete lab test {id}")
        test = LabTest.query.get_or_404(id)
        test.is_active = False
        db.session.commit()
        current_app.logger.info(f"Successfully deleted lab test {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting lab test {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400 