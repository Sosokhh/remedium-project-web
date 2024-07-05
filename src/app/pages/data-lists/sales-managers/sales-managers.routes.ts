import { Routes } from '@angular/router';
import { salesManagersResolver } from './resolvers';

export const SALES_MANAGERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./sales-managers.component').then((c) => c.SalesManagersComponent),
    data: {
      breadcrumb: 'ცხრილი',
    },
    title: 'გაყიდვების მენეჯერების ცხრილი',
  },
  {
    path: 'add',
    loadComponent: () => import('./add-sales-manager/add-sales-manager.component').then((c) => c.AddSalesManagerComponent),
    data: {
      breadcrumb: 'დამატება',
    },
    title: 'გაყიდვების მენეჯერის დამატება',
  },
  {
    path: 'edit',
    loadComponent: () => import('./add-sales-manager/add-sales-manager.component').then((c) => c.AddSalesManagerComponent),
    data: {
      breadcrumb: 'რედაქტირება',
    },
    resolve: {
      salesManagers: salesManagersResolver
    },
    title: 'გაყიდვების მენეჯერის რედაქტირება',
  },
  {
    path: 'detail-list/:salesManagerId',
    data: {
      breadcrumb: 'გაყიდვები',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./sales-manager-orders/sales-manager-orders.component').then((c) => c.SalesManagerOrdersComponent),
        title: 'გაყიდვები',
      },
    ],
  },
];
