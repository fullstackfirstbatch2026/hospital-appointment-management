export interface Patient {
  patientId: number;
  patientName: string;
  phone: string;
  city: string;
  email?: string;
  dateOfBirth?: string;
}

export interface CreatePatientRequest {
  patientName: string;
  phone: string;
  city: string;
}
