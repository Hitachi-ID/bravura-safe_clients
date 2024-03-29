import { Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { first } from "rxjs/operators";

import { RegisterComponent as BaseRegisterComponent } from "@bitwarden/angular/components/register.component";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { AuthService } from "@bitwarden/common/auth/abstractions/auth.service";
import { CryptoService } from "@bitwarden/common/platform/abstractions/crypto.service";
import { EnvironmentService } from "@bitwarden/common/platform/abstractions/environment.service";
import { FormValidationErrorsService } from "@bitwarden/angular/platform/abstractions/form-validation-errors.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";
import { PolicyApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/policy/policy-api.service.abstraction";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { StateService } from "@bitwarden/common/platform/abstractions/state.service";
import { PolicyData } from "@bitwarden/common/admin-console/models/data/policy.data";
import { MasterPasswordPolicyOptions } from "@bitwarden/common/admin-console/models/domain/master-password-policy-options";
import { Policy } from "@bitwarden/common/admin-console/models/domain/policy";
import { ReferenceEventRequest } from "@bitwarden/common/models/request/reference-event.request";
import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";

import { RouterService } from "../core";

@Component({
  selector: "app-register",
  templateUrl: "register.component.html",
})
export class RegisterComponent extends BaseRegisterComponent implements OnInit, OnDestroy {
  email = "";
  showCreateOrgMessage = false;
  layout = "";
  enforcedPolicyOptions: MasterPasswordPolicyOptions;

  private policies: Policy[];
  private destroy$ = new Subject<void>();

  constructor(
    formValidationErrorService: FormValidationErrorsService,
    formBuilder: UntypedFormBuilder,
    authService: AuthService,
    router: Router,
    i18nService: I18nService,
    cryptoService: CryptoService,
    apiService: ApiService,
    private route: ActivatedRoute,
    stateService: StateService,
    platformUtilsService: PlatformUtilsService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    private policyApiService: PolicyApiServiceAbstraction,
    private policyService: PolicyService,
    environmentService: EnvironmentService,
    logService: LogService,
    private routerService: RouterService,
    auditService: AuditService,
    dialogService: DialogServiceAbstraction
  ) {
    super(
      formValidationErrorService,
      formBuilder,
      authService,
      router,
      i18nService,
      cryptoService,
      apiService,
      stateService,
      platformUtilsService,
      passwordGenerationService,
      environmentService,
      logService,
      auditService,
      dialogService
    );
  }

  async ngOnInit() {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.route.queryParams.pipe(first()).subscribe((qParams) => {
      this.referenceData = new ReferenceEventRequest();
      if (qParams.email != null && qParams.email.indexOf("@") > -1) {
        this.email = qParams.email;
      }
      if (qParams.premium != null) {
        this.routerService.setPreviousUrl("/settings/premium");
      } else if (qParams.org != null) {
        this.showCreateOrgMessage = true;
        this.referenceData.flow = qParams.org;
        const route = this.router.createUrlTree(["create-organization"], {
          queryParams: { plan: qParams.org },
        });
        this.routerService.setPreviousUrl(route.toString());
      }
      if (qParams.layout != null) {
        this.layout = this.referenceData.layout = qParams.layout;
      }
      if (qParams.reference != null) {
        this.referenceData.id = qParams.reference;
      } else {
        this.referenceData.id = ("; " + document.cookie)
          .split("; reference=")
          .pop()
          .split(";")
          .shift();
      }
      // Are they coming from an email for sponsoring a families organization
      if (qParams.sponsorshipToken != null) {
        // After logging in redirect them to setup the families sponsorship
        const route = this.router.createUrlTree(["setup/families-for-enterprise"], {
          queryParams: { plan: qParams.sponsorshipToken },
        });
        this.routerService.setPreviousUrl(route.toString());
      }
      if (this.referenceData.id === "") {
        this.referenceData.id = null;
      }
    });
    const invite = await this.stateService.getOrganizationInvitation();
    if (invite != null) {
      try {
        const policies = await this.policyApiService.getPoliciesByToken(
          invite.organizationId,
          invite.token,
          invite.email,
          invite.organizationUserId
        );
        if (policies.data != null) {
          const policiesData = policies.data.map((p) => new PolicyData(p));
          this.policies = policiesData.map((p) => new Policy(p));
        }
      } catch (e) {
        this.logService.error(e);
      }
    }

    if (this.policies != null) {
      this.policyService
        .masterPasswordPolicyOptions$(this.policies)
        .pipe(takeUntil(this.destroy$))
        .subscribe((enforcedPasswordPolicyOptions) => {
          this.enforcedPolicyOptions = enforcedPasswordPolicyOptions;
        });
    }

    await super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
