import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  MenuItem,
  Tooltip,
  useTheme,
  styled,
  keyframes,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import axios from '../api/axios';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.01)',
    boxShadow: theme.shadows[2],
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.2)',
    color: theme.palette.primary.main,
  },
}));

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

type FormData = Omit<Patient, 'id'>;

interface FormField {
  name: keyof FormData;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
  });
  const theme = useTheme();

  const formFields: FormField[] = [
    { name: 'first_name', label: 'First Name', type: 'text', required: true },
    { name: 'last_name', label: 'Last Name', type: 'text', required: true },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
    { 
      name: 'gender', 
      label: 'Gender', 
      type: 'select', 
      required: true,
      options: ['Male', 'Female', 'Other']
    },
    { name: 'address', label: 'Address', type: 'text', required: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email', type: 'email', required: false }
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/patients');
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setSelectedPatient(patient);
      setFormData({
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        address: patient.address,
        phone: patient.phone,
        email: patient.email,
      });
    } else {
      setSelectedPatient(null);
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedPatient) {
        await axios.put(`/patients/${selectedPatient.id}`, formData);
      } else {
        await axios.post('/patients', formData);
      }
      fetchPatients();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save patient');
      console.error('Error saving patient:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`/patients/${id}`);
        fetchPatients();
      } catch (err) {
        setError('Failed to delete patient');
        console.error('Error deleting patient:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{
          py: 2,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          animation: `${pulse} 2s infinite`,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          Patients
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Patient
        </StyledButton>
      </Box>

      {error && (
        <Box sx={{ p: 2, bgcolor: 'error.dark', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        <Paper elevation={2} sx={{ borderRadius: '12px' }}>
          <StyledTableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell width="15%" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Name</StyledTableCell>
                  <StyledTableCell width="12%" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Date of Birth</StyledTableCell>
                  <StyledTableCell width="10%" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Gender</StyledTableCell>
                  <StyledTableCell width="15%" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Phone</StyledTableCell>
                  <StyledTableCell width="15%" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Email</StyledTableCell>
                  <StyledTableCell width="23%" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Address</StyledTableCell>
                  <StyledTableCell width="10%" align="right" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: 'background.paper' }}>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.length === 0 ? (
                  <TableRow>
                    <StyledTableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        No patients found
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                ) : (
                  patients.map((patient) => (
                    <StyledTableRow key={patient.id}>
                      <StyledTableCell sx={{ color: 'text.primary' }}>{`${patient.first_name} ${patient.last_name}`}</StyledTableCell>
                      <StyledTableCell sx={{ color: 'text.secondary' }}>{new Date(patient.date_of_birth).toLocaleDateString()}</StyledTableCell>
                      <StyledTableCell sx={{ color: 'text.secondary' }}>{patient.gender}</StyledTableCell>
                      <StyledTableCell sx={{ color: 'text.secondary' }}>{patient.phone}</StyledTableCell>
                      <StyledTableCell sx={{ color: 'text.secondary' }}>{patient.email}</StyledTableCell>
                      <StyledTableCell sx={{ color: 'text.secondary' }}>{patient.address}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Tooltip title="View">
                          <StyledIconButton>
                            <ViewIcon />
                          </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <StyledIconButton 
                            onClick={() => handleOpenDialog(patient)}
                          >
                            <EditIcon />
                          </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <StyledIconButton 
                            onClick={() => handleDelete(patient.id)}
                          >
                            <DeleteIcon />
                          </StyledIconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight="500">
            {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {formFields.map((field) => (
              <Box key={field.name}>
                {field.type === 'select' ? (
                  <TextField
                    select
                    fullWidth
                    label={field.label}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    error={field.required && !formData[field.name]}
                    helperText={field.required && !formData[field.name] ? `${field.label} is required` : ''}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'divider' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                      }
                    }}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    type={field.type}
                    label={field.label}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    error={field.required && !formData[field.name]}
                    helperText={field.required && !formData[field.name] ? `${field.label} is required` : ''}
                    InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'divider' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                      }
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.first_name || !formData.last_name || !formData.date_of_birth || !formData.gender || !formData.phone}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            {selectedPatient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Patients; 