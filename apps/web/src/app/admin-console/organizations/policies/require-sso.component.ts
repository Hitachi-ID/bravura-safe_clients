import { Component } from "@angular/core";

import { PolicyType } from "@bitwarden/common/admin-console/enums";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { PolicyRequest } from "@bitwarden/common/admin-console/models/request/policy.request";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

import { BasePolicy, BasePolicyComponent } from "./base-policy.component";

export class RequireSsoPolicy extends BasePolicy {
  name = "requireSso";
  description = "requireSsoPolicyDesc";
  type = PolicyType.RequireSso;
  component = RequireSsoPolicyComponent;

  display(organization: Organization) {
    return organization.useSso;
  }
}

@Component({
  selector: "policy-require-sso",
  templateUrl: "require-sso.component.html",
})
export class RequireSsoPolicyComponent extends BasePolicyComponent {
  constructor(private i18nService: I18nService) {
    super();
  }

  buildRequest(policiesEnabledMap: Map<PolicyType, boolean>): Promise<PolicyRequest> {
    return super.buildRequest(policiesEnabledMap);
  }
}
