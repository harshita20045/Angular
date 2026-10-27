import { Component, input, output, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../core/models';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="user-card" [class.suspended]="user().status === 'Suspended'">
      <div class="card-top">
        <img [src]="user().avatar" [alt]="user().name" class="avatar" />
        <div class="identity">
          <a [routerLink]="['/users', user().id]" class="name">{{ user().name }}</a>
          <span class="email">{{ user().email }}</span>
          <span class="role-badge" [class]="user().role.toLowerCase()">{{ user().role }}</span>
        </div>
        <div class="status-indicator" [class]="user().status.toLowerCase()">
          {{ user().status }}
        </div>
      </div>

      <div class="card-details">
        <div class="detail-item">
          <span class="detail-label">Department</span>
          <span class="detail-val">{{ user().department }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Joined</span>
          <span class="detail-val">{{ user().joinedDate }}</span>
        </div>
      </div>

      <!-- Content Projection Slot for Custom Actions or Metrics -->
      <div class="card-projection">
        <ng-content select="[card-extra]"></ng-content>
      </div>

      <div class="card-actions">
        <a [routerLink]="['/users', user().id]" class="btn btn-sm btn-secondary">
          Profile Details
        </a>
        <button type="button" class="btn btn-sm btn-danger" (click)="deleteUser.emit(user().id)">
          Remove
        </button>
      </div>
    </div>
  `,
  styles: [`
    .user-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
    }
    .user-card:hover {
      border-color: #374151;
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4);
    }
    .user-card.suspended {
      opacity: 0.75;
      border-color: #451a1a;
    }
    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      margin-bottom: 1rem;
    }
    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #1f2937;
    }
    .identity {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .name {
      font-size: 0.98rem;
      font-weight: 700;
      color: #f1f5f9;
      text-decoration: none;
    }
    .name:hover { color: #6366f1; }
    .email {
      font-size: 0.78rem;
      color: #94a3b8;
      margin-bottom: 0.35rem;
    }
    .role-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      width: fit-content;
    }
    .role-badge.admin { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .role-badge.manager { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .role-badge.engineer { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .role-badge.analyst { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

    .status-indicator {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .status-indicator.active { background: #064e3b; color: #34d399; }
    .status-indicator.pending { background: #78350f; color: #fbbf24; }
    .status-indicator.suspended { background: #7f1d1d; color: #f87171; }

    .card-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      padding: 0.75rem 0;
      border-top: 1px solid #1f2937;
      border-bottom: 1px solid #1f2937;
      margin-bottom: 0.75rem;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    .detail-label {
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }
    .detail-val {
      font-size: 0.8rem;
      color: #cbd5e1;
      font-weight: 500;
    }

    .card-projection {
      margin-bottom: 0.75rem;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: auto;
    }
  `]
})
export class UserCardComponent implements OnInit, OnChanges, OnDestroy {
  // Input and Output signals (Covers modern component communication 22 Oct)
  user = input.required<User>();
  deleteUser = output<number>();

  ngOnInit(): void {
    // Component lifecycle initialized
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to input property changes
  }

  ngOnDestroy(): void {
    // Teardown resources
  }
}
