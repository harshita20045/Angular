import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { EmployeeList } from './employees/employee-list';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard - WorkPulse' },
  { path: 'employees', component: EmployeeList, title: 'Employees - WorkPulse' },
  { path: '**', redirectTo: 'dashboard' }
];
