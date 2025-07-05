import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import RoleBasedLogin from './components/Auth/RoleBasedLogin';
import Register from './pages/Register';

// Import pages
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Prescriptions from './pages/Prescriptions';
import LabTests from './pages/LabTests';
import Patients from './pages/Patients';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Landing from './pages/LandingPage';
import About from './pages/About';
import DoctorsList from './pages/DoctorsList';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const allowedDashboardPath = role ? `/dashboard/${role}` : null;
    // Allow all dashboard routes for all roles
    const allDashboardPaths = [
      '/dashboard/admin',
      '/dashboard/manager',
      '/dashboard/doctor',
      '/dashboard/patient',
      '/dashboard',
    ];
    const allowedPaths = [
      '/',
      '/login',
      '/about',
      '/doctors-list',
      '/register', // <-- allow register page for unauthenticated users
      ...allDashboardPaths,
      '/patients',
      '/appointments',
      '/doctors',
      '/inventory',
      '/billing',
      '/prescriptions',
      '/lab-tests',
    ];
    // Always show landing page first if not logged in, except for allowed public pages
    if (!role && !['/', '/login', '/about', '/doctors-list', '/register'].includes(location.pathname)) {
      navigate('/', { replace: true });
      return;
    }
    // If not logged in and not on login, landing, about, or doctors-list, redirect to login from any protected route
    if (!role && !['/login', '/', '/about', '/doctors-list', '/register'].includes(location.pathname)) {
      navigate('/login', { replace: true });
      return;
    }
    // If logged in and on /login, redirect to dashboard for their role
    if (role && location.pathname === '/login') {
      if (allowedDashboardPath) {
        navigate(allowedDashboardPath, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    // If logged in and on /dashboard, redirect to their dashboard
    if (role && location.pathname === '/dashboard') {
      if (allowedDashboardPath) {
        navigate(allowedDashboardPath, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    // If logged in and on a dashboard route that doesn't match their role, redirect to their dashboard
    if (role && location.pathname.startsWith('/dashboard/') && location.pathname !== allowedDashboardPath) {
      if (allowedDashboardPath) {
        navigate(allowedDashboardPath, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    // If logged in and on an allowed path, do nothing
    if (role && allowedPaths.includes(location.pathname)) {
      return;
    }
  }, [location, navigate]);

  return (
    <ErrorBoundary>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors-list" element={<DoctorsList />} />
          <Route path="/register" element={<Register />} />
          {/* All other routes (including dashboards, login, etc.) */}
          <Route path="/login" element={<RoleBasedLogin onLogin={role => { localStorage.setItem('role', role); window.location.href = `/dashboard/${role}`; }} />} />
          <Route path="/dashboard/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/dashboard/manager" element={<Layout><ManagerDashboard /></Layout>} />
          <Route path="/dashboard/doctor" element={<Layout><DoctorDashboard /></Layout>} />
          <Route path="/dashboard/patient" element={<Layout><PatientDashboard /></Layout>} />
          <Route path="/dashboard" element={<div />} />
          <Route path="/patients" element={<Layout><Patients /></Layout>} />
          <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/billing" element={<Layout><Billing /></Layout>} />
          <Route path="/prescriptions" element={<Layout><Prescriptions /></Layout>} />
          <Route path="/prescriptions/:patientId" element={<Layout><Prescriptions /></Layout>} />
          <Route path="/lab-tests" element={<Layout><LabTests /></Layout>} />
        </Routes>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default App;
