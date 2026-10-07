import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';

export interface DoctorAppointmentStatistic {
  doctorId: number;
  doctorName: string;
  appointmentCount: number;
}

function normalizeAboveAverageDoctors(response: unknown): DoctorAppointmentStatistic[] {
  if (!Array.isArray(response)) {
    throw new Error('Above-average doctors response must be an array.');
  }

  return response.map((row: unknown) => {
    if (
      !Array.isArray(row) ||
      row.length < 3 ||
      typeof row[0] !== 'number' ||
      typeof row[1] !== 'string' ||
      typeof row[2] !== 'number'
    ) {
      throw new Error('Above-average doctors response contains an unsupported row.');
    }

    return {
      doctorId: row[0],
      doctorName: row[1],
      appointmentCount: row[2],
    };
  });
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/doctors';

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorsAboveAverageAppointments(): Observable<DoctorAppointmentStatistic[]> {
    return this.http.get<unknown>(`${this.apiUrl}/above-average`).pipe(map(normalizeAboveAverageDoctors));
  }
}
