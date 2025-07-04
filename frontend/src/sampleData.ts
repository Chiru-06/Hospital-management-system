// Sample data for patients, doctors, appointments, billing, lab tests, inventory, prescriptions

export const patients = [
  { id: 1, firstName: 'Ava', lastName: 'Patel', gender: 'Female', dob: '1985-04-12', phone: '123-456-7890', email: 'ava.patel@example.com' },
  { id: 2, firstName: 'Noah', lastName: 'Smith', gender: 'Male', dob: '1990-09-23', phone: '555-123-4567', email: 'noah.smith@example.com' },
  { id: 3, firstName: 'Emma', lastName: 'Johnson', gender: 'Female', dob: '1978-02-15', phone: '222-333-4444', email: 'emma.johnson@example.com' },
  { id: 4, firstName: 'Oliver', lastName: 'Williams', gender: 'Male', dob: '1982-11-30', phone: '333-444-5555', email: 'oliver.williams@example.com' },
  { id: 5, firstName: 'Sophia', lastName: 'Brown', gender: 'Female', dob: '1995-07-19', phone: '444-555-6666', email: 'sophia.brown@example.com' },
  { id: 6, firstName: 'Elijah', lastName: 'Jones', gender: 'Male', dob: '1988-03-22', phone: '666-777-8888', email: 'elijah.jones@example.com' },
  { id: 7, firstName: 'Mia', lastName: 'Garcia', gender: 'Female', dob: '1992-10-05', phone: '777-888-9999', email: 'mia.garcia@example.com' },
  { id: 8, firstName: 'Lucas', lastName: 'Martinez', gender: 'Male', dob: '1980-06-14', phone: '888-999-0000', email: 'lucas.martinez@example.com' },
  { id: 9, firstName: 'Charlotte', lastName: 'Davis', gender: 'Female', dob: '1987-12-25', phone: '999-000-1111', email: 'charlotte.davis@example.com' },
  { id: 10, firstName: 'James', lastName: 'Lopez', gender: 'Male', dob: '1993-08-08', phone: '111-222-3333', email: 'james.lopez@example.com' }
];

export const doctors = [
  { id: 1, firstName: 'Liam', lastName: 'Nguyen', specialization: 'Cardiology', phone: '234-567-8901', email: 'liam.nguyen@hospital.com' },
  { id: 2, firstName: 'Sophia', lastName: 'Kim', specialization: 'Pediatrics', phone: '345-678-9012', email: 'sophia.kim@hospital.com' },
  { id: 3, firstName: 'Mason', lastName: 'Clark', specialization: 'Orthopedics', phone: '456-789-0123', email: 'mason.clark@hospital.com' },
  { id: 4, firstName: 'Isabella', lastName: 'Lewis', specialization: 'Dermatology', phone: '567-890-1234', email: 'isabella.lewis@hospital.com' },
  { id: 5, firstName: 'Ethan', lastName: 'Walker', specialization: 'Neurology', phone: '678-901-2345', email: 'ethan.walker@hospital.com' },
  { id: 6, firstName: 'Amelia', lastName: 'Hall', specialization: 'Oncology', phone: '789-012-3456', email: 'amelia.hall@hospital.com' },
  { id: 7, firstName: 'Logan', lastName: 'Allen', specialization: 'Gastroenterology', phone: '890-123-4567', email: 'logan.allen@hospital.com' },
  { id: 8, firstName: 'Mila', lastName: 'Young', specialization: 'Ophthalmology', phone: '901-234-5678', email: 'mila.young@hospital.com' },
  { id: 9, firstName: 'Benjamin', lastName: 'King', specialization: 'Psychiatry', phone: '012-345-6789', email: 'benjamin.king@hospital.com' },
  { id: 10, firstName: 'Harper', lastName: 'Wright', specialization: 'General Medicine', phone: '123-456-7891', email: 'harper.wright@hospital.com' }
];

