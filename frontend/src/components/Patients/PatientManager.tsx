import React from 'react';
import './PatientManager.css';

const PatientManager: React.FC = () => {
  return (
    <div className="patient-manager">
      <h2>Patient Management</h2>
      {/* Registration, profile, import/export, and list UI goes here */}
      <div className="patient-actions">
        <button>Add Patient</button>
        <button>Import CSV</button>
        <button>Export CSV</button>
      </div>
      <div className="patient-list">
        {/* Patient list table will be rendered here */}
      </div>
    </div>
  );
};

export default PatientManager;
