import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { PrescriptionDialogProps, PrescriptionFormData } from '../types/prescription';
import api from '../api/axios';
import { Doctor } from '../types/doctor';

export const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  currentPatientId
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PrescriptionFormData>(
    {
      defaultValues: {
        doctor_id: '',
        diagnosis: '',
        notes: ''
      }
    }
  );

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingDoctors(true);
      api.get('/doctors')
        .then(res => {
          setDoctors(
            res.data.map((doc: any) => ({
              ...doc,
              firstName: doc.first_name,
              lastName: doc.last_name,
            }))
          );
        })
        .catch(() => setDoctors([]))
        .finally(() => setLoadingDoctors(false));
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: PrescriptionFormData) => {
    try {
      const payload = {
        patient_id: currentPatientId,
        doctor_id: typeof data.doctor_id === 'string' ? parseInt(data.doctor_id) : data.doctor_id,
        diagnosis: data.diagnosis,
        notes: data.notes,
      };
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="prescription-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="prescription-dialog-title">Add New Prescription</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="doctor_id"
                control={control}
                rules={{ required: 'Prescriber is required' }}
                render={({ field }) => (
                  <TextField
                    select
                    label="Prescribed By"
                    fullWidth
                    required
                    error={!!errors.doctor_id}
                    helperText={errors.doctor_id?.message}
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    {loadingDoctors ? (
                      <MenuItem value="" disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} /> Loading doctors...
                      </MenuItem>
                    ) : doctors.length === 0 ? (
                      <MenuItem value="" disabled>
                        No doctors available
                      </MenuItem>
                    ) : (
                      doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="diagnosis"
                control={control}
                rules={{ required: 'Diagnosis is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Diagnosis"
                    fullWidth
                    required
                    error={!!errors.diagnosis}
                    helperText={errors.diagnosis?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 