export const appointments = [
  { id: 1, patientId: 1, doctorId: 1, date: '2025-07-04', time: '10:00', status: 'scheduled', notes: 'Routine checkup' },
  { id: 2, patientId: 2, doctorId: 2, date: '2025-07-05', time: '11:00', status: 'completed', notes: 'Follow-up' },
  { id: 3, patientId: 3, doctorId: 3, date: '2025-07-06', time: '09:30', status: 'scheduled', notes: 'Consultation' },
  { id: 4, patientId: 4, doctorId: 4, date: '2025-07-07', time: '14:00', status: 'scheduled', notes: 'Skin rash' },
  { id: 5, patientId: 5, doctorId: 5, date: '2025-07-08', time: '13:00', status: 'scheduled', notes: 'Headache' },
  { id: 6, patientId: 6, doctorId: 6, date: '2025-07-09', time: '15:00', status: 'scheduled', notes: 'Cancer screening' },
  { id: 7, patientId: 7, doctorId: 7, date: '2025-07-10', time: '16:00', status: 'scheduled', notes: 'Stomach pain' },
  { id: 8, patientId: 8, doctorId: 8, date: '2025-07-11', time: '12:00', status: 'scheduled', notes: 'Eye checkup' },
  { id: 9, patientId: 9, doctorId: 9, date: '2025-07-12', time: '10:30', status: 'scheduled', notes: 'Mental health' },
  { id: 10, patientId: 10, doctorId: 10, date: '2025-07-13', time: '11:30', status: 'scheduled', notes: 'General checkup' }
];

export const inventory = [
  { id: 1, name: 'Paracetamol', category: 'Medicine', quantity: 100, unit: 'tablets', pricePerUnit: 2.5, supplier: 'MediSupply', expiryDate: '2026-01-01' },
  { id: 2, name: 'Stethoscope', category: 'Equipment', quantity: 10, unit: 'pieces', pricePerUnit: 120.0, supplier: 'HealthEquip', expiryDate: null },
  { id: 3, name: 'Ibuprofen', category: 'Medicine', quantity: 200, unit: 'tablets', pricePerUnit: 3.0, supplier: 'PharmaPlus', expiryDate: '2026-06-01' },
  { id: 4, name: 'Thermometer', category: 'Equipment', quantity: 20, unit: 'pieces', pricePerUnit: 15.0, supplier: 'MedTools', expiryDate: null },
  { id: 5, name: 'Bandages', category: 'Supplies', quantity: 500, unit: 'rolls', pricePerUnit: 1.0, supplier: 'FirstAidCo', expiryDate: null },
  { id: 6, name: 'Amoxicillin', category: 'Medicine', quantity: 150, unit: 'capsules', pricePerUnit: 4.0, supplier: 'PharmaPlus', expiryDate: '2026-09-01' },
  { id: 7, name: 'Syringe', category: 'Supplies', quantity: 300, unit: 'pieces', pricePerUnit: 0.5, supplier: 'MedTools', expiryDate: null },
  { id: 8, name: 'Blood Pressure Monitor', category: 'Equipment', quantity: 5, unit: 'pieces', pricePerUnit: 80.0, supplier: 'HealthEquip', expiryDate: null },
  { id: 9, name: 'Cough Syrup', category: 'Medicine', quantity: 50, unit: 'bottles', pricePerUnit: 6.0, supplier: 'MediSupply', expiryDate: '2026-12-01' },
  { id: 10, name: 'Gloves', category: 'Supplies', quantity: 1000, unit: 'pairs', pricePerUnit: 0.2, supplier: 'FirstAidCo', expiryDate: null }
];

