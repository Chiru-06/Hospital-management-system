from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from extensions import db

class LabTest(db.Model):
    __tablename__ = 'lab_tests'

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    test_name = Column(String(100), nullable=False)
    test_type = Column(String(50), nullable=False)
    test_date = Column(DateTime, nullable=False)
    results = Column(Text)
    status = Column(String(20), nullable=False, default='pending')
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship('Patient', back_populates='lab_tests')
    doctor = relationship('Doctor', back_populates='lab_tests')

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'test_name': self.test_name,
            'test_type': self.test_type,
            'test_date': self.test_date.isoformat() if self.test_date else None,
            'results': self.results,
            'status': self.status,
            'notes': self.notes,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 