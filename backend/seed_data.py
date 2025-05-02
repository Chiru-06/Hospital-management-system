from datetime import datetime, timedelta
import random
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

    # Generate 50 doctors
    doctors = []
    for _ in range(50):
        name = fake.name().split()
        doctor = Doctor(
            first_name=name[0],
            last_name=name[1] if len(name) > 1 else fake.last_name(),
            specialization=random.choice([
                "Cardiology", "Neurology", "Pediatrics", "Orthopedics", 
                "Dermatology", "Ophthalmology", "ENT", "General Medicine"
            ]),
            phone=fake.phone_number(),
            email=fake.email(),
            is_active=True
        )
        doctors.append(doctor)
        db.session.add(doctor)
    db.session.commit()

    # Generate 50 patients
    patients = []
    for _ in range(50):
        name = fake.name().split()
        dob = datetime.now() - timedelta(days=random.randint(365*5, 365*90))
        patient = Patient(
            first_name=name[0],
            last_name=name[1] if len(name) > 1 else fake.last_name(),
            date_of_birth=dob.date(),
            gender=random.choice(["Male", "Female", "Other"]),
            address=fake.address(),
            phone=fake.phone_number(),
            email=fake.email(),
            is_active=True
        )
        patients.append(patient)
        db.session.add(patient)
    db.session.commit()

    # Generate 50 appointments
    appointments = []
    for _ in range(50):
        appointment = Appointment(
            patient_id=random.choice(patients).id,
            doctor_id=random.choice(doctors).id,
            date=(datetime.now() + timedelta(days=random.randint(-30, 30))).strftime('%Y-%m-%d'),
            time=f"{random.randint(9, 17)}:00",
            status=random.choice(["scheduled", "completed", "cancelled"]),
            notes=fake.text(max_nb_chars=200)
        )
        appointments.append(appointment)
        db.session.add(appointment)
    db.session.commit()

    # Generate 50 billing records
    for _ in range(50):
        appointment = random.choice(appointments)
        billing = BillingRecord(
            patient_id=appointment.patient_id,
            appointment_id=appointment.id,
            total_amount=random.randint(500, 5000),
            paid_amount=random.randint(0, 5000),
            payment_status=random.choice(["pending", "partial", "paid"]),
            payment_method=random.choice(["cash", "card", "insurance"]),
            insurance_provider=fake.company() if random.random() > 0.5 else None,
            insurance_policy_number=fake.uuid4() if random.random() > 0.5 else None,
            notes=fake.text(max_nb_chars=200),
            is_active=True
        )
        db.session.add(billing)
    db.session.commit()

    # Generate 50 inventory items
    common_medicines = [
        "Paracetamol", "Amoxicillin", "Ibuprofen", "Aspirin", "Omeprazole",
        "Metformin", "Amlodipine", "Cetirizine", "Vitamin D3", "Vitamin B12"
    ]
    common_equipment = [
        "Stethoscope", "Blood Pressure Monitor", "Thermometer", "Pulse Oximeter",
        "ECG Machine", "Surgical Scissors", "Forceps", "Syringes", "Gloves", "Masks"
    ]
    for _ in range(50):
        is_medicine = random.random() > 0.4
        name = random.choice(common_medicines) if is_medicine else random.choice(common_equipment)
        category = "Medicine" if is_medicine else "Equipment"
        expiry = datetime.now() + timedelta(days=random.randint(180, 720)) if is_medicine else None
        
        item = InventoryItem(
            name=name,
            category=category,
            quantity=random.randint(10, 1000),
            unit="tablets" if is_medicine else "pieces",
            price_per_unit=random.uniform(5.0, 500.0),
            supplier=fake.company(),
            expiry_date=expiry,
            minimum_stock=random.randint(10, 50),
            is_active=True
        )
        db.session.add(item)
    db.session.commit()

    # Generate 50 prescriptions with medications
    diagnoses = [
        "Hypertension", "Type 2 Diabetes", "Common Cold", "Bronchitis",
        "Migraine", "Arthritis", "Allergic Rhinitis", "Gastritis"
    ]
    
    dosages = ["1 tablet", "2 tablets", "5ml", "10ml"]
    frequencies = ["Once daily", "Twice daily", "Three times daily", "Every 8 hours"]
    durations = ["7 days", "14 days", "1 month", "2 months"]
    
    for _ in range(50):
        prescription = Prescription(
            patient_id=random.choice(patients).id,
            doctor_id=random.choice(doctors).id,
            diagnosis=random.choice(diagnoses),
            notes=fake.text(max_nb_chars=200),
            is_active=True
        )
        db.session.add(prescription)
        db.session.flush()  # Get the prescription ID

        # Add 1-3 medications per prescription
        for _ in range(random.randint(1, 3)):
            medication = Medication(
                prescription_id=prescription.id,
                name=random.choice(common_medicines),
                dosage=random.choice(dosages),
                frequency=random.choice(frequencies),
                duration=random.choice(durations),
                instructions=fake.text(max_nb_chars=100),
                is_active=True
            )
            db.session.add(medication)
    db.session.commit()

    # Generate 50 lab tests
    test_types = [
        ("Blood Sugar", "Pathology"),
        ("Complete Blood Count", "Hematology"),
        ("Lipid Profile", "Biochemistry"),
        ("Thyroid Function", "Endocrinology"),
        ("X-Ray Chest", "Radiology"),
        ("ECG", "Cardiology"),
        ("Urine Analysis", "Pathology"),
        ("Liver Function", "Biochemistry")
    ]
    
    for _ in range(50):
        test_name, test_type = random.choice(test_types)
        test_date = datetime.now() + timedelta(days=random.randint(-30, 30))
        status = random.choice(["pending", "completed", "cancelled"])
        
        test = LabTest(
            patient_id=random.choice(patients).id,
            doctor_id=random.choice(doctors).id,
            test_name=test_name,
            test_type=test_type,
            test_date=test_date,
            results=fake.text(max_nb_chars=200) if status == "completed" else None,
            status=status,
            notes=fake.text(max_nb_chars=200),
            is_active=True
        )
        db.session.add(test)
    db.session.commit()

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        generate_sample_data()
        print("Successfully generated sample data!") 