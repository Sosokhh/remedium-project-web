import { Routes } from '@angular/router';
import { productsResolver } from './resolvers';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
    data: {
      breadcrumb: 'ცხრილი',
    },
    title: 'პროდუქტების ცხრილი',
  },
  {
    path: 'add',
    loadComponent: () => import('./add-product/add-product.component').then((c) => c.AddProductComponent),
    data: {
      breadcrumb: 'დამატება',
    },
    title: 'პროდუქტის დამატება',
  },
  {
    path: 'edit',
    loadComponent: () => import('./add-product/add-product.component').then((c) => c.AddProductComponent),
    data: {
      breadcrumb: 'რედაქტირება',
    },
    resolve: {
      products: productsResolver
    },
    title: 'პროდუქტის რედაქტირება',
  },
  {
    path: 'order',
    loadComponent: () => import('./product-order/product-order.component').then((c) => c.ProductOrderComponent),
    data: {
      breadcrumb: 'რედაქტირება',
    },
    title: 'პროდუქტის რედაქტირება',
  },

];
