import { Routes } from '@angular/router';
import { AuthLayout } from './shared/layouts/auth.layout';
import { MainLayout } from './shared/layouts/main.layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Authentication Routes (Wrapped in AuthLayout)
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register').then(m => m.Register)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Protected App Routes (Wrapped in MainLayout)
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [roleGuard],
        data: { expectedRole: 'admin' }
      },
      {
        path: 'sales/add',
        loadComponent: () => import('./features/sales/add-invoice').then(m => m.AddInvoice)
      },
      {
        path: 'sales/logs',
        loadComponent: () => import('./features/sales/logs').then(m => m.Logs),
        canActivate: [roleGuard],
        data: { expectedRole: 'admin' }
      },
      // Root redirect based on role is handled by a guard or default redirect
      {
        path: '',
        redirectTo: 'sales/add',
        pathMatch: 'full'
      }
    ]
  },

  // Fallback Redirect
  { path: '**', redirectTo: 'auth/login' }
];
