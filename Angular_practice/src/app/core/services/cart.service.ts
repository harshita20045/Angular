import { Injectable, signal, computed, effect } from '@angular/core';
import { Product, CartItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'pulse_shopping_cart';

  // State: Cart items signal
  private itemsSignal = signal<CartItem[]>(this.loadInitialCart());

  // State: Promo code & discount percentage
  readonly promoCode = signal<string>('');
  readonly discountPercentage = signal<number>(0);
  readonly promoMessage = signal<string>('');

  // Public readonly exposure
  readonly items = this.itemsSignal.asReadonly();

  // Computed state derivations
  readonly totalItemsCount = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.itemsSignal().reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );
  });

  readonly discountAmount = computed(() => {
    const rate = this.discountPercentage();
    if (rate <= 0) return 0;
    return this.subtotal() * (rate / 100);
  });

  readonly estimatedTax = computed(() => {
    const taxableAmount = this.subtotal() - this.discountAmount();
    return Math.max(0, taxableAmount * 0.0825); // 8.25% standard corporate sales tax
  });

  readonly finalTotal = computed(() => {
    return Math.max(0, this.subtotal() - this.discountAmount() + this.estimatedTax());
  });

  constructor() {
    // Genuine effect: Synchronize cart state to browser localStorage
    effect(() => {
      const current = this.itemsSignal();
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
        } catch {
          // Ignore storage quota errors
        }
      }
    });
  }

  addToCart(product: Product, quantity = 1): void {
    this.itemsSignal.update(currentItems => {
      const existing = currentItems.find(item => item.product.id === product.id);
      if (existing) {
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentItems, { product, quantity }];
    });
  }

  incrementQuantity(productId: number): void {
    this.itemsSignal.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  decrementQuantity(productId: number): void {
    this.itemsSignal.update(items =>
      items
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  removeFromCart(productId: number): void {
    this.itemsSignal.update(items => items.filter(item => item.product.id !== productId));
  }

  clearCart(): void {
    this.itemsSignal.set([]);
    this.discountPercentage.set(0);
    this.promoCode.set('');
    this.promoMessage.set('');
  }

  applyPromo(code: string): boolean {
    const clean = code.trim().toUpperCase();
    if (clean === 'PULSE10') {
      this.promoCode.set('PULSE10');
      this.discountPercentage.set(10);
      this.promoMessage.set('✓ 10% Enterprise discount applied');
      return true;
    } else if (clean === 'VIP25') {
      this.promoCode.set('VIP25');
      this.discountPercentage.set(25);
      this.promoMessage.set('✓ 25% Executive tier discount applied');
      return true;
    } else {
      this.discountPercentage.set(0);
      this.promoMessage.set('✕ Invalid promo code. Try PULSE10 or VIP25.');
      return false;
    }
  }

  private loadInitialCart(): CartItem[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to sample items
      }
    }
    // Pre-populate with realistic initial items
    return [
      {
        product: {
          id: 101,
          sku: 'HW-DELL-7440',
          name: 'Dell Latitude 7440 Ultrabook',
          category: 'Hardware',
          price: 1450.00,
          inStock: true,
          inventoryCount: 14,
          rating: 4.8,
          imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
          description: 'Enterprise 14-inch laptop with Intel Core Ultra 7.',
          createdAt: '2024-03-12'
        },
        quantity: 1
      },
      {
        product: {
          id: 103,
          sku: 'PR-LOGI-MX3S',
          name: 'Logitech MX Master 3S Wireless Mouse',
          category: 'Peripherals',
          price: 99.99,
          inStock: true,
          inventoryCount: 32,
          rating: 4.9,
          imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
          description: 'Quiet click ergonomic mouse.',
          createdAt: '2024-02-15'
        },
        quantity: 2
      }
    ];
  }
}
