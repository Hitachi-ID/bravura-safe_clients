import { NgModule } from "@angular/core";

import { LooseComponentsModule, SharedModule } from "../../shared";

import { AccountComponent } from "./account.component";
import { OrganizationOptionsRoutingModule } from "./organization-options-routing.module";
import { OptionsComponent } from "./options.component";

@NgModule({
  imports: [SharedModule, LooseComponentsModule, OrganizationOptionsRoutingModule],
  declarations: [
    OptionsComponent,
    AccountComponent,
  ],
})
export class OrganizationOptionsModule {}

