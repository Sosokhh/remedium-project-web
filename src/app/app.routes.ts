import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ავტორიზაცია',
  }
  ,
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'main',
        loadComponent: () => import('./pages/main/main.component').then((c) => c.MainComponent),
        data: {
          preload: true,
          breadcrumb: 'მთავარი გვერდი',
        },
        title: 'მთავარი გვერდი',
      },
      {
        path: 'data-lists',
        loadChildren: () => import('./pages/data-lists/data-lists.routes').then((m) => m.DATA_LISTS_ROUTES),
        data: {
          breadcrumb: 'მონაცემთა სიები',
        },
        title: 'მონაცემთა სიები',
      },
      {
        path: 'management',
        loadChildren: () => import('./pages/management/management.routes').then((m) => m.MANAGEMENT_ROUTES),
        data: {
          breadcrumb: 'მენეჯმენტი',
        },
        title: 'მენეჯმენტი',
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404',
  },
];
