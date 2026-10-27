import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../services/cart.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: () => number | string | null;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar-wrapper">
      <!-- Enterprise Brand -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <span class="logo-mark">P</span>
        </div>
        <div class="brand-text">
          <span class="brand-name">Pulse Suite</span>
          <span class="brand-tenant">Enterprise Cloud v2.4</span>
        </div>
      </div>

      <!-- Navigation Section -->
      <nav class="nav-container">
        <div class="nav-category">WORKSPACE</div>
        <ul class="nav-menu">
          @for (item of mainNavItems; track item.path) {
            <li>
              <a [routerLink]="item.path" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-label">{{ item.label }}</span>
                @if (item.badge && item.badge()) {
                  <span class="nav-badge">{{ item.badge() }}</span>
                }
              </a>
            </li>
          }
        </ul>

        <div class="nav-category" style="margin-top: 1.5rem">ADMINISTRATION</div>
        <ul class="nav-menu">
          @for (item of adminNavItems; track item.path) {
            <li>
              <a [routerLink]="item.path" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-label">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Authenticated User Footer Profile -->
      <div class="sidebar-user">
        @if (authService.currentUser(); as user) {
          <div class="user-block">
            <img [src]="user.avatar" [alt]="user.name" class="user-avatar" />
            <div class="user-meta">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.role }}</span>
            </div>
            <button
              type="button"
              class="logout-btn"
              title="End session"
              (click)="authService.logout()">
              ⏻
            </button>
          </div>
        } @else {
          <button
            type="button"
            class="btn btn-sm btn-primary login-btn"
            (click)="authService.loginAs('Admin')">
            Log In as Administrator
          </button>
        }
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  readonly cartService = inject(CartService);
  readonly taskService = inject(TaskService);
  readonly authService = inject(AuthService);

  readonly mainNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Team Directory', path: '/users', icon: '👥' },
    { label: 'Equipment & Software', path: '/products', icon: '📦' },
    {
      label: 'Procurement Cart',
      path: '/cart',
      icon: '🛒',
      badge: () => this.cartService.totalItemsCount() || null
    },
    {
      label: 'Workstreams',
      path: '/tasks',
      icon: '⚡',
      badge: () => this.taskService.inProgressCount() || null
    }
  ];

  readonly adminNavItems: NavItem[] = [
    { label: 'Member Onboarding', path: '/register', icon: '📝' },
    { label: 'Security & Settings', path: '/settings', icon: '⚙️' }
  ];
}
