import { Page } from '@playwright/test';

export class CheckoutStepOnePage {
  static readonly url = '/checkout-step-one.html';

  constructor(private readonly page: Page) {}

  readonly title = this.page.getByTestId('title'); // "Checkout: Your Information"
  readonly firstNameInput = this.page.getByTestId('firstName');
  readonly lastNameInput = this.page.getByTestId('lastName');
  readonly postalCodeInput = this.page.getByTestId('postalCode');
  readonly continueButton = this.page.getByTestId('continue');
  readonly cancelButton = this.page.getByTestId('cancel');
  readonly error = this.page.getByTestId('error');

  async goto() {
    await this.page.goto(CheckoutStepOnePage.url);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async completeCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.continueCheckout();
  }
}
