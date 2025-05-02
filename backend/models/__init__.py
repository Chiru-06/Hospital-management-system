from extensions import db

# Import all models
from .patient import Patient
from .doctor import Doctor
from .appointment import Appointment
from .billing import BillingRecord, BillingItem
from .inventory import InventoryItem
from .lab_test import LabTest
from .prescription import Prescription
from .user import User

# Make all models available at the package level
__all__ = [
    'db',
    'Patient',
    'Doctor',
    'Appointment',
    'BillingRecord',
    'BillingItem',
    'InventoryItem',
    'LabTest',
    'Prescription',
    'User'
]

# This file makes the models directory a proper Python package 