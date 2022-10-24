import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ModalService } from "@bitwarden/angular/services/modal.service";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { OrganizationService } from "@bitwarden/common/abstractions/organization.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { SyncService } from "@bitwarden/common/abstractions/sync.service";
import { OrganizationResponse } from "@bitwarden/common/models/response/organizationResponse";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { PolicyService } from "@bitwarden/common/abstractions/policy.service";

import { EnrollMasterPasswordReset } from "../../modules/organizations/users/enroll-master-password-reset.component";
import { OrganizationUserResponse } from "@bitwarden/common/models/response/organizationUserResponse";
import { Organization } from "@bitwarden/common/models/domain/organization";
import { PolicyType } from "@bitwarden/common/enums/policyType";
import { Policy } from "@bitwarden/common/models/domain/policy";

@Component({
  selector: "app-org-account-options",
  templateUrl: "account.component.html",
})

export class AccountComponent {
  loading = true;
  org: OrganizationResponse;
  formPromise: Promise<any>;
  organizationUser: OrganizationUserResponse;
  organization: Organization;
  policies: Policy[];

  private organizationId: string;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private syncService: SyncService,
    private platformUtilsService: PlatformUtilsService,
    private logService: LogService,
    private router: Router,
    private organizationService: OrganizationService,
    private stateService: StateService,
    private policyService: PolicyService
  ) {}

  async ngOnInit() {
    this.load();
  }
  async load(){
    this.route.parent.parent.params.subscribe(async (params) => {
      this.organizationId = params.organizationId;
      try {
        this.org = await this.apiService.getOrganization(this.organizationId);
        const userId = await this.stateService.getUserId();
        const users = await this.apiService.getOrganizationUsers(this.organizationId);
        const user = users.data.filter((u) => u.userId === userId);
        if(user!=null && user.length == 1)
          this.organizationUser = await this.apiService.getOrganizationUser(this.organizationId, user[0].id);
        else
          throw new Error("Error when trying to find user in organization.");
        this.organization = await this.organizationService.get(this.organizationId);
        this.policies = await this.policyService.getAll(PolicyType.ResetPassword);
       } catch (e) {
      this.logService.error(e);
      }
    });
    this.loading = false;
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

  allowEnrollmentChanges(): boolean {
    if (this.organization.usePolicies && this.org.useResetPassword && this.org.hasPublicAndPrivateKeys) {
      const policy = this.policies.find((p) => p.organizationId === this.organizationId);
      if (policy != null && policy.enabled) {
        return this.organizationUser.resetPasswordEnrolled && policy.data.autoEnrollEnabled ? false : true;
      }
    }

    return false;
  }

  allowEnrollment(): boolean{
    if( this.org && this.organizationUser && this.organization && this.policies )
      if( this.allowEnrollmentChanges() && !this.organizationUser.resetPasswordEnrolled )
        return true;
    return false;
  }

  async enrollPasswordReset() {
    if (!this.organizationUser.resetPasswordEnrolled) {
      const ref = this.modalService.open(EnrollMasterPasswordReset, {
        allowMultipleModals: true,
        data: {
          organization: {id: this.organizationId, userId: this.organizationUser.userId},
        },
      });

      await ref.onClosedPromise();
      await this.load();
    }
  }
}
