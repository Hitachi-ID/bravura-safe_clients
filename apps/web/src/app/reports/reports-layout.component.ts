import { Component, OnInit } from "@angular/core";

import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";

@Component({
  selector: "app-reports-layout",
  templateUrl: "reports-layout.component.html",
})
export class ReportsLayoutComponent implements OnInit {
  canAccessPremium = false;

  constructor(private stateService: StateService, private messagingService: MessagingService) {}

  async ngOnInit() {
    this.canAccessPremium = await this.stateService.getCanAccessPremium();
  }

  premiumRequired() {
    if (!this.canAccessPremium) {
      this.messagingService.send("premiumRequired");
      return;
    }
  }
}
