import axios from './axios';
import { Appointment, AppointmentFormData } from '../types/appointment';

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await axios.get('/appointments');
    return response.data;
  },

  getAppointmentById: async (id: number): Promise<Appointment> => {
    const response = await axios.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (appointmentData: AppointmentFormData): Promise<Appointment> => {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
  },

  updateAppointment: async (id: number, appointmentData: AppointmentFormData): Promise<Appointment> => {
    const response = await axios.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  deleteAppointment: async (id: number): Promise<void> => {
    await axios.delete(`/appointments/${id}`);
  },

  getAppointmentsByPatient: async (patientId: number): Promise<Appointment[]> => {
    const response = await axios.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  getAppointmentsByDoctor: async (doctorId: number): Promise<Appointment[]> => {
    const response = await axios.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  }
}; 