import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskItem, TaskStatus, TaskPriority } from '../models';
import { APP_CONFIG } from '../tokens/app-config.token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Inject dependencies using modern functional inject()
  private readonly config = inject(APP_CONFIG);
  private readonly auth = inject(AuthService);

  private tasksSignal = signal<TaskItem[]>([
    {
      id: 1,
      title: 'Upgrade Enterprise Core to Angular 19',
      description: 'Migrate to standalone bootstrapping, replace zone-heavy templates with Signals, and enable Vite build pipeline.',
      status: 'Completed',
      priority: 'Critical',
      assignedTo: 'Harshita Baghel',
      dueDate: '2026-10-25',
      createdAt: '2026-10-21'
    },
    {
      id: 2,
      title: 'Implement Fine-Grained Cart State Graph',
      description: 'Replace legacy BehaviorSubject subscriptions with atomic signal computed derivations for tax and discounts.',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Elena Rostova',
      dueDate: '2026-10-28',
      createdAt: '2026-10-22'
    },
    {
      id: 3,
      title: 'Configure Asynchronous Domain Validation',
      description: 'Build debounce check against LDAP user registry for corporate email uniqueness verification in onboarding.',
      status: 'In Progress',
      priority: 'Medium',
      assignedTo: 'Marcus Vance',
      dueDate: '2026-10-29',
      createdAt: '2026-10-23'
    },
    {
      id: 4,
      title: 'Security Audit & Role Guard Hardening',
      description: 'Enforce functional canActivateFn guards on administrative subroutes and audit token revocation handlers.',
      status: 'Backlog',
      priority: 'High',
      assignedTo: 'Aisha Al-Mansoor',
      dueDate: '2026-11-02',
      createdAt: '2026-10-24'
    },
    {
      id: 5,
      title: 'Customer Billing Portal Multi-Slot Card Refactor',
      description: 'Utilize ng-content multi-slot projection for dynamic header badges, invoice breakdowns, and payment actions.',
      status: 'In Review',
      priority: 'Low',
      assignedTo: 'Devon Miller',
      dueDate: '2026-10-30',
      createdAt: '2026-10-24'
    }
  ]);

  readonly tasks = this.tasksSignal.asReadonly();

  // Filter state signals
  readonly statusFilter = signal<TaskStatus | 'ALL'>('ALL');
  readonly priorityFilter = signal<TaskPriority | 'ALL'>('ALL');

  // Filtered tasks selector
  readonly filteredTasks = computed(() => {
    const list = this.tasksSignal();
    const sFilter = this.statusFilter();
    const pFilter = this.priorityFilter();

    return list.filter(task => {
      const matchStatus = sFilter === 'ALL' || task.status === sFilter;
      const matchPriority = pFilter === 'ALL' || task.priority === pFilter;
      return matchStatus && matchPriority;
    });
  });

  // Task statistics computed derivations
  readonly totalCount = computed(() => this.tasksSignal().length);
  readonly completedCount = computed(() => 
    this.tasksSignal().filter(t => t.status === 'Completed').length
  );
  readonly inProgressCount = computed(() => 
    this.tasksSignal().filter(t => t.status === 'In Progress').length
  );
  readonly backlogCount = computed(() => 
    this.tasksSignal().filter(t => t.status === 'Backlog').length
  );

  createTask(dto: { title: string; description: string; priority: TaskPriority; dueDate: string }): TaskItem {
    const creatorName = this.auth.currentUser()?.name ?? 'Unassigned';
    const newTask: TaskItem = {
      id: Math.max(...this.tasksSignal().map(t => t.id), 0) + 1,
      title: dto.title.trim(),
      description: dto.description.trim(),
      status: 'Backlog',
      priority: dto.priority,
      assignedTo: creatorName,
      dueDate: dto.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.tasksSignal.update(items => [newTask, ...items]);
    return newTask;
  }

  updateStatus(id: number, newStatus: TaskStatus): void {
    this.tasksSignal.update(items =>
      items.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }

  deleteTask(id: number): void {
    this.tasksSignal.update(items => items.filter(t => t.id !== id));
  }

  setStatusFilter(status: TaskStatus | 'ALL'): void {
    this.statusFilter.set(status);
  }

  setPriorityFilter(priority: TaskPriority | 'ALL'): void {
    this.priorityFilter.set(priority);
  }
}
