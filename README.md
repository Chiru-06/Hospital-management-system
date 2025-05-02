# Hospital Management System

A modern web-based Hospital Management System built with React, TypeScript, Flask, and SQLite.

## Features

- Patient Management
- Appointment Scheduling
- Doctor Management
- Inventory Tracking
- Billing and Payments
- Prescription Management
- Lab Test Management
- Modern UI with Light/Dark Mode
- Responsive Design

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI (MUI)
- React Router
- Axios for API calls

### Backend
- Python Flask
- SQLite Database
- Flask-SQLAlchemy
- JWT Authentication

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 