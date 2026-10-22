import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {
  private readonly employeeService = inject(EmployeeService);

  readonly searchQuery = signal('');
  readonly selectedDepartment = signal<string>('All');
  readonly selectedStatus = signal<string>('All');
  readonly isAddModalOpen = signal(false);

  // Form Model for New Employee
  newEmployee = {
    name: '',
    email: '',
    role: '',
    department: 'Engineering' as Employee['department'],
    status: 'Active' as Employee['status'],
    salary: 85000,
    joinDate: new Date().toISOString().substring(0, 10),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    location: 'Remote'
  };

  readonly departments = [
    'All',
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Human Resources',
    'Finance'
  ];

  readonly statuses = ['All', 'Active', 'On Leave', 'Inactive'];

  readonly filteredEmployees = computed(() => {
    const all = this.employeeService.employees();
    const query = this.searchQuery().toLowerCase().trim();
    const dept = this.selectedDepartment();
    const stat = this.selectedStatus();

    return all.filter(emp => {
      const matchesQuery =
        !query ||
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query);

      const matchesDept = dept === 'All' || emp.department === dept;
      const matchesStat = stat === 'All' || emp.status === stat;

      return matchesQuery && matchesDept && matchesStat;
    });
  });

  openAddModal() {
    this.isAddModalOpen.set(true);
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
  }

  saveEmployee() {
    if (!this.newEmployee.name || !this.newEmployee.email || !this.newEmployee.role) {
      return;
    }

    this.employeeService.addEmployee({
      ...this.newEmployee
    });

    // Reset Form
    this.newEmployee = {
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      status: 'Active',
      salary: 85000,
      joinDate: new Date().toISOString().substring(0, 10),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      location: 'Remote'
    };

    this.closeAddModal();
  }

  toggleStatus(emp: Employee) {
    const nextStatus: Record<Employee['status'], Employee['status']> = {
      Active: 'On Leave',
      'On Leave': 'Inactive',
      Inactive: 'Active'
    };
    this.employeeService.updateEmployeeStatus(emp.id, nextStatus[emp.status]);
  }

  deleteEmployee(id: number, name: string) {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      this.employeeService.deleteEmployee(id);
    }
  }
}
