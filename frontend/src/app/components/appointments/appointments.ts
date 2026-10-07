import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentDetails } from '../../models/appointment';
import { Doctor } from '../../models/doctor';
import { Patient } from '../../models/patient';
import { Specialization } from '../../models/specialization';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { PatientService } from '../../services/patient.service';
import { SpecializationService } from '../../services/specialization.service';

@Component({
  selector: 'app-appointments',
  imports: [ReactiveFormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Appointments {
  private readonly appointmentService = inject(AppointmentService);
  private readonly doctorService = inject(DoctorService);
  private readonly patientService = inject(PatientService);
  private readonly specializationService = inject(SpecializationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  protected readonly appointments = signal<AppointmentDetails[]>([]);
  protected readonly doctors = signal<Doctor[]>([]);
  protected readonly patients = signal<Patient[]>([]);
  protected readonly specializations = signal<Specialization[]>([]);
  protected readonly loading = signal(true);
  protected readonly bookingOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly bookingError = signal('');
  protected readonly listError = signal('');
  protected readonly dataError = signal('');
  protected readonly successMessage = signal('');
  protected readonly selectedBookingSpecialization = signal('');
  protected readonly query = signal('');
  protected readonly doctorFilter = signal('');
  protected readonly patientFilter = signal('');
  protected readonly dateFilter = signal('');
  protected readonly bookingForm = this.formBuilder.nonNullable.group({
    specializationId: ['', Validators.required],
    doctorId: ['', Validators.required],
    patientId: ['', Validators.required],
    appointmentDate: ['', Validators.required],
    appointmentTime: ['', Validators.required],
  });
  protected readonly today = this.formatLocalDate(new Date());
  protected readonly bookingDoctors = computed(() => {
    const specializationId = this.selectedBookingSpecialization();
    return this.doctors().filter((doctor) => String(doctor.specializationId ?? '') === specializationId);
  });
  protected readonly filteredAppointments = computed(() => {
    const query = this.query().trim().toLowerCase();
    const doctorId = this.doctorFilter();
    const patientId = this.patientFilter();
    const date = this.dateFilter();
    return this.appointments().filter((appointment) => {
      const matchesQuery =
        !query ||
        String(appointment.appointmentId).includes(query) ||
        appointment.doctorName.toLowerCase().includes(query) ||
        appointment.patientName.toLowerCase().includes(query);
      const matchesDoctor =
        !doctorId ||
        String(appointment.doctorId ?? '') === doctorId ||
        this.doctors().find((doctor) => String(doctor.doctorId) === doctorId)?.doctorName === appointment.doctorName;
      const matchesPatient =
        !patientId ||
        String(appointment.patientId ?? '') === patientId ||
        this.patients().find((patient) => String(patient.patientId) === patientId)?.patientName === appointment.patientName;
      const matchesDate = !date || appointment.appointmentDate.slice(0, 10) === date;
      return matchesQuery && matchesDoctor && matchesPatient && matchesDate;
    });
  });

  constructor() {
    const doctorId = this.route.snapshot.queryParamMap.get('doctorId');
    this.bookingForm.controls.specializationId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((specializationId) => {
        this.selectedBookingSpecialization.set(specializationId);
        this.bookingForm.controls.doctorId.setValue('');
      });
    this.loadAppointments();
    this.loadBookingOptions(doctorId);
  }

  protected setSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setDoctorFilter(event: Event): void {
    this.doctorFilter.set((event.target as HTMLSelectElement).value);
  }

  protected setPatientFilter(event: Event): void {
    this.patientFilter.set((event.target as HTMLSelectElement).value);
  }

  protected setDateFilter(event: Event): void {
    this.dateFilter.set((event.target as HTMLInputElement).value);
  }

  protected resetFilters(): void {
    this.query.set('');
    this.doctorFilter.set('');
    this.patientFilter.set('');
    this.dateFilter.set('');
  }

  protected loadAppointments(): void {
    this.loading.set(true);
    this.listError.set('');
    this.appointmentService.getAppointmentDetails().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: () => {
        this.listError.set('We couldn’t load appointment details. Please check your connection and try again.');
        this.loading.set(false);
      },
    });
  }

  protected openBooking(): void {
    this.successMessage.set('');
    this.bookingError.set('');
    this.bookingOpen.set(true);
  }

  protected closeBooking(): void {
    if (!this.saving()) {
      this.bookingOpen.set(false);
      this.bookingError.set('');
    }
  }

  protected bookAppointment(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.bookingError.set('');
    this.successMessage.set('');
    const values = this.bookingForm.getRawValue();
    this.appointmentService
      .scheduleAppointment({
        doctorId: Number(values.doctorId),
        patientId: Number(values.patientId),
        appointmentDate: values.appointmentDate.slice(0, 10),
        appointmentTime: `${values.appointmentTime.slice(0, 5)}:00`,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.bookingOpen.set(false);
          this.bookingForm.reset();
          this.successMessage.set('Appointment booked successfully!');
          this.refreshAppointmentsAfterBooking();
        },
        error: (error: unknown) => {
          this.saving.set(false);
          this.bookingError.set(this.bookingFailureMessage(error));
        },
      });
  }

  private refreshAppointmentsAfterBooking(): void {
    this.appointmentService.getAppointmentDetails().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
        this.listError.set('');
      },
      error: () => {
        this.listError.set('Your appointment was booked, but the appointment list could not be refreshed. Please try again.');
      },
    });
  }

  private loadBookingOptions(requestedDoctorId: string | null): void {
    forkJoin({
      doctors: this.doctorService.getDoctors(),
      patients: this.patientService.getPatients(),
      specializations: this.specializationService.getSpecializations(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: ({ doctors, patients, specializations }) => {
        this.doctors.set(doctors);
        this.patients.set(patients);
        this.specializations.set(specializations);
        if (requestedDoctorId) {
          const doctor = doctors.find((item) => String(item.doctorId) === requestedDoctorId);
          if (doctor?.specializationId !== undefined) {
            this.bookingForm.controls.specializationId.setValue(String(doctor.specializationId));
            this.selectedBookingSpecialization.set(String(doctor.specializationId));
            this.bookingForm.controls.doctorId.setValue(requestedDoctorId);
          }
        }
      },
      error: () => {
        this.dataError.set('Doctor, patient and specialization options could not be loaded. Please refresh to try again.');
      },
    });
  }

  private bookingFailureMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const responseBody: unknown = error.error;
      let serverMessage = typeof responseBody === 'string' ? responseBody : '';
      if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as Record<string, unknown>;
        serverMessage = ['message', 'detail', 'error', 'title']
          .map((key) => body[key])
          .find((value): value is string => typeof value === 'string') ?? '';
      }
      const normalizedMessage = `${serverMessage} ${
        typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
      }`.toLowerCase();
      if (
        error.status === 409 ||
        normalizedMessage.includes('ora-20001') ||
        normalizedMessage.includes('-20001') ||
        normalizedMessage.includes('already has an appointment') ||
        normalizedMessage.includes('duplicate') ||
        normalizedMessage.includes('slot already')
      ) {
        return 'Doctor already has an appointment at this date and time.';
      }
    }
    return 'We couldn’t schedule this appointment. Please verify the selected details and try again.';
  }

  protected formatAppointmentTime(time: string): string {
    const [hoursText, minutes] = time.split(':');
    const hours = Number(hoursText);
    const hour12 = hours % 12 || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${period}`;
  }

  protected formatAppointmentDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${this.monthNames[Number(month) - 1]} ${Number(day)}, ${year}`;
  }

  private formatLocalDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
