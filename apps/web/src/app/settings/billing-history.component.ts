import { Component, Input } from "@angular/core";

import { PaymentMethodType } from "@bitwarden/common/enums/paymentMethodType";
import { TransactionType } from "@bitwarden/common/enums/transactionType";
import { BillingHistoryResponse } from "@bitwarden/common/models/response/billing-history.response";

@Component({
  selector: "app-billing-history",
  templateUrl: "billing-history.component.html",
})
export class BillingHistoryComponent {
  @Input()
  billing: BillingHistoryResponse;

  paymentMethodType = PaymentMethodType;
  transactionType = TransactionType;

  get invoices() {
    return this.billing != null ? this.billing.invoices : null;
  }

  get transactions() {
    return this.billing != null ? this.billing.transactions : null;
  }

  paymentMethodClasses(type: PaymentMethodType) {
    switch (type) {
      case PaymentMethodType.Card:
        return ["fa-credit-card"];
      case PaymentMethodType.BankAccount:
      case PaymentMethodType.WireTransfer:
        return ["fa-bank"];
      case PaymentMethodType.BitPay:
        return ["fa-bitcoin text-warning"];
      case PaymentMethodType.PayPal:
        return ["fa-paypal text-primary"];
      default:
        return [];
    }
  }
}
