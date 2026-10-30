import { Component, inject, input, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User, UserStatus } from '../../core/models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="profile-container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumb-nav">
        <a routerLink="/users" class="breadcrumb-link">Team Directory</a>
        <span class="sep">/</span>
        <span class="current">{{ user()?.name || 'Loading Profile...' }}</span>
      </nav>

      @if (user(); as u) {
        <div class="profile-card">
          <div class="profile-banner"></div>
          <div class="profile-header">
            <div class="header-left">
              <img [src]="u.avatar" [alt]="u.name" class="profile-avatar" />
              <div class="header-info">
                <div class="name-row">
                  <h1 class="user-title">{{ u.name }}</h1>
                  <span class="badge" [class]="u.status === 'Active' ? 'badge-green' : 'badge-amber'">
                    {{ u.status }}
                  </span>
                </div>
                <div class="role-line">{{ u.role }} • {{ u.department }}</div>
              </div>
            </div>

            <div class="header-actions">
              <button 
                type="button" 
                class="btn btn-secondary" 
                (click)="toggleStatus(u)">
                {{ u.status === 'Active' ? 'Suspend Member' : 'Activate Member' }}
              </button>
              <button 
                type="button" 
                class="btn btn-danger" 
                (click)="deleteProfile(u.id)">
                Delete Account
              </button>
            </div>
          </div>

          <!-- Info Columns -->
          <div class="profile-body">
            <div class="info-section">
              <h3 class="section-heading">Contact &amp; Identification</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Corporate Email</span>
                  <span class="info-val">{{ u.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Direct Phone</span>
                  <span class="info-val">{{ u.phone || '+1 (555) 000-0000' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Member ID</span>
                  <span class="info-val">#USR-00{{ u.id }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Onboarding Date</span>
                  <span class="info-val">{{ u.joinedDate }}</span>
                </div>
              </div>

              <!-- Skills Badges -->
              @if (u.skills && u.skills.length > 0) {
                <div class="skills-block">
                  <span class="info-label">Core Competencies &amp; Skills</span>
                  <div class="skills-wrap">
                    @for (skill of u.skills; track skill) {
                      <span class="skill-tag">{{ skill }}</span>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Performance Metrics -->
            <div class="metrics-section">
              <h3 class="section-heading">Operational Metrics</h3>
              <div class="kpi-mini-card">
                <div class="kpi-num">{{ u.metrics?.projectsCompleted || 0 }}</div>
                <div class="kpi-sub">Delivered Engineering Projects</div>
              </div>
              <div class="kpi-mini-card">
                <div class="kpi-num" style="color: #38bdf8">{{ u.metrics?.rating || 4.5 }} / 5.0</div>
                <div class="kpi-sub">Quarterly Peer Performance Rating</div>
              </div>
              <div class="kpi-mini-card">
                <div class="kpi-num" style="color: #fbbf24">{{ u.metrics?.openTickets || 0 }}</div>
                <div class="kpi-sub">Assigned Support Escalations</div>
              </div>
            </div>
          </div>
        </div>
      } @else if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Retrieving enterprise member profile...</p>
        </div>
      } @else {
        <div class="empty-state">
          <h2>Member Not Found</h2>
          <p>The requested team member does not exist or has been removed.</p>
          <a routerLink="/users" class="btn btn-secondary">Back to Directory</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .breadcrumb-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .breadcrumb-link {
      color: #6366f1;
      text-decoration: none;
    }
    .breadcrumb-link:hover { text-decoration: underline; }
    .sep { color: #475569; }
    .current { color: #94a3b8; }

    .profile-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      overflow: hidden;
    }
    .profile-banner {
      height: 120px;
      background: linear-gradient(135deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%);
      border-bottom: 1px solid #1f2937;
    }
    .profile-header {
      padding: 0 2rem 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: -45px;
      border-bottom: 1px solid #1f2937;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .header-left {
      display: flex;
      align-items: flex-end;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .profile-avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #111827;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }
    .name-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0;
    }
    .role-line {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .profile-body {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 2rem;
      padding: 2rem;
    }
    @media (max-width: 768px) {
      .profile-body { grid-template-columns: 1fr; }
    }

    .section-heading {
      font-size: 1rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #1f2937;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .info-val {
      font-size: 0.92rem;
      color: #e2e8f0;
      font-weight: 500;
    }

    .skills-wrap {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }
    .skill-tag {
      background: #1e293b;
      color: #a5b4fc;
      border: 1px solid #334155;
      padding: 0.3rem 0.65rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 500;
    }

    .kpi-mini-card {
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 0.85rem;
    }
    .kpi-num {
      font-size: 1.6rem;
      font-weight: 800;
      color: #f8fafc;
      font-family: var(--font-mono);
    }
    .kpi-sub {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }

    .loading-state, .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
    }
  `]
})
export class UserDetailComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Route parameter input binding (Angular 16+)
  id = input<string>();

  user = signal<User | undefined>(undefined);
  loading = signal<boolean>(true);

  async ngOnInit(): Promise<void> {
    const userId = this.id() || this.route.snapshot.paramMap.get('id');
    if (userId) {
      const found = await this.userService.getById(userId);
      this.user.set(found);
    }
    this.loading.set(false);
  }

  async toggleStatus(currentUser: User): Promise<void> {
    const newStatus: UserStatus = currentUser.status === 'Active' ? 'Suspended' : 'Active';
    const updated = await this.userService.update(currentUser.id, { status: newStatus });
    this.user.set(updated);
  }

  async deleteProfile(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this profile?')) {
      await this.userService.delete(id);
      this.router.navigate(['/users']);
    }
  }
}
