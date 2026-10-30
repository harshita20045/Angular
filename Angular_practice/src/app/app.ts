import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: '<app-layout></app-layout>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-practice');
}
