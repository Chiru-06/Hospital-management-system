import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Prescriptions from './pages/Prescriptions';
import LabTests from './pages/LabTests';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/prescriptions/:patientId" element={<Prescriptions />} />
              <Route path="/lab-tests" element={<LabTests />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default App;
