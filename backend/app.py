from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import timedelta, datetime
import os
import logging
from logging.handlers import RotatingFileHandler
from extensions import db
from routes.patients import patients_bp
from routes.doctors import doctors_bp
from routes.appointments import appointments_bp
from routes.inventory import inventory_bp
from routes.billing import billing_bp
from routes.prescriptions import prescriptions_bp
from routes.lab_tests import lab_tests_bp
from logger import setup_logger

def create_app():
    app = Flask(__name__)
    
    # Configure logging
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Use a different log file name format to avoid conflicts
    log_file = os.path.join('logs', f'hospital_{datetime.now().strftime("%Y%m%d")}.log')
    
    # Configure logging with a simpler handler
    handler = logging.FileHandler(log_file)
    handler.setFormatter(logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    ))
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    
    app.logger.info("Hospital Management System startup")
    
    # Configure the Flask application
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-123')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3001",
                "https://hospital-management-system-theta-five.vercel.app"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type"]
        }
    })
    
    # Handle OPTIONS requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = jsonify({"status": "ok"})
            return response

    # Add request debugging
    @app.before_request
    def before_request():
        app.logger.info(f"Request Method: {request.method}")
        app.logger.info(f"Request URL: {request.url}")
        app.logger.info(f"Request Headers: {dict(request.headers)}")

    # Register blueprints
    app.register_blueprint(patients_bp, url_prefix='/api')
    app.register_blueprint(doctors_bp, url_prefix='/api')
    app.register_blueprint(appointments_bp, url_prefix='/api')
    app.register_blueprint(inventory_bp, url_prefix='/api')
    app.register_blueprint(billing_bp, url_prefix='/api')
    app.register_blueprint(prescriptions_bp, url_prefix='/api')
    app.register_blueprint(lab_tests_bp, url_prefix='/api')

    with app.app_context():
        # Import models here to avoid circular imports
        from models.patient import Patient
        from models.doctor import Doctor
        from models.appointment import Appointment
        from models.inventory import InventoryItem
        from models.billing import BillingRecord, BillingItem
        from models.prescription import Prescription, Medication
        
        try:
            # Create database directory if it doesn't exist
            db_dir = os.path.dirname(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))
            if db_dir and not os.path.exists(db_dir):
                os.makedirs(db_dir)
                app.logger.info(f"Created database directory: {db_dir}")
            
            # Create tables if they don't exist
            db.create_all()
            app.logger.info("Database tables created/verified successfully")
            
            # Create sample data if no patients exist
            if Patient.query.count() == 0:
                # Create sample patients
                patients = [
                    Patient(
                        first_name="John",
                        last_name="Doe",
                        date_of_birth=datetime.strptime("1980-01-01", "%Y-%m-%d").date(),
                        gender="Male",
                        address="123 Main St",
                        phone="1234567890",
                        email="john.doe@example.com"
                    ),
                    Patient(
                        first_name="Jane",
                        last_name="Smith",
                        date_of_birth=datetime.strptime("1985-05-15", "%Y-%m-%d").date(),
                        gender="Female",
                        address="456 Oak Ave",
                        phone="0987654321",
                        email="jane.smith@example.com"
                    )
                ]
                db.session.add_all(patients)
                app.logger.info("Created sample patients")

            # Create sample doctors if none exist
            if Doctor.query.count() == 0:
                # Create sample doctors
                doctors = [
                    Doctor(
                        first_name="Robert",
                        last_name="Johnson",
                        specialization="Cardiology",
                        phone="1112223333",
                        email="dr.johnson@example.com"
                    ),
                    Doctor(
                        first_name="Sarah",
                        last_name="Williams",
                        specialization="General Medicine",
                        phone="4445556666",
                        email="dr.williams@example.com"
                    )
                ]
                db.session.add_all(doctors)
                app.logger.info("Created sample doctors")

            # Create sample prescriptions if none exist
            if Prescription.query.count() == 0:
                # Get the first patient and doctor
                patient = Patient.query.first()
                doctor = Doctor.query.first()
                
                if patient and doctor:
                    # Create a sample prescription with medications
                    prescription = Prescription(
                        patient_id=patient.id,
                        doctor_id=doctor.id,
                        diagnosis="Hypertension",
                        notes="Patient should monitor blood pressure regularly",
                        medications=[
                            Medication(
                                name="Lisinopril",
                                dosage="10mg",
                                frequency="Once daily",
                                duration="30 days",
                                instructions="Take in the morning with water"
                            ),
                            Medication(
                                name="Aspirin",
                                dosage="81mg",
                                frequency="Once daily",
                                duration="30 days",
                                instructions="Take with food"
                            )
                        ]
                    )
                    db.session.add(prescription)
                    app.logger.info("Created sample prescription with medications")

            db.session.commit()
            
            # Verify the tables exist
            if Patient.__table__.exists(db.engine):
                app.logger.info("Patients table exists")
            else:
                app.logger.error("Patients table does not exist")
                raise Exception("Patients table creation failed")

            if Doctor.__table__.exists(db.engine):
                app.logger.info("Doctors table exists")
            else:
                app.logger.error("Doctors table does not exist")
                raise Exception("Doctors table creation failed")

            if Appointment.__table__.exists(db.engine):
                app.logger.info("Appointments table exists")
            else:
                app.logger.error("Appointments table does not exist")
                raise Exception("Appointments table creation failed")

            if InventoryItem.__table__.exists(db.engine):
                app.logger.info("Inventory table exists")
            else:
                app.logger.error("Inventory table does not exist")
                raise Exception("Inventory table creation failed")

            if BillingRecord.__table__.exists(db.engine):
                app.logger.info("Billing records table exists")
            else:
                app.logger.error("Billing records table does not exist")
                raise Exception("Billing records table creation failed")

            if BillingItem.__table__.exists(db.engine):
                app.logger.info("Billing items table exists")
            else:
                app.logger.error("Billing items table does not exist")
                raise Exception("Billing items table creation failed")

            if Prescription.__table__.exists(db.engine):
                app.logger.info("Prescriptions table exists")
            else:
                app.logger.error("Prescriptions table does not exist")
                raise Exception("Prescriptions table creation failed")

            if Medication.__table__.exists(db.engine):
                app.logger.info("Medications table exists")
            else:
                app.logger.error("Medications table does not exist")
                raise Exception("Medications table creation failed")
                
        except Exception as e:
            app.logger.error(f"Error during database initialization: {str(e)}")
            raise
    
    return app

if __name__ == '__main__':
    import os
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    host = os.environ.get('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_RUN_PORT', 5000))
    app = create_app()
    app.run(debug=debug, host=host, port=port)