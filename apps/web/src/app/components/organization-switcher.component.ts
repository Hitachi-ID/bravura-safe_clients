import { Component, Input, OnInit } from "@angular/core";

import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { OrganizationService } from "@bitwarden/common/abstractions/organization.service";
import { BroadcasterService } from "@bitwarden/common/abstractions/broadcaster.service";
import { Utils } from "@bitwarden/common/misc/utils";
import { Organization } from "@bitwarden/common/models/domain/organization";

import { NavigationPermissionsService } from "../organizations/services/navigation-permissions.service";

const BroadcasterSubscriptionId = "OrganizationSwitcherComponent";

@Component({
  selector: "app-organization-switcher",
  templateUrl: "organization-switcher.component.html",
})
export class OrganizationSwitcherComponent implements OnInit {
  constructor(private organizationService: OrganizationService, private i18nService: I18nService, private broadcasterService: BroadcasterService) {}

  @Input() activeOrganization: Organization = null;
  organizations: Organization[] = [];

  loaded = false;

  async ngOnInit() {
    await this.load();

    this.broadcasterService.subscribe(BroadcasterSubscriptionId, (message: any) => {
      switch (message.command) {
        case "organizationUpdated":
          this.load();
          break;
      }
    });
  }

  async load() {
    const orgs = await this.organizationService.getAll();
    this.organizations = orgs
      .filter((org) => NavigationPermissionsService.canAccessAdmin(org))
      .sort(Utils.getSortFunction(this.i18nService, "name"));

    this.loaded = true;
  }
}
