import { Injectable, signal } from '@angular/core';
import { Product, ProductCategory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSignal = signal<Product[]>([
    {
      id: 101,
      sku: 'HW-DELL-7440',
      name: 'Dell Latitude 7440 Ultrabook',
      category: 'Hardware',
      price: 1450.00,
      inStock: true,
      inventoryCount: 14,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      description: 'Enterprise 14-inch laptop with Intel Core Ultra 7, 32GB LPDDR5x RAM, and 1TB NVMe SSD.',
      createdAt: '2024-03-12'
    },
    {
      id: 102,
      sku: 'SW-JET-ALL',
      name: 'JetBrains All Products Pack License',
      category: 'Software',
      price: 499.00,
      inStock: true,
      inventoryCount: 99,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
      description: 'Annual corporate developer suite subscription including WebStorm, IntelliJ, and PyCharm.',
      createdAt: '2024-01-20'
    },
    {
      id: 103,
      sku: 'PR-LOGI-MX3S',
      name: 'Logitech MX Master 3S Wireless Mouse',
      category: 'Peripherals',
      price: 99.99,
      inStock: true,
      inventoryCount: 32,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      description: 'Quiet click, 8K DPI sensor, ergonomic performance mouse for engineering workstations.',
      createdAt: '2024-02-15'
    },
    {
      id: 104,
      sku: 'CL-AWS-PRO',
      name: 'AWS Cloud Architecture Starter Pack',
      category: 'Cloud Services',
      price: 2400.00,
      inStock: true,
      inventoryCount: 50,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
      description: 'Dedicated multi-region VPC cluster setup with preconfigured Terraform security compliance.',
      createdAt: '2024-04-01'
    },
    {
      id: 105,
      sku: 'HW-DELL-U2723QE',
      name: 'Dell UltraSharp 27 4K USB-C Hub Monitor',
      category: 'Hardware',
      price: 579.50,
      inStock: false,
      inventoryCount: 0,
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      description: 'IPS Black technology monitor with 90W power delivery, RJ45 Ethernet, and Daisy Chain.',
      createdAt: '2024-02-28'
    },
    {
      id: 106,
      sku: 'PR-KEY-K2',
      name: 'Keychron K2 Pro Mechanical Keyboard',
      category: 'Peripherals',
      price: 119.00,
      inStock: true,
      inventoryCount: 8,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      description: 'QMK/VIA wireless custom mechanical keyboard with hot-swappable tactile switches.',
      createdAt: '2024-05-10'
    }
  ]);

  readonly products = this.productsSignal.asReadonly();

  addProduct(newProduct: Omit<Product, 'id' | 'createdAt'>): void {
    const item: Product = {
      ...newProduct,
      id: Math.max(...this.productsSignal().map(p => p.id), 100) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.productsSignal.update(list => [item, ...list]);
  }

  removeProduct(id: number): void {
    this.productsSignal.update(list => list.filter(p => p.id !== id));
  }
}
