import api from './axios';
import { Prescription, NewPrescription } from '../types/prescription';

export const prescriptionService = {
  async getAllPrescriptions(): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>('/prescriptions');
    return response.data;
  },

  async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
    return response.data;
  },

  async createPrescription(prescription: { patient_id: number; doctor_id: number; diagnosis: string; notes?: string }): Promise<Prescription> {
    const response = await api.post<Prescription>('/prescriptions', prescription);
    return response.data;
  },

  async updatePrescription(id: number, prescription: Partial<NewPrescription>): Promise<Prescription> {
    const response = await api.put<Prescription>(`/prescriptions/${id}`, prescription);
    return response.data;
  },

  async deletePrescription(id: number): Promise<void> {
    await api.delete(`/prescriptions/${id}`);
  }
}; 