export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFormData {
  firstName: string;
  lastName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
} 