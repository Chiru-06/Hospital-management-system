from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from models import db, Patient, Doctor, Appointment, BillingRecord
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        # Get total patients
        total_patients = db.session.query(func.count(Patient.id)).scalar() or 0

        # Get total doctors
        total_doctors = db.session.query(func.count(Doctor.id)).scalar() or 0

        # Get total appointments
        total_appointments = db.session.query(func.count(Appointment.id)).scalar() or 0

        # Get monthly revenue
        first_day_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_revenue = db.session.query(func.sum(BillingRecord.paid_amount)).filter(
            BillingRecord.created_at >= first_day_of_month,
            BillingRecord.is_active == True
        ).scalar() or 0

        return jsonify({
            'totalPatients': total_patients,
            'totalDoctors': total_doctors,
            'totalAppointments': total_appointments,
            'monthlyRevenue': float(monthly_revenue)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500 