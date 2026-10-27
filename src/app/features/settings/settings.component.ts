import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { APP_CONFIG } from '../../core/tokens/app-config.token';
import { UserRole } from '../../core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Enterprise Security &amp; Settings</h1>
          <p class="page-subtitle">Administrative privileges, authentication token management, and platform configuration.</p>
        </div>
      </header>

      <div class="settings-grid">
        <!-- Auth Role Switcher -->
        <div class="card-panel">
          <h2 class="panel-title">Session Clearance Level</h2>
          <p class="panel-desc">Test functional route guards (adminGuard &amp; authGuard) by simulating clearance levels:</p>

          <div class="role-selector">
            <button
              type="button"
              class="role-btn"
              [class.active]="authService.currentUser()?.role === 'Admin'"
              (click)="authService.loginAs('Admin')">
              👑 Administrator (Full Access)
            </button>
            <button
              type="button"
              class="role-btn"
              [class.active]="authService.currentUser()?.role === 'Manager'"
              (click)="authService.loginAs('Manager')">
              👔 Manager (Restricted Admin)
            </button>
            <button
              type="button"
              class="role-btn"
              [class.active]="authService.currentUser()?.role === 'Engineer'"
              (click)="authService.loginAs('Engineer')">
              💻 Engineer (Standard Member)
            </button>
          </div>

          <div class="current-session-info">
            <div class="info-row">
              <span class="info-key">Active Subject:</span>
              <span class="info-val">{{ authService.currentUser()?.name || 'Unauthenticated' }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Cleared Role:</span>
              <span class="info-val highlight">{{ authService.currentUser()?.role || 'None' }}</span>
            </div>
          </div>
        </div>

        <!-- Global Injection Token Config -->
        <div class="card-panel">
          <h2 class="panel-title">Platform Injection Token Parameters</h2>
          <p class="panel-desc">Resolved at runtime via Angular's APP_CONFIG InjectionToken:</p>

          <div class="config-table">
            <div class="config-row">
              <span class="cfg-key">APP_CONFIG.appName</span>
              <span class="cfg-val">{{ config.appName }}</span>
            </div>
            <div class="config-row">
              <span class="cfg-key">APP_CONFIG.version</span>
              <span class="cfg-val">{{ config.version }}</span>
            </div>
            <div class="config-row">
              <span class="cfg-key">APP_CONFIG.apiEndpoint</span>
              <span class="cfg-val">{{ config.apiEndpoint }}</span>
            </div>
            <div class="config-row">
              <span class="cfg-key">APP_CONFIG.telemetry</span>
              <span class="cfg-val" style="color: #34d399">{{ config.enableTelemetry ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .page-header { margin-bottom: 2rem; }
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

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .settings-grid { grid-template-columns: 1fr; }
    }

    .card-panel {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 1.5rem;
    }
    .panel-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.35rem;
    }
    .panel-desc {
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 1.25rem;
      line-height: 1.4;
    }

    .role-selector {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .role-btn {
      padding: 0.75rem 1rem;
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      color: #cbd5e1;
      text-align: left;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .role-btn:hover {
      background: #1e293b;
      color: #fff;
    }
    .role-btn.active {
      background: rgba(99, 102, 241, 0.15);
      border-color: #6366f1;
      color: #a5b4fc;
    }

    .current-session-info {
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .info-row, .config-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }
    .info-key, .cfg-key { color: #64748b; font-family: var(--font-mono); font-size: 0.78rem; }
    .info-val, .cfg-val { color: #e2e8f0; font-weight: 600; }
    .info-val.highlight { color: #34d399; }

    .config-table {
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `]
})
export class SettingsComponent {
  readonly authService = inject(AuthService);
  readonly config = inject(APP_CONFIG);
}
