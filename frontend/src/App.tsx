import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import pages
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Prescriptions from './pages/Prescriptions';
import LabTests from './pages/LabTests';
import RoleBasedLogin from './components/Auth/RoleBasedLogin';
import Patients from './pages/Patients';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /login if not already there and not logged in
    const role = localStorage.getItem('role');
    if (!role && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
    // If logged in and on /login, redirect to main page
    if (role && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <ErrorBoundary>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Layout>
          <Routes>
            <Route path="/login" element={<RoleBasedLogin onLogin={role => { localStorage.setItem('role', role); window.location.href = '/'; }} />} />
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
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default App;
