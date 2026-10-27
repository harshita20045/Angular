import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductCategory } from '../../core/models';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, ModalComponent],
  template: `
    <div class="products-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Enterprise Equipment &amp; Software</h1>
          <p class="page-subtitle">Provision hardware, software licenses, and cloud capacity for development teams.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-primary" (click)="openAddModal()">
            <span>+</span> Add Product
          </button>
        </div>
      </header>

      <!-- Search & Filters Toolbar -->
      <section class="toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="form-input search-input"
            placeholder="Search products by title or SKU..."
            [ngModel]="searchFilter()"
            (ngModelChange)="searchFilter.set($event)"
          />
        </div>

        <div class="category-filters">
          @for (cat of categories; track cat) {
            <button
              type="button"
              class="cat-chip"
              [class.active]="selectedCategory() === cat"
              (click)="selectedCategory.set(cat)">
              {{ cat }}
            </button>
          }
        </div>
      </section>

      <!-- Products Grid -->
      <div class="catalog-grid">
        @for (product of filteredProducts(); track product.id) {
          <div class="product-card" [class.out-of-stock]="!product.inStock">
            <div class="image-wrap">
              <img [src]="product.imageUrl" [alt]="product.name" class="product-img" />
              <div class="category-badge">
                @switch (product.category) {
                  @case ('Hardware') { <span class="badge badge-purple">Hardware</span> }
                  @case ('Software') { <span class="badge badge-blue">Software</span> }
                  @case ('Cloud Services') { <span class="badge badge-cyan">Cloud</span> }
                  @default { <span class="badge badge-amber">{{ product.category }}</span> }
                }
              </div>
            </div>

            <div class="card-content">
              <div class="sku-row">
                <span class="sku-code">{{ product.sku }}</span>
                <span class="rating">⭐ {{ product.rating }}</span>
              </div>

              <h3 class="product-title">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>

              <div class="stock-status">
                @if (product.inStock) {
                  <span class="in-stock-pill">
                    <span class="dot"></span>
                    {{ product.inventoryCount }} units available
                  </span>
                } @else {
                  <span class="out-stock-pill">
                    <span class="dot"></span>
                    Out of stock • Backorder
                  </span>
                }
              </div>

              <div class="card-footer">
                <div class="price-box">
                  <span class="price-val">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
                  <span class="price-tax">excl. tax</span>
                </div>

                <div class="action-buttons">
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    [disabled]="!product.inStock"
                    (click)="addToCart(product)">
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-secondary delete-btn"
                    title="Remove product from catalog"
                    (click)="productService.removeProduct(product.id)">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Try searching for a different item or select another category filter.</p>
            <button class="btn btn-secondary" (click)="resetFilters()">Clear Filters</button>
          </div>
        }
      </div>

      <!-- Add Product Modal Dialog (Content Projection) -->
      <app-modal [isOpen]="isModalOpen" (close)="isModalOpen = false">
        <div modal-title>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #f8fafc; margin: 0">Provision New Catalog Product</h2>
        </div>

        <div modal-body>
          <form (ngSubmit)="saveProduct()">
            <div class="form-group">
              <label class="form-label">Product Name:</label>
              <input class="form-input" [(ngModel)]="newProduct.name" name="name" required placeholder="e.g. UltraWide Curved Monitor" />
            </div>

            <div class="form-group">
              <label class="form-label">SKU Identifier:</label>
              <input class="form-input" [(ngModel)]="newProduct.sku" name="sku" required placeholder="e.g. HW-MON-34C" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
              <div class="form-group">
                <label class="form-label">Category:</label>
                <select class="form-select" [(ngModel)]="newProduct.category" name="category">
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Cloud Services">Cloud Services</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Unit Price ($):</label>
                <input class="form-input" type="number" step="0.01" [(ngModel)]="newProduct.price" name="price" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Image URL:</label>
              <input class="form-input" [(ngModel)]="newProduct.imageUrl" name="imageUrl" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label class="form-label">Product Description:</label>
              <textarea class="form-textarea" rows="2" [(ngModel)]="newProduct.description" name="description"></textarea>
            </div>
          </form>
        </div>

        <div modal-footer>
          <button type="button" class="btn btn-secondary" (click)="isModalOpen = false">Cancel</button>
          <button type="button" class="btn btn-primary" (click)="saveProduct()">Save Product</button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .products-container {
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

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
      flex-wrap: wrap;
    }
    .search-box {
      position: relative;
      flex: 1;
      max-width: 360px;
      min-width: 250px;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 0.9rem;
    }
    .search-input {
      padding-left: 2.3rem;
    }

    .category-filters {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .cat-chip {
      background: #111827;
      border: 1px solid #1f2937;
      color: #94a3b8;
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .cat-chip:hover {
      background: #1f2937;
      color: #f1f5f9;
    }
    .cat-chip.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
    }

    /* Catalog Grid */
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    @media (max-width: 1024px) {
      .catalog-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .catalog-grid { grid-template-columns: 1fr; }
    }

    .product-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .product-card:hover {
      transform: translateY(-3px);
      border-color: #374151;
      box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.4);
    }
    .product-card.out-of-stock {
      opacity: 0.75;
    }

    .image-wrap {
      position: relative;
      height: 180px;
      background: #090e1a;
      overflow: hidden;
    }
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .product-card:hover .product-img {
      transform: scale(1.04);
    }
    .category-badge {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
    }
    .badge-cyan { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }

    .card-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .sku-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }
    .sku-code {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: #64748b;
    }
    .rating {
      font-size: 0.78rem;
      color: #fbbf24;
    }
    .product-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.4rem;
    }
    .product-desc {
      font-size: 0.82rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 0.85rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .stock-status {
      margin-bottom: 1rem;
    }
    .in-stock-pill, .out-stock-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .in-stock-pill { color: #34d399; }
    .out-stock-pill { color: #f87171; }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 0.85rem;
      border-top: 1px solid #1f2937;
    }
    .price-box {
      display: flex;
      flex-direction: column;
    }
    .price-val {
      font-size: 1.2rem;
      font-weight: 800;
      color: #f8fafc;
      font-family: var(--font-mono);
    }
    .price-tax {
      font-size: 0.68rem;
      color: #64748b;
    }
    .action-buttons {
      display: flex;
      gap: 0.4rem;
    }
    .delete-btn {
      color: #64748b;
    }
    .delete-btn:hover {
      color: #f87171;
    }

    .empty-state {
      grid-column: 1 / -1;
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
export class ProductsComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  readonly categories = ['ALL', 'Hardware', 'Software', 'Peripherals', 'Cloud Services'];
  selectedCategory = signal<string>('ALL');
  searchFilter = signal<string>('');

  isModalOpen = false;
  newProduct = {
    name: '',
    sku: '',
    category: 'Hardware' as ProductCategory,
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    description: 'High performance enterprise peripheral equipment.',
    inStock: true,
    inventoryCount: 15,
    rating: 4.8
  };

  filteredProducts = computed(() => {
    const list = this.productService.products();
    const cat = this.selectedCategory();
    const query = this.searchFilter().toLowerCase().trim();

    return list.filter(item => {
      const matchCat = cat === 'ALL' || item.category === cat;
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchCat && matchQuery;
    });
  });

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  openAddModal(): void {
    this.isModalOpen = true;
  }

  saveProduct(): void {
    if (!this.newProduct.name || !this.newProduct.sku) return;
    this.productService.addProduct({
      ...this.newProduct
    });
    this.isModalOpen = false;
    this.newProduct.name = '';
    this.newProduct.sku = '';
  }

  resetFilters(): void {
    this.selectedCategory.set('ALL');
    this.searchFilter.set('');
  }
}
