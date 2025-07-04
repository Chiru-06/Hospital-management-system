from datetime import datetime, timedelta
import random
import json
import os
from faker import Faker
from app import create_app, db
from models.patient import Patient
from models.doctor import Doctor
from models.appointment import Appointment
from models.billing import BillingRecord
from models.prescription import Prescription, Medication
from models.lab_test import LabTest
from models.inventory import InventoryItem

fake = Faker()

def generate_sample_data():
    # Clear existing data
    BillingRecord.query.delete()
    Medication.query.delete()
    Prescription.query.delete()
    LabTest.query.delete()
    InventoryItem.query.delete()
    Appointment.query.delete()
    Patient.query.delete()
    Doctor.query.delete()
    db.session.commit()

    # Load sample data from JSON
    sample_path = os.path.join(os.path.dirname(__file__), 'sample_data.json')
    with open(sample_path, 'r') as f:
        data = json.load(f)

    # Add doctors
    doctor_map = {}
    for doc in data.get('doctors', []):
        doctor = Doctor(
            id=doc['id'],
            first_name=doc['first_name'],
            last_name=doc['last_name'],
            specialization=doc['specialization'],
            phone=doc['phone'],
            email=doc['email'],
            is_active=True
        )
        db.session.add(doctor)
        doctor_map[doc['id']] = doctor
    db.session.commit()

    # Add patients
    patient_map = {}
    for pat in data.get('patients', []):
        patient = Patient(
            id=pat['id'],
            first_name=pat['first_name'],
            last_name=pat['last_name'],
            date_of_birth=pat['date_of_birth'],
            gender=pat['gender'],
            address=pat.get('address', ''),
            phone=pat['phone'],
            email=pat['email'],
            is_active=True
        )
        db.session.add(patient)
        patient_map[pat['id']] = patient
    db.session.commit()

    # Add appointments
    appointment_map = {}
    for appt in data.get('appointments', []):
        appointment = Appointment(
            id=appt['id'],
            patient_id=appt['patient_id'],
            doctor_id=appt['doctor_id'],
            date=appt['date'],
            time=appt['time'],
            status=appt['status'],
            notes=appt['notes']
        )
        db.session.add(appointment)
        appointment_map[appt['id']] = appointment
    db.session.commit()

    # Add inventory
    for item in data.get('inventory', []):
        inv = InventoryItem(
            id=item['id'],
            name=item['name'],
            category=item['category'],
            quantity=item['quantity'],
            unit=item['unit'],
            price_per_unit=item['price_per_unit'],
            supplier=item['supplier'],
            expiry_date=item['expiry_date'],
            minimum_stock=10,
            is_active=True
        )
        db.session.add(inv)
    db.session.commit()

    # Add billing
    for bill in data.get('billing', []):
        billing = BillingRecord(
            id=bill['id'],
            patient_id=bill['patient_id'],
            appointment_id=bill['appointment_id'],
            total_amount=bill['total_amount'],
            paid_amount=bill['paid_amount'],
            payment_status=bill['payment_status'],
            payment_method=bill['payment_method'],
            insurance_provider=bill.get('insurance_provider'),
            insurance_policy_number=bill.get('insurance_policy_number'),
            notes=bill.get('notes', ''),
            is_active=True
        )
        db.session.add(billing)
    db.session.commit()

    # Add prescriptions and medications
    for pres in data.get('prescriptions', []):
        prescription = Prescription(
            id=pres['id'],
            patient_id=pres['patient_id'],
            doctor_id=pres['doctor_id'],
            appointment_id=pres.get('appointment_id'),
            diagnosis='',
            notes=pres.get('notes', ''),
            is_active=True
        )
        db.session.add(prescription)
        db.session.flush()
        for med in pres.get('medications', []):
            medication = Medication(
                prescription_id=prescription.id,
                name=med['name'],
                dosage=med.get('dosage', ''),
                frequency=med.get('frequency', ''),
                duration=med.get('duration', ''),
                instructions='',
                is_active=True
            )
            db.session.add(medication)
    db.session.commit()

    # Add lab tests
    for test in data.get('lab_tests', []):
        lab = LabTest(
            id=test['id'],
            patient_id=test['patient_id'],
            doctor_id=test['doctor_id'],
            appointment_id=test.get('appointment_id'),
            test_name=test.get('test_type', ''),
            test_type=test.get('test_type', ''),
            test_date=test.get('date', datetime.now().date()),
            results=test.get('result', ''),
            status='completed',
            notes='',
            is_active=True
        )
        db.session.add(lab)
    db.session.commit()

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        generate_sample_data()
        print("Successfully generated sample data!")