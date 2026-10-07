import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patients',
  imports: [ReactiveFormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Patients {
  private readonly patientService = inject(PatientService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly patients = signal<Patient[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly formError = signal('');
  protected readonly successMessage = signal('');
  protected readonly query = signal('');
  protected readonly addDialogOpen = signal(false);
  protected readonly selectedPatient = signal<Patient | null>(null);
  protected readonly patientForm = this.formBuilder.nonNullable.group({
    patientName: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+()\d\s-]{7,20}$/)]],
    city: ['', [Validators.required, Validators.maxLength(80)]],
  });
  protected readonly filteredPatients = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.patients().filter(
      (patient) =>
        !query ||
        patient.patientName.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query) ||
        patient.city.toLowerCase().includes(query) ||
        String(patient.patientId).includes(query),
    );
  });

  constructor() {
    this.loadPatients();
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

  protected loadPatients(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.patientService.getPatients().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('We couldn’t load patient records. Please check your connection and try again.');
        this.loading.set(false);
      },
    });
  }

  protected openAddDialog(): void {
    this.patientForm.reset();
    this.formError.set('');
    this.addDialogOpen.set(true);
  }

  protected closeAddDialog(): void {
    if (!this.saving()) {
      this.addDialogOpen.set(false);
      this.formError.set('');
    }
  }

  protected addPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    this.successMessage.set('');
    this.patientService
      .createPatient(this.patientForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.addDialogOpen.set(false);
          this.patientForm.reset();
          this.successMessage.set('Patient added successfully.');
          this.loadPatients();
        },
        error: () => {
          this.saving.set(false);
          this.formError.set('We couldn’t save this patient. Please review the details and try again.');
        },
      });
  }
}
