import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Appointment, AppointmentDetails, CreateAppointmentRequest } from '../models/appointment';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAppointmentDetails(value: unknown): value is AppointmentDetails {
  return (
    isRecord(value) &&
    typeof value['appointmentId'] === 'number' &&
    typeof value['appointmentDate'] === 'string' &&
    typeof value['appointmentTime'] === 'string' &&
    typeof value['doctorName'] === 'string' &&
    typeof value['patientName'] === 'string'
  );
}

function normalizeAppointmentTime(value: string): string {
  const match = /(?:^|T)(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/.exec(value);
  if (!match) {
    throw new Error('Appointment time response must contain a time in HH:mm format.');
  }
  return match[1];
}

function normalizeAppointmentDate(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})(?:$|T.*$)/.exec(value);
  if (!match) {
    throw new Error('Appointment date response must contain a date in YYYY-MM-DD format.');
  }
  return match[1];
}

function normalizeAppointmentDetails(response: unknown): AppointmentDetails[] {
  if (!Array.isArray(response)) {
    throw new Error('Appointment details response must be an array.');
  }

  return response.map((item: unknown) => {
    if (isAppointmentDetails(item)) {
      return {
        ...item,
        appointmentDate: normalizeAppointmentDate(item.appointmentDate),
        appointmentTime: normalizeAppointmentTime(item.appointmentTime),
      };
    }

    if (
      Array.isArray(item) &&
      item.length >= 5 &&
      typeof item[0] === 'number' &&
      typeof item[1] === 'string' &&
      typeof item[2] === 'string' &&
      typeof item[3] === 'string' &&
      typeof item[4] === 'string'
    ) {
      return {
        appointmentId: item[0],
        appointmentDate: normalizeAppointmentDate(item[1]),
        appointmentTime: normalizeAppointmentTime(item[2]),
        doctorName: item[3],
        patientName: item[4],
      };
    }

    throw new Error('Appointment details response contains an unsupported row.');
  });
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/appointments';

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointmentDetails(): Observable<AppointmentDetails[]> {
    return this.http.get<unknown>(`${this.apiUrl}/details`).pipe(map(normalizeAppointmentDetails));
  }

  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/date/${date}`);
  }

  createAppointment(appointment: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  scheduleAppointment(appointment: CreateAppointmentRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/schedule`, appointment, { responseType: 'text' });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }
}
