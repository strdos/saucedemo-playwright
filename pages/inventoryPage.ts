import { Page } from '@playwright/test';

export class InventoryPage {
  static readonly url = '/inventory.html';

  constructor(private page: Page) {}

  readonly title = this.page.getByTestId('title'); // "Products"

  readonly inventoryItems = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory-item-price');

  async goto() {
    await this.page.goto(InventoryPage.url);
  }
}
