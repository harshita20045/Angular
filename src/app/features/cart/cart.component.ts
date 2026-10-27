import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule],
  template: `
    <div class="cart-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Procurement Order &amp; Staging</h1>
          <p class="page-subtitle">Review staged equipment orders, apply enterprise discounts, and submit requisition orders.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/products" class="btn btn-secondary">
            ← Continue Procurement
          </a>
        </div>
      </header>

      @if (checkoutSuccess()) {
        <div class="checkout-alert">
          <div class="alert-icon">✓</div>
          <div>
            <strong>Requisition Order #REQ-92841 Submitted Successfully!</strong>
            <p>Your hardware and software allocations have been approved and forwarded to finance for automated routing.</p>
          </div>
          <button type="button" class="btn btn-sm btn-secondary" (click)="checkoutSuccess.set(false)">Dismiss</button>
        </div>
      }

      @if (cartService.items().length > 0) {
        <div class="cart-layout">
          <!-- Left: Items Table / List -->
          <div class="cart-items-panel">
            <div class="panel-header">
              <h2>Staged Line Items ({{ cartService.totalItemsCount() }} items)</h2>
              <button type="button" class="clear-btn" (click)="cartService.clearCart()">
                Clear All
              </button>
            </div>

            <div class="items-list">
              @for (item of cartService.items(); track item.product.id) {
                <div class="cart-item-row">
                  <img [src]="item.product.imageUrl" [alt]="item.product.name" class="item-thumb" />

                  <div class="item-info">
                    <div class="item-name">{{ item.product.name }}</div>
                    <div class="item-sku">SKU: {{ item.product.sku }} • {{ item.product.category }}</div>
                    <div class="item-unit-price">{{ item.product.price | currency:'USD' }} each</div>
                  </div>

                  <!-- Quantity Controls (Signals update()) -->
                  <div class="qty-controller">
                    <button
                      type="button"
                      class="qty-btn"
                      title="Decrease quantity"
                      (click)="cartService.decrementQuantity(item.product.id)">
                      −
                    </button>
                    <span class="qty-num">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="qty-btn"
                      title="Increase quantity"
                      (click)="cartService.incrementQuantity(item.product.id)">
                      +
                    </button>
                  </div>

                  <!-- Line Total -->
                  <div class="item-line-total">
                    {{ (item.product.price * item.quantity) | currency:'USD' }}
                  </div>

                  <!-- Remove Action -->
                  <button
                    type="button"
                    class="remove-btn"
                    title="Remove item from order"
                    (click)="cartService.removeFromCart(item.product.id)">
                    ✕
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Right: Order Summary with Computed Signal Totals -->
          <div class="order-summary-panel">
            <h2 class="summary-title">Requisition Summary</h2>

            <div class="summary-breakdown">
              <div class="breakdown-row">
                <span class="label">Staged Subtotal:</span>
                <span class="val">{{ cartService.subtotal() | currency:'USD' }}</span>
              </div>

              @if (cartService.discountAmount() > 0) {
                <div class="breakdown-row discount-row">
                  <span class="label">Corporate Discount ({{ cartService.discountPercentage() }}%):</span>
                  <span class="val">−{{ cartService.discountAmount() | currency:'USD' }}</span>
                </div>
              }

              <div class="breakdown-row">
                <span class="label">Sales Tax (8.25%):</span>
                <span class="val">{{ cartService.estimatedTax() | currency:'USD' }}</span>
              </div>

              <div class="breakdown-row total-row">
                <span class="label">Estimated Total:</span>
                <span class="val highlight">{{ cartService.finalTotal() | currency:'USD' }}</span>
              </div>
            </div>

            <!-- Promo Code Input -->
            <div class="promo-box">
              <label class="form-label">Enterprise Voucher / Promo Code:</label>
              <div class="promo-input-group">
                <input
                  type="text"
                  class="form-input"
                  placeholder="e.g. PULSE10 or VIP25"
                  [(ngModel)]="promoInput"
                  (keyup.enter)="applyPromoCode()"
                />
                <button type="button" class="btn btn-secondary" (click)="applyPromoCode()">Apply</button>
              </div>
              @if (cartService.promoMessage()) {
                <div class="promo-feedback" [class.success]="cartService.discountPercentage() > 0">
                  {{ cartService.promoMessage() }}
                </div>
              }
            </div>

            <button type="button" class="btn btn-primary submit-order-btn" (click)="submitOrder()">
              Authorize Requisition Order ({{ cartService.finalTotal() | currency:'USD' }})
            </button>
            <p class="summary-disclaimer">
              Pre-approved under departmental cost center #CC-4091. Automatic ledger recording initiated.
            </p>
          </div>
        </div>
      } @else if (!checkoutSuccess()) {
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <h2>Your Requisition Order is Empty</h2>
          <p>No equipment or software licenses have been staged for purchase yet.</p>
          <a routerLink="/products" class="btn btn-primary">Browse Equipment Catalog</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
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

    .checkout-alert {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      color: #d1fae5;
    }
    .alert-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #10b981;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      flex-shrink: 0;
    }
    .checkout-alert p {
      font-size: 0.85rem;
      color: #a7f3d0;
      margin: 0.2rem 0 0 0;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      gap: 2rem;
      align-items: flex-start;
    }
    @media (max-width: 960px) {
      .cart-layout { grid-template-columns: 1fr; }
    }

    .cart-items-panel, .order-summary-panel {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 1.5rem;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #1f2937;
    }
    .panel-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0;
    }
    .clear-btn {
      background: none;
      border: none;
      color: #f43f5e;
      font-size: 0.82rem;
      cursor: pointer;
    }
    .clear-btn:hover { text-decoration: underline; }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .cart-item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 1rem;
    }
    .item-thumb {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }
    .item-info {
      flex: 1;
      min-width: 0;
    }
    .item-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-sku {
      font-size: 0.72rem;
      color: #64748b;
      font-family: var(--font-mono);
      margin: 0.15rem 0;
    }
    .item-unit-price {
      font-size: 0.82rem;
      color: #94a3b8;
    }

    .qty-controller {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #111827;
      border: 1px solid #374151;
      border-radius: 6px;
      padding: 0.2rem;
    }
    .qty-btn {
      background: transparent;
      border: none;
      color: #cbd5e1;
      font-size: 1rem;
      width: 26px;
      height: 26px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    .qty-btn:hover { background: #1f2937; color: #fff; }
    .qty-num {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      font-weight: 700;
      color: #f8fafc;
      min-width: 24px;
      text-align: center;
    }

    .item-line-total {
      font-size: 1.05rem;
      font-weight: 800;
      color: #f8fafc;
      font-family: var(--font-mono);
      min-width: 85px;
      text-align: right;
    }
    .remove-btn {
      background: none;
      border: none;
      color: #64748b;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
    }
    .remove-btn:hover { color: #f87171; background: #1f2937; }

    /* Summary */
    .summary-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #1f2937;
    }
    .summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: #94a3b8;
    }
    .breakdown-row .val {
      font-family: var(--font-mono);
      font-weight: 600;
      color: #cbd5e1;
    }
    .discount-row {
      color: #34d399;
    }
    .discount-row .val { color: #34d399; }
    .total-row {
      padding-top: 0.85rem;
      border-top: 1px solid #1f2937;
      font-size: 1.05rem;
      color: #f8fafc;
      font-weight: 700;
    }
    .total-row .val.highlight {
      font-size: 1.4rem;
      font-weight: 800;
      color: #38bdf8;
    }

    .promo-box {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
    }
    .promo-input-group {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.35rem;
    }
    .promo-feedback {
      font-size: 0.75rem;
      color: #f87171;
      margin-top: 0.5rem;
    }
    .promo-feedback.success { color: #34d399; }

    .submit-order-btn {
      width: 100%;
      padding: 0.85rem;
      font-size: 0.95rem;
    }
    .summary-disclaimer {
      font-size: 0.72rem;
      color: #64748b;
      text-align: center;
      margin-top: 0.75rem;
      line-height: 1.4;
    }

    .empty-state {
      background: #111827;
      border: 1px dashed #374151;
      border-radius: 14px;
      padding: 4rem 2rem;
      text-align: center;
      color: #94a3b8;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 0.75rem; }
    .empty-state h2 { color: #f8fafc; margin-bottom: 0.5rem; }
    .empty-state p { margin-bottom: 1.5rem; }
  `]
})
export class CartComponent {
  readonly cartService = inject(CartService);

  promoInput = '';
  checkoutSuccess = signal<boolean>(false);

  applyPromoCode(): void {
    if (this.promoInput) {
      this.cartService.applyPromo(this.promoInput);
    }
  }

  submitOrder(): void {
    this.cartService.clearCart();
    this.checkoutSuccess.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
