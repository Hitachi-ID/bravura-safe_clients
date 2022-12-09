import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { canAccessSettingsTab } from "@bitwarden/common/abstractions/organization/organization.service.abstraction";
import { Organization } from "@bitwarden/common/models/domain/organization";

import { OrganizationPermissionsGuard } from "../guards/org-permissions.guard";

import { AccountComponent } from "./account.component";
import { OptionsComponent } from "./options.component";

const routes: Routes = [
  {
    path: "",
    component: OptionsComponent,
    canActivate: [OrganizationPermissionsGuard],
    data: { organizationPermissions: canAccessSettingsTab },
    children: [
      { path: "", pathMatch: "full", redirectTo: "account" },
      { path: "account", component: AccountComponent, data: { titleId: "myOrganization" } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationOptionsRoutingModule {}
