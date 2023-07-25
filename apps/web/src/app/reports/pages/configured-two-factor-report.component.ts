import { Component, OnInit } from "@angular/core";

import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { StateService } from "@bitwarden/common/platform/abstractions/state.service";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { TwoFactorProviders } from "@bitwarden/common/auth/services/two-factor.service";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { TwoFactorProviderType } from "@bitwarden/common/auth/enums/two-factor-provider-type";

@Component({
  selector: "app-configured-two-factor-report",
  templateUrl: "configured-two-factor-report.component.html",
})

export class ConfiguredTwoFactorReportComponent implements OnInit {
  loading = false;
  hasLoaded = false;
  providers: any[] = [];
  organization: Organization;
  organizationId: string;
  configuredProvidersTotal: number = 0;
  unconfiguredUsersTotal: number = 0;

  constructor(
    private auditService: AuditService,
    private stateService: StateService,
    protected apiService: ApiService
  ) {}

  async load() {
    this.loading = true;

    this.getProvidersToDisplay();
    await this.getUserProviders();

    this.loading = false;
    this.hasLoaded = true;
  }

  getProvidersToDisplay() {
    // Get providers applicable to a user (non-org)
    for (const key in TwoFactorProviders) {
      // eslint-disable-next-line
      if (!TwoFactorProviders.hasOwnProperty(key)) {
        continue;
      }

      const p = (TwoFactorProviders as any)[key];
      if (this.filterProvider(p.type)) {
        continue;
      }

      // Show [Authenticator, Email]
      if (p.type === TwoFactorProviderType.Authenticator ||
          p.type === TwoFactorProviderType.Email) {
        this.providers.push({
          type: p.type,
          name: p.name,
          description: p.description,
          enabled: false,
          premium: p.premium,
          sort: p.sort,
        });
      }
    }

    this.providers.sort((a: any, b: any) => a.sort - b.sort);
  }

  async getUserProviders() {
    const providerList = await this.getTwoFactorProviders();
    providerList.data.forEach((p) => {
      this.providers.forEach((p2) => {
        if (p.type === p2.type) {
          p2.enabled = p.enabled;
          ++this.configuredProvidersTotal;
        }
      });
    });
  }

  async ngOnInit() {
      await this.load();
    }

  protected filterProvider(type: TwoFactorProviderType) {
    return type === TwoFactorProviderType.OrganizationDuo || type === TwoFactorProviderType.OrganizationHypr;
  }

  protected getTwoFactorProviders() {
    return this.apiService.getTwoFactorProviders();
  }
}
