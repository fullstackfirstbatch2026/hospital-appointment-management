import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((component) => component.Home),
  },
  {
    path: 'doctors',
    loadComponent: () => import('./components/doctors/doctors').then((component) => component.Doctors),
  },
  {
    path: 'patients',
    loadComponent: () => import('./components/patients/patients').then((component) => component.Patients),
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./components/appointments/appointments').then((component) => component.Appointments),
  },
  { path: '**', redirectTo: '' },
];
