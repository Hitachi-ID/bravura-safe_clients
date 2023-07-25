import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";

import { UserVerificationModule } from "../../../auth/shared/components/user-verification";
import { LooseComponentsModule, SharedModule } from "../../../shared";

import { EnrollMasterPasswordReset } from "./enroll-master-password-reset.component";
import { OpenHyprDeviceManager } from "./open-hypr-device-manager.component";

@NgModule({
  imports: [SharedModule, ScrollingModule, LooseComponentsModule, UserVerificationModule],
  declarations: [EnrollMasterPasswordReset, OpenHyprDeviceManager],
  exports: [EnrollMasterPasswordReset, OpenHyprDeviceManager],
})
export class OrganizationUserModule {}
