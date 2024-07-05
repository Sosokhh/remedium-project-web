import { Routes } from '@angular/router';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./management.component').then((c) => c.ManagementComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then((c) => c.ProfileComponent),
    data: {
      breadcrumb: 'პროფილი',
    },
    title: 'პროფილი',
  },
];
