import { Page, Locator } from '@playwright/test';

export class Header {
  constructor(private readonly page: Page) {}

  readonly logo: Locator = this.page.locator('.app_logo');
  readonly cartIcon: Locator = this.page.getByTestId('shopping-cart-link');

  readonly openMenuButton: Locator = this.page.getByRole('button', { name: 'Open Menu' });
  readonly closeMenuButton: Locator = this.page.getByRole('button', { name: 'Close Menu' });

  readonly allItemsLink: Locator = this.page.getByTestId('inventory-sidebar-link');
  readonly aboutLink: Locator = this.page.getByTestId('about-sidebar-link');
  readonly logoutLink: Locator = this.page.getByTestId('logout-sidebar-link');
  readonly resetAppStateLink: Locator = this.page.getByTestId('reset-sidebar-link');

  async openMenu() {
    await this.openMenuButton.click();
  }

  async closeMenu() {
    await this.closeMenuButton.click();
  }

  async clickCart() {
    await this.cartIcon.click();
  }
}
