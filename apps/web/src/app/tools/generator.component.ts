import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";
import { GeneratorComponent as BaseGeneratorComponent } from "@bitwarden/angular/tools/generator/components/generator.component";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";
import { StateService } from "@bitwarden/common/platform/abstractions/state.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";
import { UsernameGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/username";

import { PasswordGeneratorHistoryComponent } from "./password-generator-history.component";

@Component({
  selector: "app-generator",
  templateUrl: "generator.component.html",
})
export class GeneratorComponent extends BaseGeneratorComponent {
  constructor(
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    usernameGenerationService: UsernameGenerationServiceAbstraction,
    stateService: StateService,
    platformUtilsService: PlatformUtilsService,
    i18nService: I18nService,
    logService: LogService,
    route: ActivatedRoute,
    private dialogService: DialogServiceAbstraction
  ) {
    super(
      passwordGenerationService,
      usernameGenerationService,
      platformUtilsService,
      stateService,
      i18nService,
      logService,
      route,
      window
    );
    if (platformUtilsService.isSelfHost()) {
      // Allow only valid email forwarders for self host
      this.forwardOptions = this.forwardOptions.filter((forwarder) => forwarder.validForSelfHosted);
    }
  }

  async history() {
    this.dialogService.open(PasswordGeneratorHistoryComponent);
  }

  lengthChanged() {
    document.getElementById("length").focus();
  }

  minNumberChanged() {
    document.getElementById("min-number").focus();
  }

  minSpecialChanged() {
    document.getElementById("min-special").focus();
  }

  preRegenerate(){
    if((document.getElementById("usernameType_subaddress") as HTMLInputElement).checked){
      let email = (document.getElementById("subaddress-email") as HTMLInputElement).value;
      if(email===null || email===""){
        this.platformUtilsService.showToast("error", null, this.i18nService.t("emailRequired"));
        return;
      }
    }
    if((document.getElementById("usernameType_catchall") as HTMLInputElement).checked){
      let domain = (document.getElementById("catchall-domain") as HTMLInputElement).value;
      if(domain===null || domain===""){
        this.platformUtilsService.showToast("error", null, this.i18nService.t("domainNameRequired"));
        return;
      }
    }

    this.regenerate();
  }
}
