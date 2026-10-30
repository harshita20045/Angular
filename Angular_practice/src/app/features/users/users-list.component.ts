import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { UserCardComponent } from './user-card.component';
import { UserRole, UserStatus } from '../../core/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterLink, FormsModule, UserCardComponent],
  template: `
    <div class="users-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Team Directory</h1>
          <p class="page-subtitle">Manage enterprise workforce, security roles, and department access.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/register" class="btn btn-primary">
            <span>+</span> Invite Member
          </a>
        </div>
      </header>

      <!-- Filter & Search Toolbar -->
      <section class="toolbar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="form-input search-input"
            placeholder="Search by name, email, or department..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
          />
        </div>

        <div class="filter-group">
          <select class="form-select" [ngModel]="selectedRole()" (ngModelChange)="selectedRole.set($event)">
            <option value="ALL">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Engineer">Engineer</option>
            <option value="Analyst">Analyst</option>
          </select>

          <select class="form-select" [ngModel]="selectedStatus()" (ngModelChange)="selectedStatus.set($event)">
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </section>

      <!-- Results Summary Bar -->
      <div class="results-meta">
        <span>Showing <strong>{{ filteredUsers().length }}</strong> of {{ userService.users().length }} members</span>
      </div>

      <!-- Users Grid -->
      <div class="users-grid">
        @for (user of filteredUsers(); track user.id) {
          <app-user-card [user]="user" (deleteUser)="handleDeleteUser($event)">
            <!-- Content Projection Slot: Displaying Project Metric -->
            <div card-extra class="metric-chip">
              <span>⭐ {{ user.metrics?.rating || 4.5 }} Rating</span>
              <span class="bullet">•</span>
              <span>{{ user.metrics?.projectsCompleted || 0 }} Projects</span>
            </div>
          </app-user-card>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No team members match your filter</h3>
            <p>Try searching with a different keyword or reset role/status filters.</p>
            <button class="btn btn-secondary" (click)="resetFilters()">Clear Filters</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      font-size: 0.92rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }

    .toolbar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }
    .search-wrap {
      flex: 1;
      min-width: 280px;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      color: #64748b;
    }
    .search-input {
      padding-left: 2.3rem;
    }
    .filter-group {
      display: flex;
      gap: 0.75rem;
    }
    .filter-group .form-select {
      width: 160px;
    }

    .results-meta {
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    @media (max-width: 1024px) {
      .users-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .users-grid { grid-template-columns: 1fr; }
    }

    .metric-chip {
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 0.35rem 0.65rem;
      font-size: 0.75rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .bullet { color: #475569; }

    .empty-state {
      grid-column: 1 / -1;
      background: #111827;
      border: 1px dashed #374151;
      border-radius: 12px;
      padding: 3rem 1.5rem;
      text-align: center;
      color: #94a3b8;
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .empty-state h3 { color: #f1f5f9; margin-bottom: 0.5rem; }
    .empty-state p { font-size: 0.9rem; margin-bottom: 1.25rem; }
  `]
})
export class UsersListComponent {
  readonly userService = inject(UserService);

  searchQuery = signal<string>('');
  selectedRole = signal<string>('ALL');
  selectedStatus = signal<string>('ALL');

  filteredUsers = computed(() => {
    const list = this.userService.users();
    const query = this.searchQuery().toLowerCase().trim();
    const role = this.selectedRole();
    const status = this.selectedStatus();

    return list.filter(user => {
      const matchQuery =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      const matchRole = role === 'ALL' || user.role === role;
      const matchStatus = status === 'ALL' || user.status === status;

      return matchQuery && matchRole && matchStatus;
    });
  });

  handleDeleteUser(id: number): void {
    if (confirm('Are you sure you want to remove this team member?')) {
      this.userService.delete(id);
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedRole.set('ALL');
    this.selectedStatus.set('ALL');
  }
}
