import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { ModalService } from "@bitwarden/angular/services/modal.service";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { CipherService } from "@bitwarden/common/vault/abstractions/cipher.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PasswordRepromptService } from "@bitwarden/common/vault/abstractions/password-reprompt.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { FileDownloadService } from "@bitwarden/common/abstractions/fileDownload/fileDownload.service";
import { NgxCaptureService } from "ngx-capture";
import { OrganizationService } from "@bitwarden/common/abstractions/organization/organization.service.abstraction";
import { OrganizationUserService } from "@bitwarden/common/abstractions/organization-user/organization-user.service";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";

import { SecurityAssessmentReportComponent as BaseSecurityAssessmentReportComponent } from "../../reports/pages/security-assessment-report.component";
import { ExposedPasswordsReportComponent } from "./exposed-passwords-report.component";
import { ReusedPasswordsReportComponent } from "./reused-passwords-report.component";
import { WeakPasswordsReportComponent } from "./weak-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./unsecured-websites-report.component";
import { InactiveTwoFactorReportComponent } from "./inactive-two-factor-report.component";
import { ConfiguredTwoFactorReportComponent } from "./configured-two-factor-report.component";

@Component({
  selector: "app-org-security-assessment-report",
  templateUrl: "../../reports/pages/security-assessment-report.component.html",
})

export class SecurityAssessmentReportComponent extends BaseSecurityAssessmentReportComponent {
  private organizationId: string = "";

  constructor(
    apiService: ApiService,
    cipherService: CipherService,
    auditService: AuditService,
    modalService: ModalService,
    messagingService: MessagingService,
    stateService: StateService,
    private organizationService: OrganizationService,
    private organizationUserService: OrganizationUserService,
    private route: ActivatedRoute,
    passwordRepromptService: PasswordRepromptService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    logService: LogService,
    fileDownloadService: FileDownloadService,
    captureService: NgxCaptureService,
    syncService: SyncService,
  ) {
    super(
      apiService,
      cipherService,
      auditService,
      modalService,
      messagingService,
      stateService,
      passwordRepromptService,
      passwordGenerationService,
      logService,
      fileDownloadService,
      captureService,
      syncService
    );

    this.exposedPasswords = new ExposedPasswordsReportComponent(cipherService, auditService, modalService, messagingService, organizationService, route, passwordRepromptService);
    this.reusedPasswords = new ReusedPasswordsReportComponent(cipherService, modalService, messagingService, stateService, route, organizationService, passwordRepromptService);
    this.weakPasswords = new WeakPasswordsReportComponent(cipherService, passwordGenerationService, modalService, messagingService, route, organizationService, passwordRepromptService);
    this.unsecuredWebsites = new UnsecuredWebsitesReportComponent(cipherService, modalService, messagingService, route, organizationService, passwordRepromptService);
    this.inactiveTwoFactor = new InactiveTwoFactorReportComponent(cipherService, modalService, messagingService, route, logService, passwordRepromptService, organizationService);
    this.configuredTwoFactor = new ConfiguredTwoFactorReportComponent(auditService, stateService, route, apiService, organizationService, organizationUserService);
  }

  async ngOnInit() {
    await this.exposedPasswords.ngOnInit();
    await this.reusedPasswords.ngOnInit();
    await this.weakPasswords.ngOnInit();
    await this.unsecuredWebsites.ngOnInit();
    await this.inactiveTwoFactor.ngOnInit();
    await this.configuredTwoFactor.ngOnInit();

    this.route.parent.parent.params.subscribe(async (params) => {
      this.organizationId = params.organizationId;
      const organization = await this.organizationService.get(this.organizationId);
      this.organizationName = organization.name;
    });

    await super.ngOnInit();
  }

  async getCiphersSize() {
    const ciphers = await this.cipherService.getAllFromApiForOrganization(this.organizationId);
    this.ciphersSize = ciphers.length;
  }

  async loadConfiguredTwoFactor() {
    await this.configuredTwoFactor.load();
    this.highlightedItemsTotal = this.configuredTwoFactor.unconfiguredUsersTotal;
    this.configuredTwoFactorLoaded = true;
  }
}
