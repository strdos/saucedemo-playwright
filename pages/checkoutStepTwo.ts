import { Page } from '@playwright/test';

export class CheckoutStepTwoPage {
  static readonly url = '/checkout-step-two.html';

  constructor(private readonly page: Page) {}

  readonly title = this.page.getByTestId('title'); // "Checkout: Overview"

  readonly cartItems = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory-item-price');

  readonly paymentInfo = this.page.getByTestId('payment-info-value');
  readonly shippingInfo = this.page.getByTestId('shipping-info-value');
  readonly subtotal = this.page.getByTestId('subtotal-label');
  readonly tax = this.page.getByTestId('tax-label');
  readonly total = this.page.getByTestId('total-label');

  readonly finishButton = this.page.getByTestId('finish');
  readonly cancelButton = this.page.getByTestId('cancel');

  async goto() {
    await this.page.goto(CheckoutStepTwoPage.url);
  }

  async getItemNames(): Promise<string[]> {
    const texts = await this.itemNames.allTextContents();
    return texts.map((t) => t.trim());
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace(/[^0-9.-]/g, '')));
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotal.textContent();
    return Number(text?.replace(/[^0-9.-]/g, ''));
  }

  async getTax(): Promise<number> {
    const text = await this.tax.textContent();
    return Number(text?.replace(/[^0-9.-]/g, ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.total.textContent();
    return Number(text?.replace(/[^0-9.-]/g, ''));
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
