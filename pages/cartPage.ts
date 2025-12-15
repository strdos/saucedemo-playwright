import { Page } from '@playwright/test';

export class CartPage {
  static readonly url = '/cart.html';

  constructor(private readonly page: Page) {}

  readonly title = this.page.getByTestId('title'); // "Your Cart"

  readonly itemCount = this.page.getByTestId('item-quantity');

  readonly cartItems = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory_item_price');

  readonly removeButton = this.page.getByRole('button', { name: 'Remove' });

  readonly continueShoppingButton = this.page.getByTestId('continue-shopping');
  readonly checkoutButton = this.page.getByTestId('checkout');

  async goto() {
    await this.page.goto(CartPage.url);
  }

  async getItemNames(): Promise<string[]> {
    const texts = await this.itemNames.allTextContents();
    return texts.map((t) => t.trim());
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace(/[^0-9.-]/g, '')));
  }
}
