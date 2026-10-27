import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">{{ label() }}</span>
        @if (icon()) {
          <span class="stat-icon">{{ icon() }}</span>
        }
      </div>
      <div class="stat-value">{{ value() }}</div>
      @if (helper()) {
        <div class="stat-helper" [class.positive]="trend() === 'up'" [class.negative]="trend() === 'down'">
          @if (trend() === 'up') { <span>↑</span> }
          @if (trend() === 'down') { <span>↓</span> }
          <span>{{ helper() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .stat-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .stat-card:hover {
      border-color: #374151;
      transform: translateY(-2px);
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-icon {
      font-size: 1.25rem;
    }
    .stat-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
      margin-bottom: 0.35rem;
    }
    .stat-helper {
      font-size: 0.75rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .stat-helper.positive {
      color: #34d399;
    }
    .stat-helper.negative {
      color: #f87171;
    }
  `]
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input<string>('');
  helper = input<string>('');
  trend = input<'up' | 'down' | 'neutral'>('neutral');
}
