import { Component, Input, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";

import {
  canAccessAdmin,
  OrganizationService,
} from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

@Component({
  selector: "app-organization-switcher",
  templateUrl: "organization-switcher.component.html",
})

export class OrganizationSwitcherComponent implements OnInit {
  constructor(private organizationService: OrganizationService, private i18nService: I18nService) {}

  @Input() activeOrganization: Organization = null;
  organizations$: Observable<Organization[]>;

  loaded = false;

  async ngOnInit() {
    this.organizations$ = this.organizationService.memberOrganizations$.pipe(
      map((orgs) => orgs.sort((a, b) => a.name.localeCompare(b.name)))
    );

    this.loaded = true;
  }
}
