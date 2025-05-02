import React, { useState, useEffect } from 'react';
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
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import api from '../api/axios';

interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
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
  specialization: string;
  is_active: boolean;
}

interface DoctorAvailability {
  doctor_id: number;
  date: string;
  time: string;
  is_available: boolean;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorAvailability, setDoctorAvailability] = useState<DoctorAvailability[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patient_id: 0,
    doctor_id: 0,
    date: '',
    time: '',
    status: 'scheduled',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError('Failed to fetch patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.filter((doctor: Doctor) => doctor.is_active));
    } catch (err) {
      setError('Failed to fetch doctors');
    }
  };

  const checkDoctorAvailability = async (doctorId: number, date: string, time: string) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability?date=${date}&time=${time}`);
      setDoctorAvailability(response.data);
    } catch (err) {
      setError('Failed to check doctor availability');
    }
  };

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData(appointment);
    } else {
      setSelectedAppointment(null);
      setFormData({
        patient_id: 0,
        doctor_id: 0,
        date: '',
        time: '',
        status: 'scheduled',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setDoctorAvailability([]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData({ ...formData, date });
    if (formData.doctor_id && date) {
      checkDoctorAvailability(formData.doctor_id, date, formData.time || '');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setFormData({ ...formData, time });
    if (formData.doctor_id && formData.date) {
      checkDoctorAvailability(formData.doctor_id, formData.date, time);
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const doctorId = Number(e.target.value);
    setFormData({ ...formData, doctor_id: doctorId });
    if (formData.date && formData.time) {
      checkDoctorAvailability(doctorId, formData.date, formData.time);
    }
  };

  const handleSubmit = async () => {
    try {
      // Check if doctor is available
      const isAvailable = doctorAvailability.find(
        (availability) => 
          availability.doctor_id === formData.doctor_id &&
          availability.date === formData.date &&
          availability.time === formData.time
      )?.is_available;

      if (!isAvailable) {
        setError('Doctor is not available at the selected time');
        return;
      }

      if (selectedAppointment) {
        await api.put(`/appointments/${selectedAppointment.id}`, formData);
      } else {
        await api.post('/appointments', formData);
      }
      fetchAppointments();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save appointment');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        setError('Failed to delete appointment');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: Appointment['status']) => {
    try {
      await api.put(`/appointments/${id}`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.date.includes(searchTerm)
  );

  const getStatusChip = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return <Chip icon={<AccessTimeIcon />} label="Scheduled" color="primary" />;
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" />;
      case 'cancelled':
        return <Chip icon={<CancelIcon />} label="Cancelled" color="error" />;
      default:
        return null;
    }
  };

  const isDoctorAvailable = (doctorId: number, date: string, time: string) => {
    return doctorAvailability.find(
      (availability) => 
        availability.doctor_id === doctorId &&
        availability.date === date &&
        availability.time === time
    )?.is_available;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Appointments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Schedule Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search appointments..."
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patient_name}</TableCell>
                <TableCell>{appointment.doctor_name}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{getStatusChip(appointment.status)}</TableCell>
                <TableCell>{appointment.notes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(appointment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(appointment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  {appointment.status === 'scheduled' && (
                    <>
                      <IconButton onClick={() => handleStatusChange(appointment.id, 'completed')}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                      <IconButton onClick={() => handleStatusChange(appointment.id, 'cancelled')}>
                        <CancelIcon color="error" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
        </DialogTitle>
          <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                required
                label="Patient"
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: Number(e.target.value) })}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {`${patient.first_name} ${patient.last_name}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                required
                label="Doctor"
                value={formData.doctor_id}
                onChange={handleDoctorChange}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {`${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
                required
              label="Date"
              type="date"
              value={formData.date}
                onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
                required
              label="Time"
              type="time"
              value={formData.time}
                onChange={handleTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
                multiline
                rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
            {formData.doctor_id && formData.date && formData.time && (
              <Grid item xs={12}>
                {isDoctorAvailable(formData.doctor_id, formData.date, formData.time) ? (
                  <Alert severity="success">Doctor is available at this time</Alert>
                ) : (
                  <Alert severity="error">Doctor is not available at this time</Alert>
                )}
              </Grid>
            )}
          </Grid>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.patient_id ||
              !formData.doctor_id ||
              !formData.date ||
              !formData.time ||
              !isDoctorAvailable(formData.doctor_id, formData.date, formData.time)
            }
          >
            {selectedAppointment ? 'Update' : 'Schedule'}
            </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments; 