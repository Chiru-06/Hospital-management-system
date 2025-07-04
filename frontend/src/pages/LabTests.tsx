import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import api from '../api/axios';

interface LabTest {
  id: number;
  patient_id: number;
  doctor_id: number;
  test_name: string;
  test_type: string;
  test_date: string;
  results: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  is_active: boolean;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
}

interface LabTestFormData {
  patient_id: number | null;
  doctor_id: number | null;
  test_name: string;
  test_type: string;
  test_date: string;
  results: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
}

const LabTests: React.FC = () => {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LabTestFormData>({
    patient_id: null,
    doctor_id: null,
    test_name: '',
    test_type: '',
    test_date: new Date().toISOString().split('T')[0],
    results: '',
    status: 'pending',
    notes: '',
  });
  const role = localStorage.getItem('role');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        fetchLabTests(),
        fetchPatients(),
        fetchDoctors()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchLabTests = async () => {
    try {
      const response = await api.get('/lab-tests');
      const activeTests = response.data.filter((test: LabTest) => test.is_active);
      setLabTests(activeTests);
    } catch (err) {
      console.error('Error fetching lab tests:', err);
      throw err;
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      throw err;
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      throw err;
    }
  };

  const handleOpenDialog = (test?: LabTest) => {
    if (test) {
      setSelectedTest(test);
      setFormData({
        patient_id: test.patient_id,
        doctor_id: test.doctor_id,
        test_name: test.test_name,
        test_type: test.test_type,
        test_date: test.test_date,
        results: test.results,
        status: test.status,
        notes: test.notes || '',
      });
    } else {
      setSelectedTest(null);
      setFormData({
        patient_id: null,
        doctor_id: null,
        test_name: '',
        test_type: '',
        test_date: new Date().toISOString().split('T')[0],
        results: '',
        status: 'pending',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTest(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedTest) {
        await api.put(`/lab-tests/${selectedTest.id}`, formData);
      } else {
        await api.post('/lab-tests', formData);
      }
      await fetchLabTests();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving lab test:', err);
      setError('Failed to save lab test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lab test?')) {
      try {
        setLoading(true);
        await api.delete(`/lab-tests/${id}`);
        await fetchLabTests();
      } catch (err) {
        console.error('Error deleting lab test:', err);
        setError('Failed to delete lab test. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredTests = labTests.filter(test => {
    const patient = patients.find(p => p.id === test.patient_id);
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Lab Tests Management</Typography>
        {['admin', 'manager'].includes(role || '') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Lab Test
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Test Name</TableCell>
                <TableCell>Test Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">No lab tests yet.</TableCell>
                </TableRow>
              ) : (
                filteredTests.map((test) => {
                  const patient = patients.find(p => p.id === test.patient_id);
                  const doctor = doctors.find(d => d.id === test.doctor_id);
                  const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
                  const doctorName = doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Unknown';

                  return (
                    <TableRow key={test.id}>
                      <TableCell>{patientName}</TableCell>
                      <TableCell>{doctorName}</TableCell>
                      <TableCell>{test.test_name}</TableCell>
                      <TableCell>{test.test_type}</TableCell>
                      <TableCell>{new Date(test.test_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={test.status}
                          color={getStatusColor(test.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(test)} disabled={!['admin', 'manager'].includes(role || '')}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(test.id)} disabled={!['admin', 'manager'].includes(role || '')}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="lab-test-dialog-title"
        disableEnforceFocus
      >
        <DialogTitle id="lab-test-dialog-title">
          {selectedTest ? 'Edit Lab Test' : 'New Lab Test'}
        </DialogTitle>
        <DialogContent>
          {['admin', 'manager'].includes(role || '') ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Patient"
                  value={formData.patient_id || ''}
                  onChange={(e) => setFormData({ ...formData, patient_id: Number(e.target.value) })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Select patient' }}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Doctor"
                  value={formData.doctor_id || ''}
                  onChange={(e) => setFormData({ ...formData, doctor_id: Number(e.target.value) })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Select doctor' }}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Test Name"
                  value={formData.test_name}
                  onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Test name' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Test Type"
                  value={formData.test_type}
                  onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Test type' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Test Date"
                  value={formData.test_date}
                  onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 'aria-label': 'Test date' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Test status' }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Results"
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Test results' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Test notes' }}
                />
              </Grid>
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              Only admin and manager can create or edit lab tests.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading} aria-label="Cancel">
            Cancel
          </Button>
          {['admin', 'manager'].includes(role || '') && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !formData.patient_id || !formData.doctor_id || !formData.test_name || !formData.test_type}
              aria-label={selectedTest ? 'Update lab test' : 'Create lab test'}
            >
              {loading ? <CircularProgress size={24} /> : selectedTest ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LabTests;