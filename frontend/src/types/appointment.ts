export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  type: 'CHECKUP' | 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  type: 'CHECKUP' | 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY';
  notes?: string;
} 