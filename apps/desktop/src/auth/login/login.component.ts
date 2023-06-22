import { Component, NgZone, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { EnvironmentSelectorComponent } from "@bitwarden/angular/auth/components/environment-selector.component";
import { LoginComponent as BaseLoginComponent } from "@bitwarden/angular/auth/components/login.component";
import { ModalService } from "@bitwarden/angular/services/modal.service";
import { AppIdService } from "@bitwarden/common/abstractions/appId.service";
import { BroadcasterService } from "@bitwarden/common/abstractions/broadcaster.service";
import { CryptoFunctionService } from "@bitwarden/common/abstractions/cryptoFunction.service";
import { DevicesApiServiceAbstraction } from "@bitwarden/common/abstractions/devices/devices-api.service.abstraction";
import { EnvironmentService } from "@bitwarden/common/abstractions/environment.service";
import { FormValidationErrorsService } from "@bitwarden/common/abstractions/formValidationErrors.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { AuthService } from "@bitwarden/common/auth/abstractions/auth.service";
import { LoginService } from "@bitwarden/common/auth/abstractions/login.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";

import { EnvironmentComponent } from "../environment.component";

const BroadcasterSubscriptionId = "LoginComponent";

@Component({
  selector: "app-login",
  templateUrl: "login.component.html",
})
export class LoginComponent extends BaseLoginComponent implements OnDestroy {
  @ViewChild("environment", { read: ViewContainerRef, static: true })
  environmentModal: ViewContainerRef;
  @ViewChild(EnvironmentSelectorComponent)
  environmentSelector!: EnvironmentSelectorComponent;

  protected componentDestroyed$: Subject<void> = new Subject();
  webVaultHostname = "";

  showingModal = false;

  private deferFocus: boolean = null;

  get loggedEmail() {
    return this.formGroup.value.email;
  }

  get selfHostedDomain() {
    return this.environmentService.hasBaseUrl() ? this.environmentService.getWebVaultUrl() : null;
  }

  constructor(
    devicesApiService: DevicesApiServiceAbstraction,
    appIdService: AppIdService,
    authService: AuthService,
    router: Router,
    i18nService: I18nService,
    syncService: SyncService,
    private modalService: ModalService,
    platformUtilsService: PlatformUtilsService,
    stateService: StateService,
    environmentService: EnvironmentService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    cryptoFunctionService: CryptoFunctionService,
    private broadcasterService: BroadcasterService,
    ngZone: NgZone,
    private messagingService: MessagingService,
    logService: LogService,
    formBuilder: FormBuilder,
    formValidationErrorService: FormValidationErrorsService,
    route: ActivatedRoute,
    loginService: LoginService
  ) {
    super(
      devicesApiService,
      appIdService,
      authService,
      router,
      platformUtilsService,
      i18nService,
      stateService,
      environmentService,
      passwordGenerationService,
      cryptoFunctionService,
      logService,
      ngZone,
      formBuilder,
      formValidationErrorService,
      route,
      loginService
    );
    super.onSuccessfulLogin = () => {
      return syncService.fullSync(true);
    };
  }

  async ngOnInit() {
    await super.ngOnInit();
    await this.checkSelfHosted();
    this.broadcasterService.subscribe(BroadcasterSubscriptionId, async (message: any) => {
      this.ngZone.run(() => {
        switch (message.command) {
          case "windowHidden":
            this.onWindowHidden();
            break;
          case "windowIsFocused":
            if (this.deferFocus === null) {
              this.deferFocus = !message.windowIsFocused;
              if (!this.deferFocus) {
                this.focusInput();
              }
            } else if (this.deferFocus && message.windowIsFocused) {
              this.focusInput();
              this.deferFocus = false;
            }
            break;
          default:
        }
      });
    });
    this.messagingService.send("getWindowIsFocused");
    this.environmentSelector.onOpenSelfHostedSettings
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        this.settings();
      });
  }

  ngOnDestroy() {
    this.broadcasterService.unsubscribe(BroadcasterSubscriptionId);
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  async settings() {
    const [modal, childComponent] = await this.modalService.openViewRef(
      EnvironmentComponent,
      this.environmentModal
    );

    modal.onShown.pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
      this.showingModal = true;
    });

    modal.onClosed.pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
      this.showingModal = false;
    });

    // eslint-disable-next-line rxjs/no-async-subscribe
    childComponent.onSaved.pipe(takeUntil(this.componentDestroyed$)).subscribe(async () => {
      modal.close();
      await this.checkSelfHosted();
    });
  }

  onWindowHidden() {
    this.showPassword = false;
  }

  async continue() {
    await super.validateEmail();
    if (!this.formGroup.controls.email.valid) {
      this.platformUtilsService.showToast(
        "error",
        this.i18nService.t("errorOccured"),
        this.i18nService.t("invalidEmail")
      );
      return;
    }
    this.focusInput();
  }

  async submit() {
    if (!this.validatedEmail) {
      return;
    }

    await super.submit();
    if (this.captchaSiteKey) {
      const content = document.getElementById("content") as HTMLDivElement;
      content.setAttribute("style", "width:335px");
    }
  }

  private focusInput() {
    const email = this.loggedEmail;
    document.getElementById(email == null || email === "" ? "email" : "masterPassword").focus();
  }

  private async checkSelfHosted() {
    this.selfHosted = this.environmentService.isSelfHosted();

    await this.getLoginWithDevice(this.loggedEmail);
  }
}
