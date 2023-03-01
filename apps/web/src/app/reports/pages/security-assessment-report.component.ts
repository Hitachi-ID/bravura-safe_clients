import { Component, OnInit, ViewChild } from "@angular/core";
import { Buffer } from 'buffer';

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { ModalService } from "@bitwarden/angular/services/modal.service";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { CipherService } from "@bitwarden/common/abstractions/cipher.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PasswordRepromptService } from "@bitwarden/common/abstractions/passwordReprompt.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { CipherView } from "@bitwarden/common/models/view/cipher.view";
import { PasswordGenerationService } from "@bitwarden/common/abstractions/passwordGeneration.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { FileDownloadService } from "@bitwarden/common/abstractions/fileDownload/fileDownload.service";
import { NgxCaptureService } from 'ngx-capture';
import { SyncService } from "@bitwarden/common/abstractions/sync/sync.service.abstraction";
import { Icons } from "@bitwarden/components";

import { ExposedPasswordsReportComponent } from "./exposed-passwords-report.component";
import { ReusedPasswordsReportComponent } from "./reused-passwords-report.component";
import { WeakPasswordsReportComponent } from "./weak-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./unsecured-websites-report.component";
import { InactiveTwoFactorReportComponent } from "./inactive-two-factor-report.component";

@Component({
  selector: "app-security-assessment-report",
  templateUrl: "security-assessment-report.component.html",
})

export class SecurityAssessmentReportComponent implements OnInit {
  protected exposedPasswords: ExposedPasswordsReportComponent;
  protected exposedPasswordsCiphers: CipherView[] = [];
  protected exposedPasswordsLoaded = false;
  protected reusedPasswords: ReusedPasswordsReportComponent;
  protected reusedPasswordsCiphers: CipherView[] = [];
  protected reusedPasswordsLoaded = false;
  protected weakPasswords: WeakPasswordsReportComponent;
  protected weakPasswordsCiphers: CipherView[] = [];
  protected weakPasswordsLoaded = false;
  protected unsecuredWebsites: UnsecuredWebsitesReportComponent;
  protected unsecuredWebsitesCiphers: CipherView[] = [];
  protected unsecuredWebsitesLoaded = false;
  protected inactiveTwoFactor: InactiveTwoFactorReportComponent;
  protected inactiveTwoFactorCiphers: CipherView[] = [];
  protected inactiveTwoFactorLoaded = false;
  protected pageLoaded = false;
  protected executionDate: Date;
  protected userEmail = "";
  protected organizationName = "";
  protected ciphersSize = 0;
  protected noItemIcon = Icons.Search;

  @ViewChild('reportResults', { static: true }) screen: any;

  constructor(
    protected apiService: ApiService,
    protected cipherService: CipherService,
    protected auditService: AuditService,
    protected modalService: ModalService,
    protected messagingService: MessagingService,
    protected stateService: StateService,
    protected passwordRepromptService: PasswordRepromptService,
    protected passwordGenerationService: PasswordGenerationService,
    protected logService: LogService,
    protected fileDownloadService: FileDownloadService,
    protected captureService: NgxCaptureService,
    protected syncService: SyncService
  ) {
    this.exposedPasswords = new ExposedPasswordsReportComponent(cipherService, auditService, modalService, messagingService, stateService, passwordRepromptService);
    this.reusedPasswords = new ReusedPasswordsReportComponent(cipherService, modalService, messagingService, stateService, passwordRepromptService);
    this.weakPasswords = new WeakPasswordsReportComponent(cipherService, passwordGenerationService, modalService, messagingService, stateService, passwordRepromptService);
    this.unsecuredWebsites = new UnsecuredWebsitesReportComponent(cipherService, modalService, messagingService, stateService, passwordRepromptService);
    this.inactiveTwoFactor = new InactiveTwoFactorReportComponent(cipherService, modalService, messagingService, stateService, logService, passwordRepromptService);
  }

  async ngOnInit() {
    await this.syncService.fullSync(false);
    await this.getCiphersSize();
    if (this.ciphersSize > 0) {
      await Promise.all([ this.loadExposedPasswords(), this.loadReusedPasswords(), this.loadWeakPasswords(), this.loadUnsecuredWebsites(), this.loadInactiveTwoFactor() ]);
      this.executionDate = new Date();

      const profile = await this.apiService.getProfile();
      this.userEmail = profile.email;
    }
    this.pageLoaded = true;
  }

  async getCiphersSize() {
    const ciphers = await this.cipherService.getAllDecrypted();
    this.ciphersSize = ciphers.length;
  }

  async loadExposedPasswords() {
    await this.exposedPasswords.load();
    await this.exposedPasswords.setCiphers();
    this.exposedPasswordsCiphers = this.exposedPasswords.ciphers;
    this.exposedPasswordsLoaded = true;
  }

  async loadReusedPasswords() {
    await this.reusedPasswords.load();
    this.reusedPasswordsCiphers = this.reusedPasswords.ciphers;
    this.reusedPasswordsLoaded = true;
  }

  async loadWeakPasswords() {
    await this.weakPasswords.load();
    this.weakPasswordsCiphers = this.weakPasswords.ciphers;
    this.weakPasswordsLoaded = true;
  }

  async loadUnsecuredWebsites() {
    await this.unsecuredWebsites.load();
    this.unsecuredWebsitesCiphers = this.unsecuredWebsites.ciphers;
    this.unsecuredWebsitesLoaded = true;
  }

  async loadInactiveTwoFactor() {
    await this.inactiveTwoFactor.load();
    this.inactiveTwoFactorCiphers = this.inactiveTwoFactor.ciphers;
    this.inactiveTwoFactorLoaded = true;
  }

  async downloadAssessment() {
    this.captureService.getImage(this.screen.nativeElement, true).toPromise().then(pngImage=>{
      var data = pngImage.replace(/^data:image\/\w+;base64,/, "");
      var buffer = Buffer.from(data, 'base64');
      var fileName = 'security_assessment_' + this.executionDate.getTime().toString() + '.png';
      this.fileDownloadService.download({
        fileName: fileName,
        blobData: buffer,
        blobOptions: { type: "image/png" },
      });
    });
  }
}
