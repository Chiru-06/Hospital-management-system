from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from utils.rbac import role_required

# Doctor dashboard

doctor_dashboard_bp = Blueprint('doctor_dashboard', __name__)

@doctor_dashboard_bp.route('/api/doctor/dashboard', methods=['GET'])
@jwt_required()
@role_required('doctor')
def doctor_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    # Return doctor-specific dashboard data (placeholder)
    return jsonify({
        'message': f'Welcome Dr. {user.username}',
        'appointments': [],
        'lab_tests': [],
        'profile': user.to_dict()
    })

# Patient dashboard

patient_dashboard_bp = Blueprint('patient_dashboard', __name__)

@patient_dashboard_bp.route('/api/patient/dashboard', methods=['GET'])
@jwt_required()
@role_required('patient')
def patient_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    # Return patient-specific dashboard data (placeholder)
    return jsonify({
        'message': f'Welcome {user.username}',
        'appointments': [],
        'lab_results': [],
        'prescriptions': [],
        'billing': [],
        'profile': user.to_dict()
    })

# Manager dashboard

manager_dashboard_bp = Blueprint('manager_dashboard', __name__)

@manager_dashboard_bp.route('/api/manager/dashboard', methods=['GET'])
@jwt_required()
@role_required('manager')
def manager_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    # Return manager-specific dashboard data (placeholder)
    return jsonify({
        'message': f'Welcome Manager {user.username}',
        'billing': [],
        'inventory': [],
        'profile': user.to_dict()
    })
