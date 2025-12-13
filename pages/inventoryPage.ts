import { Page } from '@playwright/test';

export class InventoryPage {
  static readonly url = '/inventory.html';

  constructor(private page: Page) {}

  readonly title = this.page.getByTestId('title'); // "Products"

  readonly sortDropdown = this.page.getByTestId('product-sort-container');

  readonly inventoryItems = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory-item-price');

  readonly cartLink = this.page.getByTestId('shopping-cart-link');
  readonly cartBadge = this.page.getByTestId('shopping-cart-badge');

  async goto() {
    await this.page.goto(InventoryPage.url);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption({ value: option });
  }

  async getItemNames(): Promise<string[]> {
    const texts = await this.itemNames.allTextContents();
    return texts.map((t) => t.trim());
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace(/[^0-9.-]/g, '')));
  }

  async addItemToCartByName(name: string) {
    const card = this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').filter({ hasText: name }),
    });
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCartByName(name: string) {
    const card = this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').filter({ hasText: name }),
    });
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  async addItemsToCart(items: string | string[]) {
    const products = Array.isArray(items) ? items : [items];
    for (const item of products) {
      await this.addItemToCartByName(item);
    }
  }

  async removeItemsFromCart(items: string | string[]) {
    const products = Array.isArray(items) ? items : [items];
    for (const item of products) {
      await this.removeItemFromCartByName(item);
    }
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible().catch(() => false))) {
      return 0;
    }
    const text = await this.cartBadge.textContent();
    return text ? Number(text) : 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
