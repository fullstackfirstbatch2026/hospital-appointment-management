import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorAppointmentStatistic, DoctorService } from '../../services/doctor.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly destroyRef = inject(DestroyRef);
  private readonly doctorService = inject(DoctorService);
  private readonly patientService = inject(PatientService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly doctorCount = signal<number | null>(null);
  private readonly specialtyCount = signal<number | null>(null);
  private readonly patientCount = signal<number | null>(null);
  private readonly appointmentCount = signal<number | null>(null);
  protected readonly aboveAverageDoctors = signal<DoctorAppointmentStatistic[]>([]);
  protected readonly reportLoading = signal(false);
  protected readonly reportError = signal('');
  protected readonly reportLoaded = signal(false);
  private readonly pendingStatRequests = signal(3);
  protected readonly statsLoading = computed(() => this.pendingStatRequests() > 0);
  protected readonly statsUnavailable = signal(false);
  protected readonly stats = computed(() => [
    { label: 'Available doctors', value: this.formatCount(this.doctorCount()), icon: 'doctor' },
    { label: 'Registered patients', value: this.formatCount(this.patientCount()), icon: 'patient' },
    { label: 'Appointments', value: this.formatCount(this.appointmentCount()), icon: 'calendar' },
    { label: 'Specialties', value: this.formatCount(this.specialtyCount()), icon: 'specialty' },
  ]);

  constructor() {
    this.doctorService.getDoctors().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.pendingStatRequests.update((count) => count - 1)),
    ).subscribe({
      next: (doctors) => {
        this.doctorCount.set(doctors.length);
        this.specialtyCount.set(
          new Set(
            doctors
              .map(
                (doctor) =>
                  doctor.specialization?.trim().toLowerCase() ??
                  (doctor.specializationId === undefined ? undefined : String(doctor.specializationId)),
              )
              .filter((specialization): specialization is string => Boolean(specialization)),
          ).size,
        );
      },
      error: () => {
        this.doctorCount.set(null);
        this.specialtyCount.set(null);
        this.statsUnavailable.set(true);
      },
    });
    this.patientService.getPatients().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.pendingStatRequests.update((count) => count - 1)),
    ).subscribe({
      next: (patients) => this.patientCount.set(patients.length),
      error: () => {
        this.patientCount.set(null);
        this.statsUnavailable.set(true);
      },
    });
    this.appointmentService.getAppointments().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.pendingStatRequests.update((count) => count - 1)),
    ).subscribe({
      next: (appointments) => this.appointmentCount.set(appointments.length),
      error: () => {
        this.appointmentCount.set(null);
        this.statsUnavailable.set(true);
      },
    });
  }

  protected loadAboveAverageDoctors(): void {
    if (this.reportLoading()) {
      return;
    }

    this.reportLoading.set(true);
    this.reportError.set('');
    this.reportLoaded.set(false);
    this.doctorService
      .getDoctorsAboveAverageAppointments()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.reportLoading.set(false)),
      )
      .subscribe({
        next: (doctors) => {
          this.aboveAverageDoctors.set(doctors);
          this.reportLoaded.set(true);
        },
        error: () => {
          this.aboveAverageDoctors.set([]);
          this.reportError.set('Could not load the above-average appointments report. Please try again.');
        },
      });
  }

  private formatCount(value: number | null): string {
    return value === null ? '—' : value.toLocaleString();
  }
}
