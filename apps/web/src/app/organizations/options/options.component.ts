import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { OrganizationService } from "@bitwarden/common/abstractions/organization/organization.service.abstraction";

@Component({
  selector: "app-org-options",
  templateUrl: "options.component.html",
})
export class OptionsComponent {
  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(async (params) => {
      const organization = await this.organizationService.get(params.organizationId);
    });
  }
}
