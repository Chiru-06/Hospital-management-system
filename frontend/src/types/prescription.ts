export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  diagnosis: string;
  notes?: string;
  created_at: string;
}

export interface NewPrescription {
  patientId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  notes?: string;
}

export interface PrescriptionFormData {
  doctor_id: number | string;
  diagnosis: string;
  notes?: string;
}

export interface PrescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PrescriptionFormData) => Promise<void>;
  currentPatientId: number;
}

export interface PrescriptionTableProps {
  prescriptions: Prescription[];
  onDelete: (id: number) => Promise<void>;
} 