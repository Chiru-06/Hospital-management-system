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
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import api from '../api/axios';

interface BillingRecord {
  id: number;
  patient_id: number;
  appointment_id?: number;
  total_amount: number;
  paid_amount: number;
  payment_status: string;
  payment_method: string | null;
  insurance_provider?: string;
  insurance_policy_number?: string;
  notes?: string;
  created_at: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

const Billing: React.FC = () => {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Omit<Partial<BillingRecord>, 'patient_id'> & { patient_id: number | '' }>(
    {
      patient_id: '',
      total_amount: 0,
      paid_amount: 0,
      payment_method: '',
      payment_status: 'pending',
    }
  );

  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/billing');
      setRecords(response.data);
    } catch (err) {
      setError('Failed to fetch billing records');
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

  const handleOpenDialog = (record?: BillingRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        ...record,
        patient_id: record.patient_id,
      });
    } else {
      setSelectedRecord(null);
      setFormData({
        patient_id: '',
        total_amount: 0,
        paid_amount: 0,
        payment_method: '',
        payment_status: 'pending',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.patient_id || !formData.total_amount) {
        setError('Patient and total amount are required');
        return;
      }

      const submitData = {
        ...formData,
        patient_id: Number(formData.patient_id),
      };

      if (selectedRecord) {
        await api.put(`/billing/${selectedRecord.id}`, submitData);
      } else {
        await api.post('/billing', submitData);
      }
      fetchRecords();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save billing record');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this billing record?')) {
      try {
        await api.delete(`/billing/${id}`);
        fetchRecords();
      } catch (err) {
        setError('Failed to delete billing record');
      }
    }
  };

  const filteredRecords = records.filter(record => {
    const patient = patients.find(p => p.id === record.patient_id);
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Billing Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Bill
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => {
              const patient = patients.find(p => p.id === record.patient_id);
              const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
              return (
                <TableRow key={record.id}>
                  <TableCell>{patientName}</TableCell>
                  <TableCell>₹{record.total_amount.toFixed(2)}</TableCell>
                  <TableCell>₹{record.paid_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.payment_status}
                      color={
                        record.payment_status === 'paid'
                          ? 'success'
                          : record.payment_status === 'partial'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>{record.payment_method || 'N/A'}</TableCell>
                  <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(record)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(record.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Edit Billing Record' : 'Add New Bill'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Patient *"
                value={formData.patient_id === 0 ? '' : formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value === '' ? '' : Number(e.target.value) })}
                error={!formData.patient_id}
                helperText={!formData.patient_id ? 'Patient is required' : ''}
              >
                <MenuItem value="" disabled>Select Patient</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Payment Method *"
                value={formData.payment_method || ''}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                error={!formData.payment_method}
                helperText={!formData.payment_method ? 'Payment method is required' : ''}
              >
                <MenuItem value="" disabled>Select Method</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="insurance">Insurance</MenuItem>
                <MenuItem value="online">Online</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Total Amount *"
                placeholder="0"
                type="number"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                error={!formData.total_amount}
                helperText={!formData.total_amount ? 'Total amount is required' : ''}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Paid Amount"
                placeholder="0"
                type="number"
                value={formData.paid_amount}
                onChange={(e) => setFormData({ ...formData, paid_amount: Number(e.target.value) })}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Payment Status *"
                value={formData.payment_status || ''}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                error={!formData.payment_status}
                helperText={!formData.payment_status ? 'Status is required' : ''}
              >
                <MenuItem value="" disabled>Select Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </TextField>
            </Grid>
            {formData.payment_method === 'insurance' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Insurance Provider"
                    value={formData.insurance_provider || ''}
                    onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Insurance Policy Number"
                    value={formData.insurance_policy_number || ''}
                    onChange={(e) => setFormData({ ...formData, insurance_policy_number: e.target.value })}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.patient_id ||
              !formData.payment_method ||
              !formData.total_amount ||
              !formData.payment_status
            }
          >
            {selectedRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Billing; 