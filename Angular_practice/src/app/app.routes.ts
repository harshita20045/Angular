import { Routes } from '@angular/router';
import { userResolver } from './core/resolvers/user.resolver';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard • Pulse Enterprise'
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users-list.component').then(m => m.UsersListComponent),
    title: 'Team Directory • Pulse Enterprise'
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./features/users/user-detail.component').then(m => m.UserDetailComponent),
    resolve: { user: userResolver },
    title: 'Member Profile • Pulse Enterprise'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Equipment & Software • Pulse Enterprise'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Procurement Cart • Pulse Enterprise'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent),
    title: 'Workstreams • Pulse Enterprise'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/registration/registration.component').then(m => m.RegistrationComponent),
    title: 'Member Onboarding • Pulse Enterprise'
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard, adminGuard],
    title: 'Settings • Pulse Enterprise'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found • Pulse Enterprise'
  }
];
