import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";

import { LooseComponentsModule, SharedModule } from "../../../shared";

import { EnrollMasterPasswordReset } from "./enroll-master-password-reset.component";
import { OpenHyprDeviceManager } from "./open-hypr-device-manager.component";

@NgModule({
  imports: [SharedModule, ScrollingModule, LooseComponentsModule],
  declarations: [EnrollMasterPasswordReset, OpenHyprDeviceManager],
  exports: [EnrollMasterPasswordReset, OpenHyprDeviceManager],
})
export class OrganizationUserModule {}
