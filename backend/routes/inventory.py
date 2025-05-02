from flask import Blueprint, request, jsonify, current_app
from models.inventory import InventoryItem
from extensions import db
from datetime import datetime

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/inventory', methods=['GET'])
def get_inventory():
    try:
        current_app.logger.info("Attempting to fetch all inventory items")
        items = InventoryItem.query.filter_by(is_active=True).all()
        current_app.logger.info(f"Successfully fetched {len(items)} inventory items")
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        current_app.logger.error(f"Error fetching inventory items: {str(e)}")
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/inventory/<int:id>', methods=['GET'])
def get_inventory_item(id):
    try:
        current_app.logger.info(f"Attempting to fetch inventory item with id {id}")
        item = InventoryItem.query.get_or_404(id)
        current_app.logger.info(f"Successfully fetched inventory item {id}")
        return jsonify(item.to_dict())
    except Exception as e:
        current_app.logger.error(f"Error fetching inventory item {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/inventory', methods=['POST'])
def create_inventory_item():
    try:
        data = request.get_json()
        current_app.logger.info(f"Attempting to create inventory item with data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'category', 'quantity', 'unit', 'price_per_unit']
        for field in required_fields:
            if field not in data or not data[field]:
                current_app.logger.error(f"Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Convert expiry_date string to datetime if provided
        if 'expiry_date' in data and data['expiry_date']:
            data['expiry_date'] = datetime.fromisoformat(data['expiry_date'])
        
        item = InventoryItem(**data)
        db.session.add(item)
        db.session.commit()
        current_app.logger.info(f"Successfully created inventory item with id {item.id}")
        return jsonify(item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating inventory item: {str(e)}")
        return jsonify({'error': str(e)}), 400

@inventory_bp.route('/inventory/<int:id>', methods=['PUT'])
def update_inventory_item(id):
    try:
        current_app.logger.info(f"Attempting to update inventory item with id {id}")
        item = InventoryItem.query.get_or_404(id)
        data = request.get_json()
        
        # Convert expiry_date string to datetime if provided
        if 'expiry_date' in data and data['expiry_date']:
            data['expiry_date'] = datetime.fromisoformat(data['expiry_date'])
        
        for key, value in data.items():
            if hasattr(item, key):
                setattr(item, key, value)
        
        db.session.commit()
        current_app.logger.info(f"Successfully updated inventory item with id {id}")
        return jsonify(item.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating inventory item {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@inventory_bp.route('/inventory/<int:id>', methods=['DELETE'])
def delete_inventory_item(id):
    try:
        current_app.logger.info(f"Attempting to delete inventory item with id {id}")
        item = InventoryItem.query.get_or_404(id)
        item.is_active = False
        db.session.commit()
        current_app.logger.info(f"Successfully deactivated inventory item with id {id}")
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deactivating inventory item {id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@inventory_bp.route('/inventory/low-stock', methods=['GET'])
def get_low_stock_items():
    try:
        current_app.logger.info("Attempting to fetch low stock items")
        items = InventoryItem.query.filter(
            InventoryItem.quantity <= InventoryItem.minimum_stock,
            InventoryItem.is_active == True
        ).all()
        current_app.logger.info(f"Successfully fetched {len(items)} low stock items")
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        current_app.logger.error(f"Error fetching low stock items: {str(e)}")
        return jsonify({'error': str(e)}), 500 