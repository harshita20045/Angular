import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-area">
              <ng-content select="[modal-title]"></ng-content>
            </div>
            <button type="button" class="close-btn" (click)="close.emit()">✕</button>
          </div>

          <div class="modal-body">
            <ng-content select="[modal-body]"></ng-content>
          </div>

          <div class="modal-footer">
            <ng-content select="[modal-footer]"></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-dialog {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      animation: modalFadeIn 0.2s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #1f2937;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0d1322;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      transition: all 0.15s;
    }
    .close-btn:hover {
      background: #1f2937;
      color: #fff;
    }
    .modal-body {
      padding: 1.5rem;
      color: #cbd5e1;
      max-height: 75vh;
      overflow-y: auto;
    }
    .modal-footer {
      padding: 1rem 1.5rem;
      background: #0d1322;
      border-top: 1px solid #1f2937;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
