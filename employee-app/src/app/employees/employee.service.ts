import { Injectable, computed, signal } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: 'Engineering' | 'Design' | 'Product' | 'Marketing' | 'Human Resources' | 'Finance';
  status: 'Active' | 'On Leave' | 'Inactive';
  salary: number;
  joinDate: string;
  avatar: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employeesSignal = signal<Employee[]>([
    {
      id: 1,
      name: 'Sarah Jenkins',
      email: 'sarah.j@company.com',
      role: 'Staff Frontend Engineer',
      department: 'Engineering',
      status: 'Active',
      salary: 135000,
      joinDate: '2022-03-15',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'Alexander Chen',
      email: 'a.chen@company.com',
      role: 'Senior Product Designer',
      department: 'Design',
      status: 'Active',
      salary: 120000,
      joinDate: '2021-08-10',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'New York, NY'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      email: 'elena.r@company.com',
      role: 'Principal Architect',
      department: 'Engineering',
      status: 'Active',
      salary: 165000,
      joinDate: '2020-01-20',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: 'Austin, TX'
    },
    {
      id: 4,
      name: 'Marcus Brody',
      email: 'm.brody@company.com',
      role: 'Growth Marketing Lead',
      department: 'Marketing',
      status: 'On Leave',
      salary: 110000,
      joinDate: '2023-04-01',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      location: 'Seattle, WA'
    },
    {
      id: 5,
      name: 'Priya Sharma',
      email: 'priya.s@company.com',
      role: 'Lead Product Manager',
      department: 'Product',
      status: 'Active',
      salary: 142000,
      joinDate: '2021-11-18',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'San Francisco, CA'
    },
    {
      id: 6,
      name: 'David Kim',
      email: 'david.k@company.com',
      role: 'HR Business Partner',
      department: 'Human Resources',
      status: 'Active',
      salary: 95000,
      joinDate: '2023-09-05',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      location: 'Chicago, IL'
    },
    {
      id: 7,
      name: 'Olivia Martinez',
      email: 'olivia.m@company.com',
      role: 'Financial Analyst',
      department: 'Finance',
      status: 'Inactive',
      salary: 98000,
      joinDate: '2022-06-12',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      location: 'Boston, MA'
    }
  ]);

  readonly employees = this.employeesSignal.asReadonly();

  // Metrics
  readonly totalCount = computed(() => this.employeesSignal().length);

  readonly activeCount = computed(() =>
    this.employeesSignal().filter(e => e.status === 'Active').length
  );

  readonly onLeaveCount = computed(() =>
    this.employeesSignal().filter(e => e.status === 'On Leave').length
  );

  readonly departmentStats = computed(() => {
    const list = this.employeesSignal();
    const counts: Record<string, number> = {};
    for (const emp of list) {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / list.length) * 100)
    }));
  });

  readonly averageSalary = computed(() => {
    const list = this.employeesSignal();
    if (!list.length) return 0;
    const total = list.reduce((acc, curr) => acc + curr.salary, 0);
    return Math.round(total / list.length);
  });

  addEmployee(employee: Omit<Employee, 'id'>) {
    const current = this.employeesSignal();
    const newId = current.length > 0 ? Math.max(...current.map(e => e.id)) + 1 : 1;
    this.employeesSignal.update(items => [
      { ...employee, id: newId },
      ...items
    ]);
  }

  updateEmployeeStatus(id: number, status: Employee['status']) {
    this.employeesSignal.update(items =>
      items.map(emp => (emp.id === id ? { ...emp, status } : emp))
    );
  }

  deleteEmployee(id: number) {
    this.employeesSignal.update(items => items.filter(emp => emp.id !== id));
  }
}