export const billing = [
  { id: 1, patientId: 1, appointmentId: 1, totalAmount: 1500, paidAmount: 1500, paymentStatus: 'paid', paymentMethod: 'card', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Paid in full' },
  { id: 2, patientId: 2, appointmentId: 2, totalAmount: 2000, paidAmount: 500, paymentStatus: 'partial', paymentMethod: 'cash', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Partial payment' },
  { id: 3, patientId: 3, appointmentId: 3, totalAmount: 1200, paidAmount: 1200, paymentStatus: 'paid', paymentMethod: 'insurance', insuranceProvider: 'HealthInsure', insurancePolicyNumber: 'HI12345', notes: 'Insurance covered' },
  { id: 4, patientId: 4, appointmentId: 4, totalAmount: 800, paidAmount: 800, paymentStatus: 'paid', paymentMethod: 'cash', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Paid in cash' },
  { id: 5, patientId: 5, appointmentId: 5, totalAmount: 950, paidAmount: 950, paymentStatus: 'paid', paymentMethod: 'card', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Paid in full' },
  { id: 6, patientId: 6, appointmentId: 6, totalAmount: 3000, paidAmount: 1000, paymentStatus: 'partial', paymentMethod: 'insurance', insuranceProvider: 'MediCare', insurancePolicyNumber: 'MC67890', notes: 'Partial insurance' },
  { id: 7, patientId: 7, appointmentId: 7, totalAmount: 1100, paidAmount: 1100, paymentStatus: 'paid', paymentMethod: 'cash', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Paid in cash' },
  { id: 8, patientId: 8, appointmentId: 8, totalAmount: 1700, paidAmount: 1700, paymentStatus: 'paid', paymentMethod: 'card', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Paid in full' },
  { id: 9, patientId: 9, appointmentId: 9, totalAmount: 2100, paidAmount: 2100, paymentStatus: 'paid', paymentMethod: 'insurance', insuranceProvider: 'HealthInsure', insurancePolicyNumber: 'HI54321', notes: 'Insurance covered' },
  { id: 10, patientId: 10, appointmentId: 10, totalAmount: 1300, paidAmount: 1300, paymentStatus: 'paid', paymentMethod: 'cash', insuranceProvider: null, insurancePolicyNumber: null, notes: 'Paid in cash' }
];

export const prescriptions = [
  { id: 1, patientId: 1, doctorId: 1, appointmentId: 1, medications: [ { name: 'Paracetamol', dosage: '500mg', frequency: '2x daily' } ], notes: 'Take after meals' },
  { id: 2, patientId: 2, doctorId: 2, appointmentId: 2, medications: [ { name: 'Ibuprofen', dosage: '200mg', frequency: '3x daily' } ], notes: 'With food' },
  { id: 3, patientId: 3, doctorId: 3, appointmentId: 3, medications: [ { name: 'Amoxicillin', dosage: '250mg', frequency: '2x daily' } ], notes: 'Complete the course' },
  { id: 4, patientId: 4, doctorId: 4, appointmentId: 4, medications: [ { name: 'Cetirizine', dosage: '10mg', frequency: '1x daily' } ], notes: 'For allergy' },
  { id: 5, patientId: 5, doctorId: 5, appointmentId: 5, medications: [ { name: 'Aspirin', dosage: '75mg', frequency: '1x daily' } ], notes: 'Heart health' },
  { id: 6, patientId: 6, doctorId: 6, appointmentId: 6, medications: [ { name: 'Metformin', dosage: '500mg', frequency: '2x daily' } ], notes: 'Diabetes' },
  { id: 7, patientId: 7, doctorId: 7, appointmentId: 7, medications: [ { name: 'Omeprazole', dosage: '20mg', frequency: '1x daily' } ], notes: 'Acidity' },
  { id: 8, patientId: 8, doctorId: 8, appointmentId: 8, medications: [ { name: 'Lisinopril', dosage: '10mg', frequency: '1x daily' } ], notes: 'Blood pressure' },
  { id: 9, patientId: 9, doctorId: 9, appointmentId: 9, medications: [ { name: 'Atorvastatin', dosage: '20mg', frequency: '1x daily' } ], notes: 'Cholesterol' },
  { id: 10, patientId: 10, doctorId: 10, appointmentId: 10, medications: [ { name: 'Azithromycin', dosage: '500mg', frequency: '1x daily' } ], notes: 'Antibiotic' }
];

export const labTests = [
  { id: 1, patientId: 1, doctorId: 1, appointmentId: 1, testType: 'Blood Test', result: 'Normal', date: '2025-07-04' },
  { id: 2, patientId: 2, doctorId: 2, appointmentId: 2, testType: 'X-Ray', result: 'Clear', date: '2025-07-05' },
  { id: 3, patientId: 3, doctorId: 3, appointmentId: 3, testType: 'Urine Test', result: 'Normal', date: '2025-07-06' },
  { id: 4, patientId: 4, doctorId: 4, appointmentId: 4, testType: 'MRI', result: 'No issues', date: '2025-07-07' },
  { id: 5, patientId: 5, doctorId: 5, appointmentId: 5, testType: 'CT Scan', result: 'Normal', date: '2025-07-08' },
  { id: 6, patientId: 6, doctorId: 6, appointmentId: 6, testType: 'Biopsy', result: 'Benign', date: '2025-07-09' },
  { id: 7, patientId: 7, doctorId: 7, appointmentId: 7, testType: 'Endoscopy', result: 'Normal', date: '2025-07-10' },
  { id: 8, patientId: 8, doctorId: 8, appointmentId: 8, testType: 'Eye Test', result: '20/20 vision', date: '2025-07-11' },
  { id: 9, patientId: 9, doctorId: 9, appointmentId: 9, testType: 'Psych Eval', result: 'Stable', date: '2025-07-12' },
  { id: 10, patientId: 10, doctorId: 10, appointmentId: 10, testType: 'General Lab', result: 'All normal', date: '2025-07-13' }
];
