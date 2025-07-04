from flask import Blueprint, jsonify
# from flask_jwt_extended import jwt_required
# from utils.rbac import role_required
from models.patient import Patient
from models.appointment import Appointment
from models.billing import BillingRecord
from models.inventory import InventoryItem

admin_dashboard_bp = Blueprint('admin_dashboard', __name__)

@admin_dashboard_bp.route('/api/dashboard/admin-stats', methods=['GET'])
# @jwt_required()
# @role_required('admin', 'manager')
def admin_stats():
    total_patients = Patient.query.count()
    total_appointments = Appointment.query.count()
    total_revenue = BillingRecord.query.with_entities(BillingRecord.total_amount).all()
    total_revenue = sum([r[0] for r in total_revenue]) if total_revenue else 0
    inventory_count = InventoryItem.query.count()
    return jsonify({
        'total_patients': total_patients,
        'total_appointments': total_appointments,
        'total_revenue': total_revenue,
        'inventory_count': inventory_count
    })
