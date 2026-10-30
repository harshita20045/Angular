// Core Domain Models & Type Aliases (21 October TypeScript implementations)

export type UserRole = 'Admin' | 'Manager' | 'Engineer' | 'Analyst';
export type UserStatus = 'Active' | 'Pending' | 'Suspended';

export interface UserMetrics {
  projectsCompleted: number;
  rating: number;
  openTickets: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  avatar: string;
  joinedDate: string;
  phone?: string;
  skills?: string[];
  metrics?: UserMetrics;
}

export type ProductCategory = 'Hardware' | 'Software' | 'Peripherals' | 'Cloud Services';

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  inStock: boolean;
  inventoryCount: number;
  rating: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type TaskStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate: string;
  createdAt: string;
}

// Generic API response container
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

// Generic repository abstraction
export interface IDataService<T> {
  getAll(): Promise<T[]>;
  getById(id: number | string): Promise<T | undefined>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: number | string, item: Partial<T>): Promise<T>;
  delete(id: number | string): Promise<boolean>;
}
