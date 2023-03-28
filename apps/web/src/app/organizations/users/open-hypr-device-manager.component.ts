import { HyprAuthenticationRequestModel } from "@bitwarden/common/vault/models/request/hyprAuthenticationRequestModel";
import { Component } from "@angular/core";

import { ModalRef } from "@bitwarden/angular/components/modal/modal.ref";
import { ModalConfig } from "@bitwarden/angular/services/modal.service";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";

import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";
import { UserVerificationService } from "@bitwarden/common/abstractions/userVerification/userVerification.service.abstraction";
import { Utils } from "@bitwarden/common/misc/utils";
import { Organization } from "@bitwarden/common/models/domain/organization";
import { TwoFactorHyprAuthGetMagicLink } from "@bitwarden/common/auth/models/response/two-factor-hypr-auth-get-magic-link.response";

@Component({
  selector: "app-open-hypr-device-manager",
  templateUrl: "open-hypr-device-manager.component.html",
})
export class OpenHyprDeviceManager {
  organization: Organization;
  userId: string;

  constructor(
    private userVerificationService: UserVerificationService,
    private apiService: ApiService,
    private platformUtilsService: PlatformUtilsService,
    private i18nService: I18nService,
    private cryptoService: CryptoService,
    private syncService: SyncService,
    private logService: LogService,
    private modalRef: ModalRef,
    config: ModalConfig

  ) {
    this.organization = config.data.organization;
    this.userId = config.data.userId;
  }

  async submit() {
    try {
      //await this.formPromise;
      // maybe spinner on ok before closing
      const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
        Signature: null,
        Team: this.organization.id
      };
      const r: TwoFactorHyprAuthGetMagicLink = await this.apiService.postGoToHyprManagement(hyprAuthenticationRequestModel);
      //console.log(r.url);
      this.platformUtilsService.showToast("success", null, this.i18nService.t("twoFactorHyprOpeningDeviceManager"));
      this.modalRef.close();
      setTimeout(function(url){
        window.open(url);
      }, 2*1000, r.url);
    } catch (e) {
      this.logService.error(e);
    }
  }
}
