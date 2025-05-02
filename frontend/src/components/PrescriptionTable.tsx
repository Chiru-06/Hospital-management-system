import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { PrescriptionTableProps } from '../types/prescription';

export const PrescriptionTable: React.FC<PrescriptionTableProps> = ({
  prescriptions,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="prescriptions table">
        <TableHead>
          <TableRow>
            <TableCell>Diagnosis</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prescriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography align="center">No prescriptions found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.diagnosis}</TableCell>
                <TableCell>{prescription.doctor_id}</TableCell>
                <TableCell>{prescription.notes || '-'}</TableCell>
                <TableCell>{prescription.created_at ? formatDate(prescription.created_at) : '-'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete prescription">
                    <IconButton
                      aria-label={`delete prescription ${prescription.id}`}
                      onClick={() => onDelete(prescription.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 