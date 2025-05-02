import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PrescriptionDialog } from '../components/PrescriptionDialog';
import { PrescriptionTable } from '../components/PrescriptionTable';
import { prescriptionService } from '../api/prescriptionService';
import { Prescription, PrescriptionFormData } from '../types/prescription';
import api from '../api/axios';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

const Prescriptions: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(patientId ? Number(patientId) : null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all patients if no patientId in URL
  useEffect(() => {
    if (!patientId) {
      setLoadingPatients(true);
      api.get('/patients')
        .then(res => setPatients(res.data))
        .catch(() => setError('Failed to fetch patients'))
        .finally(() => setLoadingPatients(false));
    }
  }, [patientId]);

  // Update selectedPatientId if patientId in URL changes
  useEffect(() => {
    if (patientId) {
      setSelectedPatientId(Number(patientId));
    }
  }, [patientId]);

  const fetchPrescriptions = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await prescriptionService.getPrescriptionsByPatient(id);
      setPrescriptions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prescriptions');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch prescriptions when selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId) {
      fetchPrescriptions(selectedPatientId);
    }
  }, [selectedPatientId, fetchPrescriptions]);

  const handleCreatePrescription = async (formData: PrescriptionFormData) => {
    if (!selectedPatientId) return;

    try {
      const newPrescription = await prescriptionService.createPrescription({
        patient_id: selectedPatientId,
        doctor_id: Number(formData.doctor_id),
        diagnosis: formData.diagnosis,
        notes: formData.notes,
      });
      setPrescriptions((prev) => [...prev, newPrescription]);
      setSnackbar({
        open: true,
        message: 'Prescription created successfully',
        severity: 'success'
      });
      setIsDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create prescription',
        severity: 'error'
      });
      console.error('Error creating prescription:', err);
    }
  };

  const handleDeletePrescription = async (id: number) => {
    try {
      await prescriptionService.deletePrescription(id);
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      setSnackbar({
        open: true,
        message: 'Prescription deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete prescription',
        severity: 'error'
      });
      console.error('Error deleting prescription:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle patient selection from dropdown
  const handlePatientSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.target.value);
    setSelectedPatientId(id);
    navigate(`/prescriptions/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {selectedPatientId && (
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/prescriptions')} sx={{ mr: 2 }}>
              Back
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Prescriptions
          </Typography>
          {selectedPatientId && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
            >
              Add Prescription
            </Button>
          )}
        </Box>

        {/* Patient selector if no patientId in URL */}
        {!patientId && (
          <Box sx={{ mb: 3 }}>
            <TextField
              select
              label="Select Patient"
              value={selectedPatientId || ''}
              onChange={handlePatientSelect}
              fullWidth
            >
              <MenuItem value="" disabled>Select a patient</MenuItem>
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Show spinner only while loading patients (when no patient is selected) */}
        {!selectedPatientId && loadingPatients ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : !selectedPatientId ? (
          <Alert severity="info" sx={{ my: 4 }}>
            Please select a patient to view prescriptions.
          </Alert>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : prescriptions.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            There are no prescriptions for this patient right now.
          </Alert>
        ) : (
          <PrescriptionTable
            prescriptions={prescriptions}
            onDelete={handleDeletePrescription}
          />
        )}
      </Box>

      <PrescriptionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreatePrescription}
        currentPatientId={selectedPatientId || 0}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Prescriptions; 