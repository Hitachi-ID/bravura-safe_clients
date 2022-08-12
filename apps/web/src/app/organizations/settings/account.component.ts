import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ModalService } from "@bitwarden/angular/services/modal.service";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { OrganizationService } from "@bitwarden/common/abstractions/organization.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { SyncService } from "@bitwarden/common/abstractions/sync.service";
import { OrganizationKeysRequest } from "@bitwarden/common/models/request/organizationKeysRequest";
import { OrganizationUpdateRequest } from "@bitwarden/common/models/request/organizationUpdateRequest";
import { OrganizationResponse } from "@bitwarden/common/models/response/organizationResponse";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";

import { ApiKeyComponent } from "../../settings/api-key.component";
import { PurgeVaultComponent } from "../../settings/purge-vault.component";
import { TaxInfoComponent } from "../../settings/tax-info.component";

import { DeleteOrganizationComponent } from "./delete-organization.component";

@Component({
  selector: "app-org-account",
  templateUrl: "account.component.html",
})
export class AccountComponent {
  @ViewChild("deleteOrganizationTemplate", { read: ViewContainerRef, static: true })
  deleteModalRef: ViewContainerRef;
  @ViewChild("purgeOrganizationTemplate", { read: ViewContainerRef, static: true })
  purgeModalRef: ViewContainerRef;
  @ViewChild("apiKeyTemplate", { read: ViewContainerRef, static: true })
  apiKeyModalRef: ViewContainerRef;
  @ViewChild("rotateApiKeyTemplate", { read: ViewContainerRef, static: true })
  rotateApiKeyModalRef: ViewContainerRef;
  @ViewChild(TaxInfoComponent) taxInfo: TaxInfoComponent;

  selfHosted = false;
  canManageBilling = true;
  loading = true;
  canUseApi = false;
  org: OrganizationResponse;
  formPromise: Promise<any>;
  taxFormPromise: Promise<any>;

  private organizationId: string;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private syncService: SyncService,
    private platformUtilsService: PlatformUtilsService,
    private cryptoService: CryptoService,
    private logService: LogService,
    private router: Router,
    private organizationService: OrganizationService,
    private messagingService: MessagingService
  ) {}

  async ngOnInit() {
    this.selfHosted = this.platformUtilsService.isSelfHost();

    this.route.parent.parent.params.subscribe(async (params) => {
      this.organizationId = params.organizationId;
      this.canManageBilling = (
        await this.organizationService.get(this.organizationId)
      ).canManageBilling;
      try {
        this.org = await this.apiService.getOrganization(this.organizationId);
        this.canUseApi = this.org.useApi;
      } catch (e) {
        this.logService.error(e);
      }
    });
    this.loading = false;
  }

  async submit() {
    try {
      const request = new OrganizationUpdateRequest();
      request.name = this.org.name;
      request.businessName = this.org.businessName;
      request.billingEmail = this.org.billingEmail;
      request.identifier = this.org.identifier;

      // Backfill pub/priv key if necessary
      if (!this.org.hasPublicAndPrivateKeys) {
        const orgShareKey = await this.cryptoService.getOrgKey(this.organizationId);
        const orgKeys = await this.cryptoService.makeKeyPair(orgShareKey);
        request.keys = new OrganizationKeysRequest(orgKeys[0], orgKeys[1].encryptedString);
      }

      this.formPromise = this.apiService.putOrganization(this.organizationId, request).then(() => {
        return this.syncService.fullSync(true);
      });
      await this.formPromise;
      this.messagingService.send("organizationUpdated");
      this.platformUtilsService.showToast(
        "success",
        null,
        this.i18nService.t("organizationUpdated")
      );
    } catch (e) {
      this.logService.error(e);
    }
  }

  async submitTaxInfo() {
    this.taxFormPromise = this.taxInfo.submitTaxInfo();
    await this.taxFormPromise;
    this.platformUtilsService.showToast("success", null, this.i18nService.t("taxInfoUpdated"));
  }

  async deleteOrganization() {
    await this.modalService.openViewRef(
      DeleteOrganizationComponent,
      this.deleteModalRef,
      (comp) => {
        comp.organizationId = this.organizationId;
        comp.onSuccess.subscribe(() => {
          this.router.navigate(["/"]);
        });
      }
    );
  }

  async purgeVault() {
    await this.modalService.openViewRef(PurgeVaultComponent, this.purgeModalRef, (comp) => {
      comp.organizationId = this.organizationId;
    });
  }

  async viewApiKey() {
    await this.modalService.openViewRef(ApiKeyComponent, this.apiKeyModalRef, (comp) => {
      comp.keyType = "organization";
      comp.entityId = this.organizationId;
      comp.postKey = this.apiService.postOrganizationApiKey.bind(this.apiService);
      comp.scope = "api.organization";
      comp.grantType = "client_credentials";
      comp.apiKeyTitle = "apiKey";
      comp.apiKeyWarning = "apiKeyWarning";
      comp.apiKeyDescription = "apiKeyDesc";
    });
  }

  async rotateApiKey() {
    await this.modalService.openViewRef(ApiKeyComponent, this.rotateApiKeyModalRef, (comp) => {
      comp.keyType = "organization";
      comp.isRotation = true;
      comp.entityId = this.organizationId;
      comp.postKey = this.apiService.postOrganizationRotateApiKey.bind(this.apiService);
      comp.scope = "api.organization";
      comp.grantType = "client_credentials";
      comp.apiKeyTitle = "apiKey";
      comp.apiKeyWarning = "apiKeyWarning";
      comp.apiKeyDescription = "apiKeyRotateDesc";
    });
  }

  async leaveOrganization() {
    const confirmed = await this.platformUtilsService.showDialog(
      this.i18nService.t("leaveOrganizationConfirmation"),
      this.org.name,
      this.i18nService.t("yes"),
      this.i18nService.t("no"),
      "warning"
    );
    if (!confirmed) {
      return false;
    }

    try {
      this.formPromise = this.apiService.postLeaveOrganization(this.org.id).then(() => {
        return this.syncService.fullSync(true);
      });
      await this.formPromise;
      this.platformUtilsService.showToast("success", null, this.i18nService.t("leftOrganization"));
      this.router.navigate(["/"]);
    } catch (e) {
      this.logService.error(e);
    }
  }
}
