from datetime import datetime
from app import create_app, db
from models.patient import Patient
from models.doctor import Doctor
from models.appointment import Appointment
from models.billing import BillingRecord
from models.prescription import Prescription, Medication
from models.lab_test import LabTest
from models.inventory import InventoryItem

# --- Sample Data ---
patients = [
    { 'id': 1, 'first_name': 'Ava', 'last_name': 'Patel', 'gender': 'Female', 'date_of_birth': '1985-04-12', 'phone': '123-456-7890', 'email': 'ava.patel@example.com' },
    { 'id': 2, 'first_name': 'Noah', 'last_name': 'Smith', 'gender': 'Male', 'date_of_birth': '1990-09-23', 'phone': '555-123-4567', 'email': 'noah.smith@example.com' },
    { 'id': 3, 'first_name': 'Emma', 'last_name': 'Johnson', 'gender': 'Female', 'date_of_birth': '1978-02-15', 'phone': '222-333-4444', 'email': 'emma.johnson@example.com' },
    { 'id': 4, 'first_name': 'Oliver', 'last_name': 'Williams', 'gender': 'Male', 'date_of_birth': '1982-11-30', 'phone': '333-444-5555', 'email': 'oliver.williams@example.com' },
    { 'id': 5, 'first_name': 'Sophia', 'last_name': 'Brown', 'gender': 'Female', 'date_of_birth': '1995-07-19', 'phone': '444-555-6666', 'email': 'sophia.brown@example.com' },
    { 'id': 6, 'first_name': 'Elijah', 'last_name': 'Jones', 'gender': 'Male', 'date_of_birth': '1988-03-22', 'phone': '666-777-8888', 'email': 'elijah.jones@example.com' },
    { 'id': 7, 'first_name': 'Mia', 'last_name': 'Garcia', 'gender': 'Female', 'date_of_birth': '1992-10-05', 'phone': '777-888-9999', 'email': 'mia.garcia@example.com' },
    { 'id': 8, 'first_name': 'Lucas', 'last_name': 'Martinez', 'gender': 'Male', 'date_of_birth': '1980-06-14', 'phone': '888-999-0000', 'email': 'lucas.martinez@example.com' },
    { 'id': 9, 'first_name': 'Charlotte', 'last_name': 'Davis', 'gender': 'Female', 'date_of_birth': '1987-12-25', 'phone': '999-000-1111', 'email': 'charlotte.davis@example.com' },
    { 'id': 10, 'first_name': 'James', 'last_name': 'Lopez', 'gender': 'Male', 'date_of_birth': '1993-08-08', 'phone': '111-222-3333', 'email': 'james.lopez@example.com' }
]
doctors = [
    { 'id': 1, 'first_name': 'Liam', 'last_name': 'Nguyen', 'specialization': 'Cardiology', 'phone': '234-567-8901', 'email': 'liam.nguyen@hospital.com' },
    { 'id': 2, 'first_name': 'Sophia', 'last_name': 'Kim', 'specialization': 'Pediatrics', 'phone': '345-678-9012', 'email': 'sophia.kim@hospital.com' },
    { 'id': 3, 'first_name': 'Mason', 'last_name': 'Clark', 'specialization': 'Orthopedics', 'phone': '456-789-0123', 'email': 'mason.clark@hospital.com' },
    { 'id': 4, 'first_name': 'Isabella', 'last_name': 'Lewis', 'specialization': 'Dermatology', 'phone': '567-890-1234', 'email': 'isabella.lewis@hospital.com' },
    { 'id': 5, 'first_name': 'Ethan', 'last_name': 'Walker', 'specialization': 'Neurology', 'phone': '678-901-2345', 'email': 'ethan.walker@hospital.com' },
    { 'id': 6, 'first_name': 'Amelia', 'last_name': 'Hall', 'specialization': 'Oncology', 'phone': '789-012-3456', 'email': 'amelia.hall@hospital.com' },
    { 'id': 7, 'first_name': 'Logan', 'last_name': 'Allen', 'specialization': 'Gastroenterology', 'phone': '890-123-4567', 'email': 'logan.allen@hospital.com' },
    { 'id': 8, 'first_name': 'Mila', 'last_name': 'Young', 'specialization': 'Ophthalmology', 'phone': '901-234-5678', 'email': 'mila.young@hospital.com' },
    { 'id': 9, 'first_name': 'Benjamin', 'last_name': 'King', 'specialization': 'Psychiatry', 'phone': '012-345-6789', 'email': 'benjamin.king@hospital.com' },
    { 'id': 10, 'first_name': 'Harper', 'last_name': 'Wright', 'specialization': 'General Medicine', 'phone': '123-456-7891', 'email': 'harper.wright@hospital.com' }
]
appointments = [
    { 'id': 1, 'patient_id': 1, 'doctor_id': 1, 'date': '2025-07-04', 'time': '10:00', 'status': 'scheduled', 'notes': 'Routine checkup' },
    { 'id': 2, 'patient_id': 2, 'doctor_id': 2, 'date': '2025-07-05', 'time': '11:00', 'status': 'completed', 'notes': 'Follow-up' },
    { 'id': 3, 'patient_id': 3, 'doctor_id': 3, 'date': '2025-07-06', 'time': '09:30', 'status': 'scheduled', 'notes': 'Consultation' },
    { 'id': 4, 'patient_id': 4, 'doctor_id': 4, 'date': '2025-07-07', 'time': '14:00', 'status': 'scheduled', 'notes': 'Skin rash' },
    { 'id': 5, 'patient_id': 5, 'doctor_id': 5, 'date': '2025-07-08', 'time': '13:00', 'status': 'scheduled', 'notes': 'Headache' },
    { 'id': 6, 'patient_id': 6, 'doctor_id': 6, 'date': '2025-07-09', 'time': '15:00', 'status': 'scheduled', 'notes': 'Cancer screening' },
    { 'id': 7, 'patient_id': 7, 'doctor_id': 7, 'date': '2025-07-10', 'time': '16:00', 'status': 'scheduled', 'notes': 'Stomach pain' },
    { 'id': 8, 'patient_id': 8, 'doctor_id': 8, 'date': '2025-07-11', 'time': '12:00', 'status': 'scheduled', 'notes': 'Eye checkup' },
    { 'id': 9, 'patient_id': 9, 'doctor_id': 9, 'date': '2025-07-12', 'time': '10:30', 'status': 'scheduled', 'notes': 'Mental health' },
    { 'id': 10, 'patient_id': 10, 'doctor_id': 10, 'date': '2025-07-13', 'time': '11:30', 'status': 'scheduled', 'notes': 'General checkup' }
]
inventory = [
    { 'id': 1, 'name': 'Paracetamol', 'category': 'Medicine', 'quantity': 100, 'unit': 'tablets', 'price_per_unit': 2.5, 'supplier': 'MediSupply', 'expiry_date': '2026-01-01' },
    { 'id': 2, 'name': 'Stethoscope', 'category': 'Equipment', 'quantity': 10, 'unit': 'pieces', 'price_per_unit': 120.0, 'supplier': 'HealthEquip', 'expiry_date': None },
    { 'id': 3, 'name': 'Ibuprofen', 'category': 'Medicine', 'quantity': 200, 'unit': 'tablets', 'price_per_unit': 3.0, 'supplier': 'PharmaPlus', 'expiry_date': '2026-06-01' },
    { 'id': 4, 'name': 'Thermometer', 'category': 'Equipment', 'quantity': 20, 'unit': 'pieces', 'price_per_unit': 15.0, 'supplier': 'MedTools', 'expiry_date': None },
    { 'id': 5, 'name': 'Bandages', 'category': 'Supplies', 'quantity': 500, 'unit': 'rolls', 'price_per_unit': 1.0, 'supplier': 'FirstAidCo', 'expiry_date': None },
    { 'id': 6, 'name': 'Amoxicillin', 'category': 'Medicine', 'quantity': 150, 'unit': 'capsules', 'price_per_unit': 4.0, 'supplier': 'PharmaPlus', 'expiry_date': '2026-09-01' },
    { 'id': 7, 'name': 'Syringe', 'category': 'Supplies', 'quantity': 300, 'unit': 'pieces', 'price_per_unit': 0.5, 'supplier': 'MedTools', 'expiry_date': None },
    { 'id': 8, 'name': 'Blood Pressure Monitor', 'category': 'Equipment', 'quantity': 5, 'unit': 'pieces', 'price_per_unit': 80.0, 'supplier': 'HealthEquip', 'expiry_date': None },
    { 'id': 9, 'name': 'Cough Syrup', 'category': 'Medicine', 'quantity': 50, 'unit': 'bottles', 'price_per_unit': 6.0, 'supplier': 'MediSupply', 'expiry_date': '2026-12-01' },
    { 'id': 10, 'name': 'Gloves', 'category': 'Supplies', 'quantity': 1000, 'unit': 'pairs', 'price_per_unit': 0.2, 'supplier': 'FirstAidCo', 'expiry_date': None }
]
billing = [
    { 'id': 1, 'patient_id': 1, 'appointment_id': 1, 'total_amount': 1500, 'paid_amount': 1500, 'payment_status': 'paid', 'payment_method': 'card', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Paid in full' },
    { 'id': 2, 'patient_id': 2, 'appointment_id': 2, 'total_amount': 2000, 'paid_amount': 500, 'payment_status': 'partial', 'payment_method': 'cash', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Partial payment' },
    { 'id': 3, 'patient_id': 3, 'appointment_id': 3, 'total_amount': 1200, 'paid_amount': 1200, 'payment_status': 'paid', 'payment_method': 'insurance', 'insurance_provider': 'HealthInsure', 'insurance_policy_number': 'HI12345', 'notes': 'Insurance covered' },
    { 'id': 4, 'patient_id': 4, 'appointment_id': 4, 'total_amount': 800, 'paid_amount': 800, 'payment_status': 'paid', 'payment_method': 'cash', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Paid in cash' },
    { 'id': 5, 'patient_id': 5, 'appointment_id': 5, 'total_amount': 950, 'paid_amount': 950, 'payment_status': 'paid', 'payment_method': 'card', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Paid in full' },
    { 'id': 6, 'patient_id': 6, 'appointment_id': 6, 'total_amount': 3000, 'paid_amount': 1000, 'payment_status': 'partial', 'payment_method': 'insurance', 'insurance_provider': 'MediCare', 'insurance_policy_number': 'MC67890', 'notes': 'Partial insurance' },
    { 'id': 7, 'patient_id': 7, 'appointment_id': 7, 'total_amount': 1100, 'paid_amount': 1100, 'payment_status': 'paid', 'payment_method': 'cash', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Paid in cash' },
    { 'id': 8, 'patient_id': 8, 'appointment_id': 8, 'total_amount': 1700, 'paid_amount': 1700, 'payment_status': 'paid', 'payment_method': 'card', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Paid in full' },
    { 'id': 9, 'patient_id': 9, 'appointment_id': 9, 'total_amount': 2100, 'paid_amount': 2100, 'payment_status': 'paid', 'payment_method': 'insurance', 'insurance_provider': 'HealthInsure', 'insurance_policy_number': 'HI54321', 'notes': 'Insurance covered' },
    { 'id': 10, 'patient_id': 10, 'appointment_id': 10, 'total_amount': 1300, 'paid_amount': 1300, 'payment_status': 'paid', 'payment_method': 'cash', 'insurance_provider': None, 'insurance_policy_number': None, 'notes': 'Paid in cash' }
]
prescriptions = [
    { 'id': 1, 'patient_id': 1, 'doctor_id': 1, 'appointment_id': 1, 'medications': [ { 'name': 'Paracetamol', 'dosage': '500mg', 'frequency': '2x daily' } ], 'notes': 'Take after meals' },
    { 'id': 2, 'patient_id': 2, 'doctor_id': 2, 'appointment_id': 2, 'medications': [ { 'name': 'Ibuprofen', 'dosage': '200mg', 'frequency': '3x daily' } ], 'notes': 'With food' },
    { 'id': 3, 'patient_id': 3, 'doctor_id': 3, 'appointment_id': 3, 'medications': [ { 'name': 'Amoxicillin', 'dosage': '250mg', 'frequency': '2x daily' } ], 'notes': 'Complete the course' },
    { 'id': 4, 'patient_id': 4, 'doctor_id': 4, 'appointment_id': 4, 'medications': [ { 'name': 'Cetirizine', 'dosage': '10mg', 'frequency': '1x daily' } ], 'notes': 'For allergy' },
    { 'id': 5, 'patient_id': 5, 'doctor_id': 5, 'appointment_id': 5, 'medications': [ { 'name': 'Aspirin', 'dosage': '75mg', 'frequency': '1x daily' } ], 'notes': 'Heart health' },
    { 'id': 6, 'patient_id': 6, 'doctor_id': 6, 'appointment_id': 6, 'medications': [ { 'name': 'Metformin', 'dosage': '500mg', 'frequency': '2x daily' } ], 'notes': 'Diabetes' },
    { 'id': 7, 'patient_id': 7, 'doctor_id': 7, 'appointment_id': 7, 'medications': [ { 'name': 'Omeprazole', 'dosage': '20mg', 'frequency': '1x daily' } ], 'notes': 'Acidity' },
    { 'id': 8, 'patient_id': 8, 'doctor_id': 8, 'appointment_id': 8, 'medications': [ { 'name': 'Lisinopril', 'dosage': '10mg', 'frequency': '1x daily' } ], 'notes': 'Blood pressure' },
    { 'id': 9, 'patient_id': 9, 'doctor_id': 9, 'appointment_id': 9, 'medications': [ { 'name': 'Atorvastatin', 'dosage': '20mg', 'frequency': '1x daily' } ], 'notes': 'Cholesterol' },
    { 'id': 10, 'patient_id': 10, 'doctor_id': 10, 'appointment_id': 10, 'medications': [ { 'name': 'Azithromycin', 'dosage': '500mg', 'frequency': '1x daily' } ], 'notes': 'Antibiotic' }
]
lab_tests = [
    { 'id': 1, 'patient_id': 1, 'doctor_id': 1, 'appointment_id': 1, 'test_name': 'Blood Test', 'test_type': 'Blood Test', 'test_date': '2025-07-04', 'results': 'Normal', 'status': 'completed', 'notes': '' },
    { 'id': 2, 'patient_id': 2, 'doctor_id': 2, 'appointment_id': 2, 'test_name': 'X-Ray', 'test_type': 'X-Ray', 'test_date': '2025-07-05', 'results': 'Clear', 'status': 'completed', 'notes': '' },
    { 'id': 3, 'patient_id': 3, 'doctor_id': 3, 'appointment_id': 3, 'test_name': 'Urine Test', 'test_type': 'Urine Test', 'test_date': '2025-07-06', 'results': 'Normal', 'status': 'completed', 'notes': '' },
    { 'id': 4, 'patient_id': 4, 'doctor_id': 4, 'appointment_id': 4, 'test_name': 'MRI', 'test_type': 'MRI', 'test_date': '2025-07-07', 'results': 'No issues', 'status': 'completed', 'notes': '' },
    { 'id': 5, 'patient_id': 5, 'doctor_id': 5, 'appointment_id': 5, 'test_name': 'CT Scan', 'test_type': 'CT Scan', 'test_date': '2025-07-08', 'results': 'Normal', 'status': 'completed', 'notes': '' },
    { 'id': 6, 'patient_id': 6, 'doctor_id': 6, 'appointment_id': 6, 'test_name': 'Biopsy', 'test_type': 'Biopsy', 'test_date': '2025-07-09', 'results': 'Benign', 'status': 'completed', 'notes': '' },
    { 'id': 7, 'patient_id': 7, 'doctor_id': 7, 'appointment_id': 7, 'test_name': 'Endoscopy', 'test_type': 'Endoscopy', 'test_date': '2025-07-10', 'results': 'Normal', 'status': 'completed', 'notes': '' },
    { 'id': 8, 'patient_id': 8, 'doctor_id': 8, 'appointment_id': 8, 'test_name': 'Eye Test', 'test_type': 'Eye Test', 'test_date': '2025-07-11', 'results': '20/20 vision', 'status': 'completed', 'notes': '' },
    { 'id': 9, 'patient_id': 9, 'doctor_id': 9, 'appointment_id': 9, 'test_name': 'Psych Eval', 'test_type': 'Psych Eval', 'test_date': '2025-07-12', 'results': 'Stable', 'status': 'completed', 'notes': '' },
    { 'id': 10, 'patient_id': 10, 'doctor_id': 10, 'appointment_id': 10, 'test_name': 'General Lab', 'test_type': 'General Lab', 'test_date': '2025-07-13', 'results': 'All normal', 'status': 'completed', 'notes': '' }
]

def insert_all():
    db.session.query(BillingRecord).delete()
    db.session.query(Medication).delete()
    db.session.query(Prescription).delete()
    db.session.query(LabTest).delete()
    db.session.query(InventoryItem).delete()
    db.session.query(Appointment).delete()
    db.session.query(Patient).delete()
    db.session.query(Doctor).delete()
    db.session.commit()

    for d in doctors:
        db.session.add(Doctor(**d))
    db.session.commit()
    for p in patients:
        dob = datetime.strptime(p['date_of_birth'], '%Y-%m-%d')
        db.session.add(Patient(
            id=p['id'], first_name=p['first_name'], last_name=p['last_name'], gender=p['gender'],
            date_of_birth=dob, phone=p['phone'], email=p['email'], is_active=True
        ))
    db.session.commit()
    for a in appointments:
        db.session.add(Appointment(**a))
    db.session.commit()
    for i in inventory:
        expiry = None
        if i['expiry_date']:
            expiry = datetime.strptime(i['expiry_date'], '%Y-%m-%d')
        db.session.add(InventoryItem(
            id=i['id'], name=i['name'], category=i['category'], quantity=i['quantity'], unit=i['unit'],
            price_per_unit=i['price_per_unit'], supplier=i['supplier'], expiry_date=expiry, minimum_stock=10, is_active=True
        ))
    db.session.commit()
    for b in billing:
        db.session.add(BillingRecord(**b))
    db.session.commit()
    for pres in prescriptions:
        prescription = Prescription(
            id=pres['id'], patient_id=pres['patient_id'], doctor_id=pres['doctor_id'],
            diagnosis='', notes=pres['notes'], is_active=True
        )
        db.session.add(prescription)
        db.session.flush()
        for med in pres['medications']:
            db.session.add(Medication(
                prescription_id=prescription.id,
                name=med['name'], dosage=med.get('dosage', ''), frequency=med.get('frequency', ''), duration=med.get('duration', ''), instructions='', is_active=True
            ))
    db.session.commit()
    for test in lab_tests:
        # Use 'test_date' key, fallback to None if missing
        test_date_str = test.get('test_date')
        test_date = datetime.strptime(test_date_str, '%Y-%m-%d') if test_date_str else None
        db.session.add(LabTest(
            id=test['id'],
            patient_id=test['patient_id'],
            doctor_id=test['doctor_id'],
            test_name=test.get('test_type', ''),
            test_type=test.get('test_type', ''),
            test_date=test_date,
            results=test.get('results', ''),
            status=test.get('status', 'completed'),
            notes=test.get('notes', ''),
            is_active=True
        ))
    db.session.commit()

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        insert_all()
        print("Sample data inserted successfully.")
