from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from extensions import db

class BillingRecord(db.Model):
    __tablename__ = 'billing_records'

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    appointment_id = Column(Integer, ForeignKey('appointments.id'), nullable=True)
    total_amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0.0)
    payment_status = Column(String(20), default='pending')  # pending, partial, paid
    payment_method = Column(String(50))  # cash, card, insurance, etc.
    insurance_provider = Column(String(100))
    insurance_policy_number = Column(String(50))
    notes = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship('Patient', backref='billing_records')
    appointment = relationship('Appointment', backref='billing_records')

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'appointment_id': self.appointment_id,
            'total_amount': self.total_amount,
            'paid_amount': self.paid_amount,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'insurance_provider': self.insurance_provider,
            'insurance_policy_number': self.insurance_policy_number,
            'notes': self.notes,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class BillingItem(db.Model):
    __tablename__ = 'billing_items'

    id = Column(Integer, primary_key=True)
    billing_record_id = Column(Integer, ForeignKey('billing_records.id'), nullable=False)
    item_type = Column(String(50), nullable=False)  # consultation, procedure, medication, test, etc.
    description = Column(String(200), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    billing_record = relationship('BillingRecord', backref='items')

    def to_dict(self):
        return {
            'id': self.id,
            'billing_record_id': self.billing_record_id,
            'item_type': self.item_type,
            'description': self.description,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 