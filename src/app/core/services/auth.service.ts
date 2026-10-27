import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Current authenticated user state
  private currentUserSignal = signal<User | null>({
    id: 1,
    name: 'Helly nikar',
    email: 'h.nikar@pulse-enterprise.com',
    role: 'Admin',
    status: 'Active',
    department: 'Engineering & Architecture',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    joinedDate: '2023-04-15',
    phone: '+1 (555) 382-9011',
    skills: ['Angular', 'TypeScript', 'System Architecture', 'RxJS', 'CSS Architecture'],
    metrics: {
      projectsCompleted: 24,
      rating: 4.9,
      openTickets: 3
    }
  });

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'Admin');

  loginAs(role: UserRole): void {
    this.currentUserSignal.set({
      id: 1,
      name: `Demo ${role}`,
      email: `${role.toLowerCase()}@pulse-enterprise.com`,
      role,
      status: 'Active',
      department: role === 'Admin' ? 'Executive Leadership' : 'Product Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      joinedDate: '2024-01-10',
      skills: ['Operations', 'Management', 'Strategy'],
      metrics: {
        projectsCompleted: 12,
        rating: 4.8,
        openTickets: 1
      }
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}
