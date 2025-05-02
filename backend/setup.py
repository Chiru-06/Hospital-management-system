from setuptools import setup, find_packages

setup(
    name="hms_backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "Flask==2.0.1",
        "Flask-SQLAlchemy==2.5.1",
        "Flask-CORS==3.0.10",
        "Flask-Limiter==2.4.0",
        "Werkzeug==2.0.1",
        "python-dotenv==0.19.0",
        "SQLAlchemy==1.4.23",
        "email-validator==1.1.3",
        "python-dateutil==2.8.2",
        "bcrypt==3.2.0",
    ],
    extras_require={
        "dev": [
            "pytest==6.2.5",
            "black==21.9b0",
            "flake8==3.9.2",
        ]
    },
) 