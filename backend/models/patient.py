from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, CheckConstraint, Boolean
from sqlalchemy.orm import relationship
from extensions import db

class Patient(db.Model):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)
    __table_args__ = (
        CheckConstraint("gender IN ('Male', 'Female', 'Other')", name='check_gender'),
    )
    address = Column(String(200), nullable=False, default='')
    phone = Column(String(15), nullable=False)
    email = Column(String(100), nullable=False, default='')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Add relationships
    prescriptions = relationship('Prescription', back_populates='patient', cascade='all, delete-orphan')
    lab_tests = relationship('LabTest', back_populates='patient', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth.strftime('%Y-%m-%d'),
            'gender': self.gender,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 