import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1 class="error-title">Requested Resource Not Found</h1>
      <p class="error-desc">
        The requested enterprise endpoint or routing parameter does not exist within the current tenant workspace.
      </p>
      <div class="actions">
        <a routerLink="/dashboard" class="btn btn-primary">Return to Executive Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      max-width: 600px;
      margin: 4rem auto;
      text-align: center;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      padding: 3rem 2rem;
    }
    .error-code {
      font-size: 5rem;
      font-weight: 900;
      font-family: var(--font-mono);
      color: #6366f1;
      line-height: 1;
      margin-bottom: 1rem;
    }
    .error-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.5rem;
    }
    .error-desc {
      font-size: 0.92rem;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class NotFoundComponent {}
