import { Component } from "@angular/core";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { UserVerificationService } from "@bitwarden/common/abstractions/userVerification/userVerification.service.abstraction";
import { TwoFactorProviderType } from "@bitwarden/common/enums/twoFactorProviderType";
import { UpdateTwoFactorHyprRequest } from "@bitwarden/common/models/request/update-two-factor-hypr.request";
import { TwoFactorHyprResponse } from "@bitwarden/common/models/response/two-factor-hypr.response";
import { AuthResponse } from "@bitwarden/common/types/authResponse";

import { TwoFactorBaseComponent } from "./two-factor-base.component";

@Component({
  selector: "app-two-factor-hypr",
  templateUrl: "two-factor-hypr.component.html",
})
export class TwoFactorHyprComponent extends TwoFactorBaseComponent {
  type = TwoFactorProviderType.OrganizationHypr;
  akey: string;
  appId: string;
  serverUrl: string;
  hyprMagicLinkDuration: number;
  formPromise: Promise<TwoFactorHyprResponse>;

  constructor(
    apiService: ApiService,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    logService: LogService,
    userVerificationService: UserVerificationService
  ) {
    super(apiService, i18nService, platformUtilsService, logService, userVerificationService);
  }

  auth(authResponse: AuthResponse<TwoFactorHyprResponse>) {
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
    request.appId = this.appId;
    request.serverUrl = this.serverUrl;
    request.hyprMagicLinkDuration = this.hyprMagicLinkDuration;

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
    this.appId = response.appId;
    this.serverUrl = response.serverUrl;
    let hyprMagicLinkDuration = response.hyprMagicLinkDuration;
    this.hyprMagicLinkDuration = hyprMagicLinkDuration ? hyprMagicLinkDuration : 900;
    this.enabled = response.enabled;
  }
}
