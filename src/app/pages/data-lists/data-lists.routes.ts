import { Routes } from '@angular/router';
import { PRODUCTS_ROUTES } from './products';
import { SALES_MANAGERS_ROUTES } from './sales-managers/sales-managers.routes';
import { ORDERS_ROUTES } from './orders/orders.routes';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';

// const translate = inject(TranslateService);


export const DATA_LISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./data-lists.component').then((c) => c.DataListsComponent),
  },
  {
    path: 'products',
    data: {
      breadcrumb: 'პროდუქტები',
    },
    title: 'პროდუქტები',
    children: PRODUCTS_ROUTES,
  },
  {
    path: 'sales-managers',
    data: {
      breadcrumb: 'გაყიდვების მენეჯერები',
    },
    title: 'გაყიდვების მენეჯერები',
    children: SALES_MANAGERS_ROUTES,
  },
  {
    path: 'orders',
    data: {
      breadcrumb: 'გაყიდვების ისტორია',
    },
    title: 'გაყიდვების ისტორია',
    children: ORDERS_ROUTES,
  },

]
