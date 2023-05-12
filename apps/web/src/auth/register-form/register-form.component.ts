import { Component, Input } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { RegisterComponent as BaseRegisterComponent } from "@bitwarden/angular/components/register.component";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { EnvironmentService } from "@bitwarden/common/abstractions/environment.service";
import { FormValidationErrorsService } from "@bitwarden/common/abstractions/formValidationErrors.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { PolicyService } from "@bitwarden/common/abstractions/policy/policy.service.abstraction";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { AuthService } from "@bitwarden/common/auth/abstractions/auth.service";
import { MasterPasswordPolicyOptions } from "@bitwarden/common/models/domain/master-password-policy-options";
import { ReferenceEventRequest } from "@bitwarden/common/models/request/reference-event.request";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";
import { Policy } from "@bitwarden/common/models/domain/policy";
import { PolicyApiServiceAbstraction } from "@bitwarden/common/abstractions/policy/policy-api.service.abstraction";
import { PolicyData } from "@bitwarden/common/models/data/policy.data";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
})
export class RegisterFormComponent extends BaseRegisterComponent {
  @Input() queryParamEmail: string;
  @Input() enforcedPolicyOptions: MasterPasswordPolicyOptions;
  @Input() referenceDataValue: ReferenceEventRequest;

  showErrorSummary = false;
  characterMinimumMessage: string;
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
    stateService: StateService,
    platformUtilsService: PlatformUtilsService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    private policyService: PolicyService,
    environmentService: EnvironmentService,
    logService: LogService,
    auditService: AuditService,
    private policyApiService: PolicyApiServiceAbstraction
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
      auditService
    );
  }

  async ngOnInit() {
    await super.ngOnInit();
    this.referenceData = this.referenceDataValue;

    if (this.queryParamEmail) {
      this.formGroup.get("email")?.setValue(this.queryParamEmail);
    }

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

    if( this.enforcedPolicyOptions != null && this.enforcedPolicyOptions.minLength > 0 ){
      this.minimumLength = this.enforcedPolicyOptions.minLength;
      this.formGroup.get('masterPassword').setValidators([Validators.required, Validators.minLength(this.minimumLength)]);
      this.formGroup.get('masterPassword').updateValueAndValidity();
      this.formGroup.get('confirmMasterPassword').setValidators([Validators.required, Validators.minLength(this.minimumLength)]);
      this.formGroup.get('confirmMasterPassword').updateValueAndValidity();
    }

    this.characterMinimumMessage = this.i18nService.t("characterMinimum", this.minimumLength);
  }

  async submit() {
    if (
      this.enforcedPolicyOptions != null &&
      !this.policyService.evaluateMasterPassword(
        this.passwordStrengthResult.score,
        this.formGroup.value.masterPassword,
        this.enforcedPolicyOptions
      )
    ) {
      this.platformUtilsService.showToast(
        "error",
        this.i18nService.t("errorOccurred"),
        this.i18nService.t("masterPasswordPolicyRequirementsNotMet")
      );
      return;
    }

    await super.submit(false);
  }
}
