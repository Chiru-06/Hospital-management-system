from app import create_app, db
from models import User, Patient, Doctor, Appointment, Inventory, Bill, Prescription, LabTest
from datetime import datetime, date
import os
import logging

def init_db():
    # Set up logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Remove existing database file if it exists
    db_path = 'hospital.db'
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            logger.info('Removed existing database file')
        except Exception as e:
            logger.error(f'Error removing database file: {str(e)}')
            raise
    
    app = create_app()
    with app.app_context():
        try:
            logger.info('Creating database tables...')
            # Create all tables
            db.create_all()
            logger.info('Tables created successfully')
            
            logger.info('Adding sample users...')
            # Create admin user
            admin = User(
                username='admin',
                password='admin123',
                email='admin@hospital.com',
                role='admin'
            )
            db.session.add(admin)
            
            # Create staff user
            staff = User(
                username='staff',
                password='staff123',
                email='staff@hospital.com',
                role='staff'
            )
            db.session.add(staff)
            
            # Create doctor user
            doctor = User(
                username='doctor',
                password='doctor123',
                email='doctor@hospital.com',
                role='doctor'
            )
            db.session.add(doctor)
            db.session.commit()
            logger.info('Sample users added successfully')
            
            # Create doctor profile
            doctor_profile = Doctor(
                user_id=doctor.id,
                specialization='General Medicine'
            )
            db.session.add(doctor_profile)
            db.session.commit()
            logger.info('Doctor profile created successfully')
            
            logger.info('Adding sample patients...')
            # Create sample patients
            patient1 = Patient(
                first_name='John',
                last_name='Doe',
                date_of_birth=date(1980, 1, 1),
                gender='Male',
                address='123 Main St',
                phone='555-123-4567',
                email='john.doe@example.com'
            )
            db.session.add(patient1)
            
            patient2 = Patient(
                first_name='Jane',
                last_name='Smith',
                date_of_birth=date(1990, 5, 15),
                gender='Female',
                address='456 Oak Ave',
                phone='555-987-6543',
                email='jane.smith@example.com'
            )
            db.session.add(patient2)
            
            # Add sample inventory items
            inventory1 = Inventory(
                item_name='Paracetamol',
                quantity=1000,
                unit='tablets',
                category='Medicine',
                reorder_level=100,
                supplier='PharmaCorp',
                cost_per_unit=0.5
            )
            db.session.add(inventory1)
            
            inventory2 = Inventory(
                item_name='Surgical Masks',
                quantity=500,
                unit='pieces',
                category='Supplies',
                reorder_level=50,
                supplier='MedSupplies Inc',
                cost_per_unit=0.2
            )
            db.session.add(inventory2)
            
            db.session.commit()
            logger.info('Sample data added successfully')
            
            # Verify database state
            logger.info('\nCurrent database state:')
            logger.info(f'Users: {User.query.count()}')
            logger.info(f'Doctors: {Doctor.query.count()}')
            logger.info(f'Patients: {Patient.query.count()}')
            logger.info(f'Inventory items: {Inventory.query.count()}')
            
        except Exception as e:
            logger.error(f'Error during database initialization: {str(e)}')
            db.session.rollback()
            raise

if __name__ == '__main__':
    init_db() 