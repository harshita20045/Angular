import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../employees/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private readonly employeeService = inject(EmployeeService);

  readonly totalEmployees = this.employeeService.totalCount;
  readonly activeEmployees = this.employeeService.activeCount;
  readonly onLeaveEmployees = this.employeeService.onLeaveCount;
  readonly avgSalary = this.employeeService.averageSalary;
  readonly departmentStats = this.employeeService.departmentStats;
  readonly employees = this.employeeService.employees;

  // Top recent hires (first 4)
  get recentHires() {
    return this.employees().slice(0, 4);
  }
}
