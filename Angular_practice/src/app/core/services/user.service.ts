import { Injectable, signal } from '@angular/core';
import { User, IDataService, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IDataService<User> {
  private usersSignal = signal<User[]>([
    {
      id: 1,
      name: 'Helly nikar',
      email: 'h.baghel@pulse-enterprise.com',
      role: 'Admin',
      status: 'Active',
      department: 'Engineering & Architecture',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      joinedDate: '2023-04-15',
      phone: '+1 (555) 382-9011',
      skills: ['Angular', 'TypeScript', 'System Architecture', 'RxJS', 'CSS'],
      metrics: { projectsCompleted: 24, rating: 4.9, openTickets: 3 }
    },
    {
      id: 2,
      name: 'Marcus Vance',
      email: 'm.vance@pulse-enterprise.com',
      role: 'Manager',
      status: 'Active',
      department: 'Cloud Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      joinedDate: '2022-11-01',
      phone: '+1 (555) 749-3320',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
      metrics: { projectsCompleted: 38, rating: 4.8, openTickets: 5 }
    },
    {
      id: 3,
      name: 'Elena Rostova',
      email: 'e.rostova@pulse-enterprise.com',
      role: 'Engineer',
      status: 'Active',
      department: 'Frontend Engineering',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      joinedDate: '2024-02-18',
      phone: '+1 (555) 612-8841',
      skills: ['Angular Signals', 'Web Performance', 'Microfrontends'],
      metrics: { projectsCompleted: 14, rating: 4.7, openTickets: 2 }
    },
    {
      id: 4,
      name: 'Devon Miller',
      email: 'd.miller@pulse-enterprise.com',
      role: 'Analyst',
      status: 'Pending',
      department: 'Business Intelligence',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      joinedDate: '2024-09-05',
      phone: '+1 (555) 902-1144',
      skills: ['Data Modeling', 'SQL', 'Tableau', 'Forecasting'],
      metrics: { projectsCompleted: 6, rating: 4.5, openTickets: 1 }
    },
    {
      id: 5,
      name: 'Aisha Al-Mansoor',
      email: 'a.almansoor@pulse-enterprise.com',
      role: 'Engineer',
      status: 'Suspended',
      department: 'Security Operations',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      joinedDate: '2023-08-20',
      phone: '+1 (555) 438-5590',
      skills: ['Cybersecurity', 'SOC 2', 'Penetration Testing'],
      metrics: { projectsCompleted: 19, rating: 4.6, openTickets: 0 }
    }
  ]);

  readonly users = this.usersSignal.asReadonly();

  // Async method with async/await (demonstrating modern TS 21 Oct requirement)
  async getAll(): Promise<User[]> {
    await this.simulateLatency(150);
    return this.usersSignal();
  }

  async getById(id: number | string): Promise<User | undefined> {
    await this.simulateLatency(120);
    const numId = Number(id);
    return this.usersSignal().find(u => u.id === numId);
  }

  async create(userDto: Omit<User, 'id'>): Promise<User> {
    await this.simulateLatency(250);
    const newUser: User = {
      ...userDto,
      id: Math.max(...this.usersSignal().map(u => u.id), 0) + 1
    };
    this.usersSignal.update(users => [newUser, ...users]);
    return newUser;
  }

  async update(id: number | string, changes: Partial<User>): Promise<User> {
    await this.simulateLatency(200);
    const numId = Number(id);
    let updatedUser: User | undefined;

    this.usersSignal.update(users =>
      users.map(u => {
        if (u.id === numId) {
          updatedUser = { ...u, ...changes };
          return updatedUser;
        }
        return u;
      })
    );

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }
    return updatedUser;
  }

  async delete(id: number | string): Promise<boolean> {
    await this.simulateLatency(180);
    const numId = Number(id);
    const exists = this.usersSignal().some(u => u.id === numId);
    if (exists) {
      this.usersSignal.update(users => users.filter(u => u.id !== numId));
      return true;
    }
    return false;
  }

  // Check email availability (for async reactive forms validator on 27 Oct)
  async checkEmailAvailable(email: string): Promise<boolean> {
    await this.simulateLatency(400);
    const exists = this.usersSignal().some(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    return !exists;
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
