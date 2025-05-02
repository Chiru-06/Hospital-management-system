import axios from './axios';
import { Patient, PatientFormData } from '../types/patient';

export const patientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await axios.get('/patients');
    return response.data;
  },

  getPatientById: async (id: number): Promise<Patient> => {
    const response = await axios.get(`/patients/${id}`);
    return response.data;
  },

  createPatient: async (patientData: PatientFormData): Promise<Patient> => {
    const response = await axios.post('/patients', patientData);
    return response.data;
  },

  updatePatient: async (id: number, patientData: PatientFormData): Promise<Patient> => {
    const response = await axios.put(`/patients/${id}`, patientData);
    return response.data;
  },

  deletePatient: async (id: number): Promise<void> => {
    await axios.delete(`/patients/${id}`);
  }
}; 