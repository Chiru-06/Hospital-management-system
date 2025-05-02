from app import create_app
from extensions import db
from models.patient import Patient
from datetime import datetime

def seed_data():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.session.query(Patient).delete()
        db.session.commit()

        # Create test patients
        patients = [
            Patient(
                first_name='John',
                last_name='Doe',
                date_of_birth=datetime.strptime('1990-01-01', '%Y-%m-%d').date(),
                gender='Male',
                address='123 Main St',
                phone='9876543210',
                email='john@example.com'
            ),
            Patient(
                first_name='Jane',
                last_name='Smith',
                date_of_birth=datetime.strptime('1985-05-15', '%Y-%m-%d').date(),
                gender='Female',
                address='456 Oak Ave',
                phone='8765432109',
                email='jane@example.com'
            ),
            Patient(
                first_name='Alex',
                last_name='Johnson',
                date_of_birth=datetime.strptime('1995-12-25', '%Y-%m-%d').date(),
                gender='Other',
                address='789 Pine Rd',
                phone='7654321098',
                email='alex@example.com'
            )
        ]

        # Add patients to database
        for patient in patients:
            db.session.add(patient)
        
        db.session.commit()
        print("Test data has been seeded successfully!")

if __name__ == '__main__':
    seed_data() 