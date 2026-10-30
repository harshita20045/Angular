import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, StatCardComponent, TimeAgoPipe],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">Executive Overview</h1>
          <p class="page-subtitle">Welcome back, {{ authService.currentUser()?.name || 'Administrator' }}. Operational status as of {{ today | date:'mediumDate' }}.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/tasks" class="btn btn-secondary">
            <span>📋</span> View Tasks
          </a>
          <a routerLink="/register" class="btn btn-primary">
            <span>+</span> Onboard Member
          </a>
        </div>
      </header>

      <!-- KPI Metrics Row -->
      <section class="kpi-grid">
        <app-stat-card
          label="Active Users"
          [value]="userService.users().length"
          icon="👥"
          helper="+12% from last month"
          trend="up">
        </app-stat-card>
        <app-stat-card
          label="Catalog Items"
          [value]="productService.products().length"
          icon="📦"
          helper="96% stock availability"
          trend="neutral">
        </app-stat-card>
        <app-stat-card
          label="Active Tasks"
          [value]="taskService.totalCount()"
          icon="⚡"
          [helper]="taskService.inProgressCount() + ' in progress'"
          trend="up">
        </app-stat-card>
        <app-stat-card
          label="Cart Value"
          [value]="(cartService.finalTotal() | currency:'USD') || '$0'"
          icon="🛒"
          [helper]="cartService.totalItemsCount() + ' items staged'"
          trend="neutral">
        </app-stat-card>
      </section>

      <!-- Main Dashboard Grid -->
      <div class="content-grid">
        <!-- Left: Recent Tasks & Workstreams -->
        <div class="card-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Active Engineering Tasks</h2>
              <span class="panel-desc">Real-time status updates across active workstreams</span>
            </div>
            <a routerLink="/tasks" class="panel-link">Manage All →</a>
          </div>

          <div class="task-list">
            @for (task of taskService.tasks().slice(0, 4); track task.id) {
              <div class="task-item">
                <div class="task-left">
                  <span class="status-indicator-dot" [class]="task.status.toLowerCase().replace(' ', '-')"></span>
                  <div>
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-meta">
                      <span>{{ task.assignedTo }}</span>
                      <span class="bullet">•</span>
                      <span>Created {{ task.createdAt | timeAgo }}</span>
                    </div>
                  </div>
                </div>
                <div class="task-right">
                  <span class="badge" [class]="getPriorityClass(task.priority)">{{ task.priority }}</span>
                  <span class="badge badge-subtle">{{ task.status }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right: Team Roster & Quick Actions -->
        <div class="card-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Team Directory</h2>
              <span class="panel-desc">Recently active enterprise members</span>
            </div>
            <a routerLink="/users" class="panel-link">View Directory →</a>
          </div>

          <div class="user-roster">
            @for (user of userService.users().slice(0, 4); track user.id) {
              <div class="user-row">
                <img [src]="user.avatar" [alt]="user.name" class="user-avatar" />
                <div class="user-info">
                  <a [routerLink]="['/users', user.id]" class="user-name">{{ user.name }}</a>
                  <div class="user-department">{{ user.department }}</div>
                </div>
                <div class="user-badge-wrap">
                  <span class="badge" [class]="user.status === 'Active' ? 'badge-green' : 'badge-amber'">
                    {{ user.status }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
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
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .content-grid { grid-template-columns: 1fr; }
    }

    .card-panel {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 1.5rem;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #1f2937;
    }
    .panel-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0;
    }
    .panel-desc {
      font-size: 0.78rem;
      color: #64748b;
      margin-top: 0.2rem;
      display: block;
    }
    .panel-link {
      font-size: 0.82rem;
      font-weight: 600;
      color: #6366f1;
      text-decoration: none;
    }
    .panel-link:hover { text-decoration: underline; }

    /* Task Items */
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.85rem 1rem;
    }
    .task-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .status-indicator-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .status-indicator-dot.completed { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .status-indicator-dot.in-progress { background: #38bdf8; box-shadow: 0 0 6px #38bdf8; }
    .status-indicator-dot.in-review { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }
    .status-indicator-dot.backlog { background: #64748b; }

    .task-title {
      font-size: 0.88rem;
      font-weight: 600;
      color: #f1f5f9;
    }
    .task-meta {
      font-size: 0.75rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-top: 0.15rem;
    }
    .bullet { color: #475569; }
    .task-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge-subtle {
      background: #1e293b;
      color: #94a3b8;
      font-size: 0.7rem;
    }

    /* User Roster */
    .user-roster {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .user-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
    }
    .user-info { flex: 1; }
    .user-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #f1f5f9;
      text-decoration: none;
    }
    .user-name:hover { color: #6366f1; }
    .user-department {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.1rem;
    }
  `]
})
export class DashboardComponent {
  readonly today = new Date();
  readonly userService = inject(UserService);
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly taskService = inject(TaskService);
  readonly authService = inject(AuthService);

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'badge-rose';
      case 'High': return 'badge-amber';
      case 'Medium': return 'badge-blue';
      default: return 'badge-subtle';
    }
  }
}
