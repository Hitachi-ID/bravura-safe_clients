import "zone.js/dist/zone";

import { registerLocaleData } from "@angular/common";
import localeEnGb from "@angular/common/locales/en-GB";
import localeEnIn from "@angular/common/locales/en-IN";
import localeFr from "@angular/common/locales/fr";
import { NgModule } from "@angular/core";

import { AccessibilityCookieComponent } from "./accounts/accessibility-cookie.component";
import { DeleteAccountComponent } from "./accounts/delete-account.component";
import { EnvironmentComponent } from "./accounts/environment.component";
import { HintComponent } from "./accounts/hint.component";
import { LockComponent } from "./accounts/lock.component";
import { LoginComponent } from "./accounts/login.component";
import { PremiumComponent } from "./accounts/premium.component";
import { RegisterComponent } from "./accounts/register.component";
import { RemovePasswordComponent } from "./accounts/remove-password.component";
import { SetPasswordComponent } from "./accounts/set-password.component";
import { SettingsComponent } from "./accounts/settings.component";
import { SsoComponent } from "./accounts/sso.component";
import { TwoFactorOptionsComponent } from "./accounts/two-factor-options.component";
import { TwoFactorComponent } from "./accounts/two-factor.component";
import { UpdateTempPasswordComponent } from "./accounts/update-temp-password.component";
import { VaultTimeoutInputComponent } from "./accounts/vault-timeout-input.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PasswordRepromptComponent } from "./components/password-reprompt.component";
import { SetPinComponent } from "./components/set-pin.component";
import { UserVerificationComponent } from "./components/user-verification.component";
import { AccountSwitcherComponent } from "./layout/account-switcher.component";
import { HeaderComponent } from "./layout/header.component";
import { NavComponent } from "./layout/nav.component";
import { SearchComponent } from "./layout/search/search.component";
import { AddEditComponent as SendAddEditComponent } from "./send/add-edit.component";
import { EffluxDatesComponent as SendEffluxDatesComponent } from "./send/efflux-dates.component";
import { SendComponent } from "./send/send.component";
import { SharedModule } from "./shared/shared.module";
import { AddEditCustomFieldsComponent } from "./vault/add-edit-custom-fields.component";
import { AddEditComponent } from "./vault/add-edit.component";
import { AttachmentsComponent } from "./vault/attachments.component";
import { CollectionsComponent } from "./vault/collections.component";
import { ExportComponent } from "./vault/export.component";
import { FolderAddEditComponent } from "./vault/folder-add-edit.component";
import { GeneratorComponent } from "./vault/generator.component";
import { PasswordGeneratorHistoryComponent } from "./vault/password-generator-history.component";
import { PasswordHistoryComponent } from "./vault/password-history.component";
import { ShareComponent } from "./vault/share.component";
import { VaultFilterModule } from "./vault/vault-filter/vault-filter.module";
import { VaultItemsComponent } from "./vault/vault-items.component";
import { VaultComponent } from "./vault/vault.component";
import { ViewCustomFieldsComponent } from "./vault/view-custom-fields.component";
import { ViewComponent } from "./vault/view.component";


registerLocaleData(localeEnGb, "en-GB");
registerLocaleData(localeEnIn, "en-IN");
registerLocaleData(localeFr, "fr");

@NgModule({
  imports: [SharedModule, AppRoutingModule, VaultFilterModule],
  declarations: [
    AccessibilityCookieComponent,
    AccountSwitcherComponent,
    AddEditComponent,
    AddEditCustomFieldsComponent,
    AppComponent,
    AttachmentsComponent,
    VaultItemsComponent,
    CollectionsComponent,
    DeleteAccountComponent,
    EnvironmentComponent,
    ExportComponent,
    FolderAddEditComponent,
    HeaderComponent,
    HintComponent,
    LockComponent,
    LoginComponent,
    NavComponent,
    GeneratorComponent,
    PasswordGeneratorHistoryComponent,
    PasswordHistoryComponent,
    PasswordRepromptComponent,
    PremiumComponent,
    RegisterComponent,
    RemovePasswordComponent,
    SearchComponent,
    SendAddEditComponent,
    SendComponent,
    SendEffluxDatesComponent,
    SetPasswordComponent,
    SetPinComponent,
    SettingsComponent,
    ShareComponent,
    SsoComponent,
    TwoFactorComponent,
    TwoFactorOptionsComponent,
    UpdateTempPasswordComponent,
    UserVerificationComponent,
    VaultComponent,
    VaultTimeoutInputComponent,
    ViewComponent,
    ViewCustomFieldsComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
