export interface Appointment {
  appointmentId: number;
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  appointmentTime: string;
  doctorName?: string;
  patientName?: string;
}

export interface AppointmentDetails {
  appointmentId: number;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  patientName: string;
  doctorId?: number;
  patientId?: number;
}

export interface CreateAppointmentRequest {
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  appointmentTime: string;
}
