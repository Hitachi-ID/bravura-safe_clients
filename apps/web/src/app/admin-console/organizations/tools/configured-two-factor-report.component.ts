import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { StateService } from "@bitwarden/common/platform/abstractions/state.service";
import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { TwoFactorProviderType } from "@bitwarden/common/auth/enums/two-factor-provider-type";
import { OrganizationUserService } from "@bitwarden/common/abstractions/organization-user/organization-user.service";
import { OrganizationUserStatusType } from "@bitwarden/common/admin-console/enums";
import { OrganizationUserUserDetailsResponse } from "@bitwarden/common/abstractions/organization-user/responses";

// eslint-disable-next-line no-restricted-imports
import { ConfiguredTwoFactorReportComponent as BaseConfiguredTwoFactorReportComponent } from "../../../reports/pages/configured-two-factor-report.component";

@Component({
  selector: "app-configured-two-factor-report",
  templateUrl: "./configured-two-factor-report.component.html",
})

// eslint-disable-next-line rxjs-angular/prefer-takeuntil
export class ConfiguredTwoFactorReportComponent extends BaseConfiguredTwoFactorReportComponent {
  usersDetails: OrganizationUserUserDetailsResponse[] = [];
  users: any[] = [];

  constructor(
    auditService: AuditService,
    stateService: StateService,
    private route: ActivatedRoute,
    apiService: ApiService,
    private organizationService: OrganizationService,
    private organizationUserService: OrganizationUserService
  ) {
    super(auditService, stateService, apiService);
  }

  async ngOnInit() {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil, rxjs/no-async-subscribe
    this.route.parent.parent.params.subscribe(async (params) => {
      this.organizationId = params.organizationId;
      this.organization = await this.organizationService.get(params.organizationId);

      const userPromise = await this.organizationUserService.getAllUsers(this.organizationId, {
        includeProviders: true,
      });
      var allUsers = userPromise.data != null && userPromise.data.length>0 ? userPromise.data : [];
      this.usersDetails = allUsers.filter((u) => u.status === OrganizationUserStatusType.Confirmed);
      this.usersDetails.sort((a: any, b: any) => a.twoFactorEnabled - b.twoFactorEnabled);

      await super.ngOnInit();
    });
  }

  async load() {
    this.loading = true;

    this.getProvidersToDisplay();
    await this.getUnconfiguredUsersCount();

    this.loading = false;
    this.hasLoaded = true;
  }

  async getUnconfiguredUsersCount() {
    this.unconfiguredUsersTotal = 0;
    let userProviders: any[] = [];
    this.usersDetails.forEach((u) => {
      userProviders = [];
      if( !u.twoFactorEnabled ){
        ++this.unconfiguredUsersTotal;
      }
      else{
        for(let key in u.twoFactorProvidersEnabled) {
          this.providers.forEach((p2) => {
            if (key === TwoFactorProviderType[p2.type]) {
              userProviders.push({
                type: p2.type,
                name: p2.name,
                sort: p2.sort
              });
            }
          });
        }
      }

      userProviders.sort((a: any, b: any) => a.sort - b.sort);

      this.users.push({
        name: u.name,
        email: u.email,
        providers: userProviders,
      });
    });
  }
}
