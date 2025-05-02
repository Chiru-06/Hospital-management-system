from flask import Blueprint, request, jsonify, current_app
from models.billing import BillingRecord, BillingItem
from extensions import db
from datetime import datetime

billing_bp = Blueprint('billing', __name__)

# Billing Records Routes
@billing_bp.route('/billing', methods=['GET'])
def get_billing_records():
    try:
        current_app.logger.info("Attempting to fetch all billing records")
        records = BillingRecord.query.filter_by(is_active=True).all()
        current_app.logger.info(f"Successfully fetched {len(records)} billing records")
        return jsonify([record.to_dict() for record in records])
    except Exception as e:
        current_app.logger.error(f"Error fetching billing records: {str(e)}")
        return jsonify({'error': str(e)}), 500

@billing_bp.route('/billing/<int:id>', methods=['GET'])
def get_billing_record(id):
    try:
        current_app.logger.info(f"Attempting to fetch billing record with id {id}")
        record = BillingRecord.query.get_or_404(id)
        current_app.logger.info(f"Successfully fetched billing record {id}")
        return jsonify(record.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching billing record {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@billing_bp.route('/billing', methods=['POST'])
def create_billing_record():
    try:
        data = request.get_json()
        current_app.logger.info(f"Attempting to create billing record with data: {data}")
        
        # Validate required fields
        required_fields = ['patient_id', 'total_amount']
        for field in required_fields:
            if field not in data or not data[field]:
                current_app.logger.error(f"Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create billing record
        record = BillingRecord(
            patient_id=data['patient_id'],
            appointment_id=data.get('appointment_id'),
            total_amount=data['total_amount'],
            payment_method=data.get('payment_method'),
            insurance_provider=data.get('insurance_provider'),
            insurance_policy_number=data.get('insurance_policy_number'),
            notes=data.get('notes')
        )
        
        db.session.add(record)
        db.session.commit()
        
        current_app.logger.info(f"Successfully created billing record with id {record.id}")
        return jsonify(record.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating billing record: {str(e)}")
        return jsonify({'error': str(e)}), 400

@billing_bp.route('/billing/<int:id>', methods=['PUT'])
def update_billing_record(id):
    try:
        current_app.logger.info(f"Attempting to update billing record with id {id}")
        record = BillingRecord.query.get_or_404(id)
        data = request.get_json()
        
        # Update fields
        for key, value in data.items():
            if hasattr(record, key):
                # Convert datetime strings to datetime objects
                if key in ['created_at', 'updated_at'] and isinstance(value, str):
                    value = datetime.fromisoformat(value.replace('Z', '+00:00'))
                setattr(record, key, value)
        
        db.session.commit()
        current_app.logger.info(f"Successfully updated billing record with id {id}")
        return jsonify(record.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating billing record {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@billing_bp.route('/billing/<int:id>', methods=['DELETE'])
def delete_billing_record(id):
    try:
        current_app.logger.info(f"Attempting to delete billing record with id {id}")
        record = BillingRecord.query.get_or_404(id)
        record.is_active = False
        db.session.commit()
        current_app.logger.info(f"Successfully deleted billing record with id {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting billing record {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

# Billing Items Routes
@billing_bp.route('/billing/<int:record_id>/items', methods=['GET'])
def get_billing_items(record_id):
    try:
        current_app.logger.info(f"Attempting to fetch billing items for record {record_id}")
        items = BillingItem.query.filter_by(billing_record_id=record_id, is_active=True).all()
        current_app.logger.info(f"Successfully fetched {len(items)} billing items")
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        current_app.logger.error(f"Error fetching billing items: {str(e)}")
        return jsonify({'error': str(e)}), 500

@billing_bp.route('/billing/<int:record_id>/items', methods=['POST'])
def create_billing_item(record_id):
    try:
        data = request.get_json()
        current_app.logger.info(f"Attempting to create billing item for record {record_id}")
        
        # Validate required fields
        required_fields = ['item_type', 'description', 'unit_price']
        for field in required_fields:
            if field not in data or not data[field]:
                current_app.logger.error(f"Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Calculate total price
        quantity = data.get('quantity', 1)
        total_price = quantity * data['unit_price']
        
        # Create billing item
        item = BillingItem(
            billing_record_id=record_id,
            item_type=data['item_type'],
            description=data['description'],
            quantity=quantity,
            unit_price=data['unit_price'],
            total_price=total_price
        )
        
        db.session.add(item)
        db.session.commit()
        
        current_app.logger.info(f"Successfully created billing item with id {item.id}")
        return jsonify(item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating billing item: {str(e)}")
        return jsonify({'error': str(e)}), 400

@billing_bp.route('/billing/items/<int:id>', methods=['PUT'])
def update_billing_item(id):
    try:
        current_app.logger.info(f"Attempting to update billing item with id {id}")
        item = BillingItem.query.get_or_404(id)
        data = request.get_json()
        
        # Update fields
        for key, value in data.items():
            if hasattr(item, key):
                setattr(item, key, value)
        
        # Recalculate total price if quantity or unit_price changed
        if 'quantity' in data or 'unit_price' in data:
            item.total_price = item.quantity * item.unit_price
        
        db.session.commit()
        current_app.logger.info(f"Successfully updated billing item with id {id}")
        return jsonify(item.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating billing item {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@billing_bp.route('/billing/items/<int:id>', methods=['DELETE'])
def delete_billing_item(id):
    try:
        current_app.logger.info(f"Attempting to delete billing item with id {id}")
        item = BillingItem.query.get_or_404(id)
        item.is_active = False
        db.session.commit()
        current_app.logger.info(f"Successfully deleted billing item with id {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting billing item {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400 