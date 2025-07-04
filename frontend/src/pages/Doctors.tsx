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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import api from '../api/axios';

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  phone: string;
  email: string;
  is_active: boolean;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Doctor>>({
    first_name: '',
    last_name: '',
    specialization: '',
    phone: '',
    email: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData(doctor);
    } else {
      setSelectedDoctor(null);
      setFormData({
        first_name: '',
        last_name: '',
        specialization: '',
        phone: '',
        email: '',
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const validatePhoneNumber = (phone: string) => {
    // Indian phone number format: 10 digits starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleSubmit = async () => {
    // Validate all required fields
    const requiredFields = ['first_name', 'last_name', 'specialization', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof Doctor]);
    
    if (missingFields.length > 0) {
      return; // Don't submit if any required field is missing
    }

    if (!validatePhoneNumber(formData.phone || '')) {
      return; // Don't submit if phone number is invalid
    }

    try {
      if (selectedDoctor) {
        await api.put(`/doctors/${selectedDoctor.id}`, formData);
      } else {
        await api.post('/doctors', formData);
      }
      fetchDoctors();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save doctor');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      setError('Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone.includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Doctors</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Doctor
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
      </Typography>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search doctors..."
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
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No doctors yet.</TableCell>
              </TableRow>
            ) : filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{`${doctor.first_name} ${doctor.last_name}`}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>
                  <div>{doctor.phone}</div>
                  <div>{doctor.email}</div>
                </TableCell>
                <TableCell>
                  {doctor.is_active ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(doctor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(doctor.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                error={!formData.first_name}
                helperText={!formData.first_name ? 'First name is required' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                error={!formData.last_name}
                helperText={!formData.last_name ? 'Last name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                error={!formData.specialization}
                helperText={!formData.specialization ? 'Specialization is required' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                value={formData.phone}
                onChange={handlePhoneChange}
                error={!formData.phone || !validatePhoneNumber(formData.phone)}
                helperText={
                  !formData.phone 
                    ? 'Phone number is required' 
                    : !validatePhoneNumber(formData.phone) 
                      ? 'Please enter a valid Indian phone number (10 digits starting with 6-9)' 
                      : ''
                }
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={
              !formData.first_name || 
              !formData.last_name || 
              !formData.specialization || 
              !formData.phone || 
              !validatePhoneNumber(formData.phone)
            }
          >
            {selectedDoctor ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Doctors;