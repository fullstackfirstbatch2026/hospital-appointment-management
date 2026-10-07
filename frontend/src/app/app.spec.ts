import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AppointmentService } from './services/appointment.service';
import { DoctorService } from './services/doctor.service';
import { PatientService } from './services/patient.service';
import { App } from './app';
import { Home } from './components/home/home';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the shared CarePlus navigation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav[aria-label="Main navigation"]')).toBeTruthy();
    expect(compiled.querySelector('.nav-cta')?.textContent).toContain('Book appointment');
  });
});

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: DoctorService, useValue: { getDoctors: () => of([]) } },
        { provide: PatientService, useValue: { getPatients: () => of([]) } },
        { provide: AppointmentService, useValue: { getAppointments: () => of([]) } },
      ],
    }).compileComponents();
  });

  it('should render the dashboard sections and quick actions', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Quality healthcare');
    expect(compiled.querySelectorAll('.quick-card')).toHaveLength(4);
    expect(compiled.querySelector('#how-it-works')).toBeTruthy();
  });
});
