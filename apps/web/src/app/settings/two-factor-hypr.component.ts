import { Component } from "@angular/core";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { UserVerificationService } from "@bitwarden/common/abstractions/userVerification.service";
import { TwoFactorProviderType } from "@bitwarden/common/enums/twoFactorProviderType";
import { UpdateTwoFactorHyprRequest } from "@bitwarden/common/models/request/updateTwoFactorHyprRequest";
import { TwoFactorHyprResponse } from "@bitwarden/common/models/response/twoFactorHyprResponse";

import { TwoFactorBaseComponent } from "./two-factor-base.component";

@Component({
  selector: "app-two-factor-hypr",
  templateUrl: "two-factor-hypr.component.html",
})
export class TwoFactorHyprComponent extends TwoFactorBaseComponent {
  type = TwoFactorProviderType.OrganizationHypr;
  akey: string;
  serverUrl: string;
  formPromise: Promise<any>;

  constructor(
    apiService: ApiService,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    logService: LogService,
    userVerificationService: UserVerificationService
  ) {
    super(apiService, i18nService, platformUtilsService, logService, userVerificationService);
  }

  auth(authResponse: any) {
    super.auth(authResponse);
    this.processResponse(authResponse.response);
  }

  submit() {
    if (this.enabled) {
      return super.disable(this.formPromise);
    } else {
      return this.enable();
    }
  }

  protected async enable() {
    const request = await this.buildRequestModel(UpdateTwoFactorHyprRequest);
    request.apiKey = this.akey;
    request.serverUrl = this.serverUrl;

    return super.enable(async () => {
      if (this.organizationId != null) {
        this.formPromise = this.apiService.putTwoFactorOrganizationHypr(
          this.organizationId,
          request
        );
      }
      const response = await this.formPromise;
      await this.processResponse(response);
    });
  }

  private processResponse(response: TwoFactorHyprResponse) {
    this.akey = response.apiKey;
    this.serverUrl = response.serverUrl;
    this.enabled = response.enabled;
  }
}
