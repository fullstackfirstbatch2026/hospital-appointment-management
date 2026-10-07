import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { Specialization } from '../../models/specialization';
import { DoctorService } from '../../services/doctor.service';
import { SpecializationService } from '../../services/specialization.service';

@Component({
  selector: 'app-doctors',
  imports: [RouterLink],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Doctors {
  private readonly doctorService = inject(DoctorService);
  private readonly specializationService = inject(SpecializationService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly doctors = signal<Doctor[]>([]);
  protected readonly specializations = signal<Specialization[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly query = signal('');
  protected readonly selectedSpecialization = signal('');
  protected readonly selectedDoctor = signal<Doctor | null>(null);
  protected readonly filteredDoctors = computed(() => {
    const query = this.query().trim().toLowerCase();
    const specialization = this.selectedSpecialization();
    return this.doctors().filter((doctor) => {
      const specializationName = this.specializationName(doctor);
      const matchesSearch =
        !query ||
        doctor.doctorName.toLowerCase().includes(query) ||
        specializationName.toLowerCase().includes(query) ||
        String(doctor.doctorId).includes(query);
      return matchesSearch && (!specialization || String(doctor.specializationId ?? '') === specialization);
    });
  });

  constructor() {
    this.loadDoctors();
  }

  protected setSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  protected setSpecialization(event: Event): void {
    this.selectedSpecialization.set((event.target as HTMLSelectElement).value);
  }

  protected specializationName(doctor: Doctor): string {
    return (
      doctor.specialization ||
      this.specializations().find((specialization) => specialization.specializationId === doctor.specializationId)
        ?.specializationName ||
      'Specialization unavailable'
    );
  }

  protected loadDoctors(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    forkJoin({
      doctors: this.doctorService.getDoctors(),
      specializations: this.specializationService.getSpecializations(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: ({ doctors, specializations }) => {
        this.specializations.set(specializations);
        this.doctors.set(
          doctors.map((doctor) => ({
            ...doctor,
            specialization:
              doctor.specialization ||
              specializations.find((item) => item.specializationId === doctor.specializationId)?.specializationName,
          })),
        );
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('We couldn’t load the doctor directory and specialization details. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
