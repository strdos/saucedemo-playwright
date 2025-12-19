import { Page } from '@playwright/test';

export class CheckoutCompletePage {
  static readonly url = '/checkout-complete.html';

  constructor(private readonly page: Page) {}

  readonly title = this.page.getByTestId('title'); // "Checkout: Complete!"

  readonly confirmationMessage = this.page.getByTestId('complete-header');

  readonly backHomeButton = this.page.getByTestId('back-to-products');

  async goto() {
    await this.page.goto(CheckoutCompletePage.url);
  }

  async getConfirmationText(): Promise<string> {
    return (await this.confirmationMessage.textContent())?.trim() ?? '';
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
