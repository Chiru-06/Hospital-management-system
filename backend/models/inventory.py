from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from extensions import db

class InventoryItem(db.Model):
    __tablename__ = 'inventory_items'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # Medicine, Equipment, Supplies
    quantity = Column(Integer, nullable=False)
    unit = Column(String(20), nullable=False)  # pieces, boxes, bottles, etc.
    price_per_unit = Column(Float, nullable=False)
    supplier = Column(String(100))
    expiry_date = Column(DateTime)
    minimum_stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'quantity': self.quantity,
            'unit': self.unit,
            'price_per_unit': self.price_per_unit,
            'supplier': self.supplier,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'minimum_stock': self.minimum_stock,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 