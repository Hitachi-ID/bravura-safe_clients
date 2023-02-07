import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ModalService } from "@bitwarden/angular/services/modal.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { OrganizationService } from "@bitwarden/common/abstractions/organization/organization.service.abstraction";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { PolicyService } from "@bitwarden/common/abstractions/policy/policy.service.abstraction";
import { EnrollMasterPasswordReset } from "../../organizations/users/enroll-master-password-reset.component";
import { OpenHyprDeviceManager } from "../../organizations/users/open-hypr-device-manager.component";
import { Organization } from "@bitwarden/common/models/domain/organization";
import { PolicyType } from "@bitwarden/common/enums/policyType";
import { Policy } from "@bitwarden/common/models/domain/policy";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { ListResponse } from "@bitwarden/common/models/response/list.response";
import { TwoFactorProviderType } from "@bitwarden/common/enums/twoFactorProviderType";
import { TwoFactorProviderResponse } from "@bitwarden/common/models/response/two-factor-provider.response";

@Component({
  selector: "app-org-account-options",
  templateUrl: "account.component.html",
})

export class AccountComponent {
  loading = true;
  organizationUser: Organization;
  organization: Organization;
  policies: Policy[];
  organizationOneAuthEnabled = false;

  private organizationId: string;

  constructor(
    private modalService: ModalService,
    private route: ActivatedRoute,
    private logService: LogService,
    private organizationService: OrganizationService,
    private stateService: StateService,
    private policyService: PolicyService,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.load();
  }

  async load(){
    this.route.parent.parent.params.subscribe( async( params ) => {
      this.organizationId = params.organizationId;
      try{
        this.organization = await this.organizationService.get( this.organizationId );
        const userId = await this.stateService.getUserId();
        const organizations = await this.organizationService.getAll( userId );
        const organizationUsers = organizations.filter( (o) => o.id === this.organizationId );
        if( organizationUsers!=null && organizationUsers.length == 1 )
          this.organizationUser = organizationUsers[0];
        else
          throw new Error( "Error when trying to find user in team" );
        this.policies = await this.policyService.getAll( PolicyType.ResetPassword );
        const twoFactorProviderHyprEnabled = await this.apiService.getTwoFactorOrganizationHasProvider(this.organizationId, TwoFactorProviderType.OrganizationHypr);
        this.organizationOneAuthEnabled = this.organization && this.organization.use2fa && twoFactorProviderHyprEnabled;
      } catch( e ){
      this.logService.error( e );
      }
    });
    this.loading = false;
  }

  allowEnrollmentChanges(): boolean {
    if( this.organization.usePolicies && this.organization.useResetPassword && this.organization.hasPublicAndPrivateKeys ){
      const policy = this.policies.find( (p) => p.organizationId === this.organizationId );
      if( policy != null && policy.enabled ){
        return this.organizationUser.resetPasswordEnrolled && policy.data.autoEnrollEnabled ? false : true;
      }
    }
    return false;
  }

  allowEnrollment(): boolean{
    if( this.organization && this.organizationUser && this.policies )
      if( this.allowEnrollmentChanges() && !this.organizationUser.resetPasswordEnrolled )
        return true;
    return false;
  }

  async enrollPasswordReset() {
    if( !this.organizationUser.resetPasswordEnrolled ){
      const ref = this.modalService.open( EnrollMasterPasswordReset, {
        allowMultipleModals: true,
        data: {
          organization: { id: this.organizationId, userId: this.organizationUser.userId },
        },
      });

      await ref.onClosedPromise();
      await this.load();
    }
  }

  allowOneAuthDeviceManager(): boolean {
    if( this.organization && this.organizationUser && this.organizationOneAuthEnabled ) {
      return true;
    }
    return false;
  }

  async openOneAuthDeviceManager() {
    if (this.organizationOneAuthEnabled) {
      const ref = this.modalService.open( OpenHyprDeviceManager, {
        allowMultipleModals: true,
        data: {
          organization: { id: this.organizationId, userId: this.organizationUser.userId },
        },
      });
      await ref.onClosedPromise();
      await this.load();
    }
  }
}
