import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { TaskStatus, TaskPriority } from '../../core/models';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, DatePipe, ModalComponent],
  template: `
    <div class="tasks-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Engineering Workstreams</h1>
          <p class="page-subtitle">Track operational deliverables, assign sprint priorities, and coordinate engineering milestones.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-primary" (click)="isModalOpen = true">
            <span>+</span> Create Workstream Task
          </button>
        </div>
      </header>

      <!-- Metrics Row -->
      <section class="task-metrics">
        <div class="metric-card">
          <span class="m-label">Total Workstreams</span>
          <span class="m-val">{{ taskService.totalCount() }}</span>
        </div>
        <div class="metric-card">
          <span class="m-label">In Progress</span>
          <span class="m-val" style="color: #38bdf8">{{ taskService.inProgressCount() }}</span>
        </div>
        <div class="metric-card">
          <span class="m-label">Backlog</span>
          <span class="m-val" style="color: #fbbf24">{{ taskService.backlogCount() }}</span>
        </div>
        <div class="metric-card">
          <span class="m-label">Completed</span>
          <span class="m-val" style="color: #34d399">{{ taskService.completedCount() }}</span>
        </div>
      </section>

      <!-- Filter Controls -->
      <section class="filter-bar">
        <div class="filter-pills">
          @for (status of statuses; track status) {
            <button
              type="button"
              class="filter-pill"
              [class.active]="taskService.statusFilter() === status"
              (click)="taskService.setStatusFilter(status)">
              {{ status }}
            </button>
          }
        </div>

        <div class="priority-select-wrap">
          <label class="select-label">Priority Filter:</label>
          <select
            class="form-select priority-select"
            [ngModel]="taskService.priorityFilter()"
            (ngModelChange)="taskService.setPriorityFilter($event)">
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </section>

      <!-- Task Cards List -->
      <div class="task-list">
        @for (task of taskService.filteredTasks(); track task.id) {
          <div class="task-card" [class.done]="task.status === 'Completed'">
            <div class="task-header-row">
              <div class="header-left">
                <span class="priority-tag" [class]="task.priority.toLowerCase()">{{ task.priority }}</span>
                <span class="task-id">#TSK-{{ task.id }}</span>
              </div>
              <div class="header-right">
                <select
                  class="status-dropdown"
                  [ngModel]="task.status"
                  (ngModelChange)="taskService.updateStatus(task.id, $event)">
                  <option value="Backlog">Backlog</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  type="button"
                  class="task-delete-btn"
                  title="Delete task"
                  (click)="taskService.deleteTask(task.id)">
                  ✕
                </button>
              </div>
            </div>

            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>

            <div class="task-footer">
              <div class="assignee-wrap">
                <span class="assignee-icon">👤</span>
                <span class="assignee-name">{{ task.assignedTo }}</span>
              </div>
              <div class="due-wrap">
                <span class="due-label">Due:</span>
                <span class="due-date">{{ task.dueDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">⚡</div>
            <h3>No tasks found</h3>
            <p>No workstream items match your selected status and priority filters.</p>
            <button class="btn btn-secondary" (click)="resetFilters()">Reset Filters</button>
          </div>
        }
      </div>

      <!-- Create Task Modal Dialog -->
      <app-modal [isOpen]="isModalOpen" (close)="isModalOpen = false">
        <div modal-title>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #f8fafc; margin: 0">Create Workstream Task</h2>
        </div>

        <div modal-body>
          <form (ngSubmit)="handleCreateTask()">
            <div class="form-group">
              <label class="form-label">Task Headline:</label>
              <input class="form-input" [(ngModel)]="newTask.title" name="title" required placeholder="e.g. Implement OAuth2 Refresh Token Rotation" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
              <div class="form-group">
                <label class="form-label">Priority:</label>
                <select class="form-select" [(ngModel)]="newTask.priority" name="priority">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Target Completion Date:</label>
                <input class="form-input" type="date" [(ngModel)]="newTask.dueDate" name="dueDate" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Task Technical Scope &amp; Details:</label>
              <textarea class="form-textarea" rows="3" [(ngModel)]="newTask.description" name="description" placeholder="Technical deliverables, acceptance criteria..."></textarea>
            </div>
          </form>
        </div>

        <div modal-footer>
          <button type="button" class="btn btn-secondary" (click)="isModalOpen = false">Cancel</button>
          <button type="button" class="btn btn-primary" (click)="handleCreateTask()">Create Workstream</button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .tasks-container {
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

    .task-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.75rem;
    }
    @media (max-width: 768px) {
      .task-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    .metric-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 10px;
      padding: 1rem;
    }
    .m-label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      display: block;
      margin-bottom: 0.25rem;
    }
    .m-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: #f8fafc;
      font-family: var(--font-mono);
    }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .filter-pills {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .filter-pill {
      background: #111827;
      border: 1px solid #1f2937;
      color: #94a3b8;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.82rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .filter-pill:hover { background: #1f2937; color: #fff; }
    .filter-pill.active {
      background: #4f46e5;
      border-color: #4f46e5;
      color: #fff;
    }
    .priority-select-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .select-label {
      font-size: 0.82rem;
      color: #94a3b8;
    }
    .priority-select {
      width: 140px;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .task-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.25rem;
      transition: all 0.2s ease;
    }
    .task-card:hover {
      border-color: #374151;
      transform: translateY(-1px);
    }
    .task-card.done {
      opacity: 0.75;
      border-color: #064e3b;
    }

    .task-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .priority-tag {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .priority-tag.critical { background: rgba(244, 63, 94, 0.2); color: #f43f5e; }
    .priority-tag.high { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .priority-tag.medium { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
    .priority-tag.low { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
    .task-id {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #64748b;
    }

    .status-dropdown {
      background: #090e1a;
      border: 1px solid #374151;
      color: #f1f5f9;
      font-size: 0.78rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
    }
    .task-delete-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
    }
    .task-delete-btn:hover { color: #f87171; background: #1f2937; }

    .task-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.4rem;
    }
    .task-description {
      font-size: 0.86rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid #1f2937;
      font-size: 0.78rem;
    }
    .assignee-wrap {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #cbd5e1;
    }
    .due-wrap {
      display: flex;
      gap: 0.3rem;
      color: #94a3b8;
    }
    .due-date { color: #e2e8f0; font-family: var(--font-mono); }

    .empty-state {
      background: #111827;
      border: 1px dashed #374151;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  `]
})
export class TasksComponent {
  readonly taskService = inject(TaskService);

  readonly statuses: (TaskStatus | 'ALL')[] = ['ALL', 'Backlog', 'In Progress', 'In Review', 'Completed'];

  isModalOpen = false;
  newTask = {
    title: '',
    description: '',
    priority: 'Medium' as TaskPriority,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  };

  handleCreateTask(): void {
    if (!this.newTask.title) return;
    this.taskService.createTask(this.newTask);
    this.isModalOpen = false;
    this.newTask = {
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };
  }

  resetFilters(): void {
    this.taskService.setStatusFilter('ALL');
    this.taskService.setPriorityFilter('ALL');
  }
}
