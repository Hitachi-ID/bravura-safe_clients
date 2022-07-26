import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Organization } from "@bitwarden/common/models/domain/organization";

import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { OrganizationService } from "@bitwarden/common/abstractions/organization.service";

@Component({
  selector: "app-org-reports",
  templateUrl: "reports.component.html",
})
export class ReportsComponent implements OnInit {
  organization: Organization;
  accessReports = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private messagingService: MessagingService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(async (params) => {
      this.organization = await this.organizationService.get(params.organizationId);
      this.accessReports = this.organization.useTotp;
      this.loading = false;
    });
  }
}
