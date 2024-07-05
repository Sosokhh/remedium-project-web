import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./orders.component').then((c) => c.OrdersComponent),
    data: {
      breadcrumb: 'ცხრილი',
    },
    title: 'პროდუქტების ცხრილი',
  },
];
