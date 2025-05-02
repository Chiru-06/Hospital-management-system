from flask import jsonify, request
from models import Patient
from extensions import db
import traceback

def get_patients():
    try:
        patients = Patient.query.all()
        print('Number of patients found:', len(patients))
        
        formatted_patients = []
        for patient in patients:
            try:
                formatted_patients.append({
                    'id': patient.id,
                    'first_name': patient.first_name,
                    'last_name': patient.last_name,
                    'date_of_birth': patient.date_of_birth.isoformat(),
                    'gender': patient.gender,
                    'address': patient.address,
                    'phone': patient.phone,
                    'email': patient.email
                })
            except Exception as e:
                print(f'Error formatting patient {patient.id}:', str(e))
                print('Patient object:', patient)
        
        return jsonify(formatted_patients)
    except Exception as e:
        print('Error in get_patients:', str(e))
        print('Traceback:', traceback.format_exc())
        return jsonify({'message': 'Internal server error'}), 500