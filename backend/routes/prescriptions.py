from flask import Blueprint, request, jsonify, current_app
from models.prescription import Prescription, Medication
from models.patient import Patient
from models.doctor import Doctor
from extensions import db

prescriptions_bp = Blueprint('prescriptions', __name__)

@prescriptions_bp.route('/prescriptions', methods=['GET'])
def get_prescriptions():
    try:
        prescriptions = Prescription.query.filter_by(is_active=True).order_by(Prescription.created_at.desc()).all()
        current_app.logger.info(f"Fetched {len(prescriptions)} prescriptions")
        prescription_data = []
        for prescription in prescriptions:
            data = prescription.to_dict()
            # Only include active medications
            data['medications'] = [med.to_dict() for med in prescription.medications if med.is_active]
            prescription_data.append(data)
        return jsonify(prescription_data)
    except Exception as e:
        current_app.logger.error(f"Error fetching prescriptions: {str(e)}")
        return jsonify({'error': 'Failed to fetch prescriptions'}), 500

@prescriptions_bp.route('/prescriptions/<int:id>', methods=['GET'])
def get_prescription(id):
    try:
        prescription = Prescription.query.get_or_404(id)
        if not prescription.is_active:
            return jsonify({'error': 'Prescription not found'}), 404
        return jsonify(prescription.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching prescription {id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch prescription'}), 500

@prescriptions_bp.route('/prescriptions', methods=['POST'])
def create_prescription():
    try:
        data = request.get_json()
        current_app.logger.info(f"Received prescription data: {data}")
        
        # Validate required fields
        required_fields = ['patient_id', 'doctor_id', 'diagnosis']
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
        
        # Create prescription
        try:
            prescription = Prescription(
                patient_id=data['patient_id'],
                doctor_id=data['doctor_id'],
                diagnosis=data['diagnosis'],
                notes=data.get('notes', ''),
                is_active=True
            )
            db.session.add(prescription)
            
            # Add medications if provided
            if 'medications' in data and data['medications']:
                current_app.logger.info(f"Adding medications: {data['medications']}")
                for med_data in data['medications']:
                    medication = Medication(
                        name=med_data['name'],
                        dosage=med_data['dosage'],
                        frequency=med_data['frequency'],
                        duration=med_data.get('duration', ''),
                        instructions=med_data.get('instructions', ''),
                        is_active=True
                    )
                    prescription.medications.append(medication)
            
            db.session.commit()
            current_app.logger.info(f"Successfully created prescription {prescription.id}")
            return jsonify(prescription.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating prescription: {str(e)}")
            current_app.logger.error(f"Error type: {type(e)}")
            current_app.logger.error(f"Error args: {e.args}")
            return jsonify({'error': f'Failed to create prescription: {str(e)}'}), 500
            
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Unexpected error in create_prescription: {str(e)}")
        current_app.logger.error(f"Error type: {type(e)}")
        current_app.logger.error(f"Error args: {e.args}")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@prescriptions_bp.route('/prescriptions/<int:id>', methods=['PUT'])
def update_prescription(id):
    try:
        prescription = Prescription.query.get_or_404(id)
        if not prescription.is_active:
            return jsonify({'error': 'Prescription not found'}), 404
        
        data = request.get_json()
        
        # Update basic fields
        if 'diagnosis' in data:
            prescription.diagnosis = data['diagnosis']
        if 'notes' in data:
            prescription.notes = data['notes']
        
        # Update medications
        if 'medications' in data:
            # Remove existing medications
            for medication in prescription.medications:
                medication.is_active = False
            
            # Add new medications
            for med_data in data['medications']:
                medication = Medication(
                    name=med_data['name'],
                    dosage=med_data['dosage'],
                    frequency=med_data['frequency'],
                    duration=med_data.get('duration'),
                    instructions=med_data.get('instructions')
                )
                prescription.medications.append(medication)
        
        db.session.commit()
        
        current_app.logger.info(f"Updated prescription {id}")
        return jsonify(prescription.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating prescription {id}: {str(e)}")
        return jsonify({'error': 'Failed to update prescription'}), 500

@prescriptions_bp.route('/prescriptions/<int:id>', methods=['DELETE'])
def delete_prescription(id):
    try:
        prescription = Prescription.query.get_or_404(id)
        if not prescription.is_active:
            return jsonify({'error': 'Prescription not found'}), 404
        
        prescription.is_active = False
        db.session.commit()
        
        current_app.logger.info(f"Deleted prescription {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting prescription {id}: {str(e)}")
        return jsonify({'error': 'Failed to delete prescription'}), 500

@prescriptions_bp.route('/prescriptions/patient/<int:patient_id>', methods=['GET'])
def get_prescriptions_by_patient(patient_id):
    try:
        # Check if patient exists
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': f'Patient with ID {patient_id} not found'}), 404
        if not patient.is_active:
            return jsonify({'error': f'Patient with ID {patient_id} is inactive'}), 400

        prescriptions = Prescription.query.filter_by(
            patient_id=patient_id,
            is_active=True
        ).order_by(Prescription.created_at.desc()).all()
        
        current_app.logger.info(f"Fetched {len(prescriptions)} prescriptions for patient {patient_id}")
        prescription_data = []
        for prescription in prescriptions:
            data = prescription.to_dict()
            # Only include active medications
            data['medications'] = [med.to_dict() for med in prescription.medications if med.is_active]
            prescription_data.append(data)
        return jsonify(prescription_data)
    except Exception as e:
        current_app.logger.error(f"Error fetching prescriptions for patient {patient_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch prescriptions'}), 500 