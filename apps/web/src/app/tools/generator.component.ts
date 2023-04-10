import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ModalService } from "@bitwarden/angular/services/modal.service";
import { GeneratorComponent as BaseGeneratorComponent } from "@bitwarden/angular/tools/generator/components/generator.component";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";
import { UsernameGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/username";

import { PasswordGeneratorHistoryComponent } from "./password-generator-history.component";

@Component({
  selector: "app-generator",
  templateUrl: "generator.component.html",
})
export class GeneratorComponent extends BaseGeneratorComponent {
  @ViewChild("historyTemplate", { read: ViewContainerRef, static: true })
  historyModalRef: ViewContainerRef;

  constructor(
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    usernameGenerationService: UsernameGenerationServiceAbstraction,
    stateService: StateService,
    platformUtilsService: PlatformUtilsService,
    i18nService: I18nService,
    logService: LogService,
    route: ActivatedRoute,
    private modalService: ModalService
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
    await this.modalService.openViewRef(PasswordGeneratorHistoryComponent, this.historyModalRef);
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
