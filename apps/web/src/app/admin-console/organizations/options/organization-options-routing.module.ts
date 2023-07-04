import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { canAccessOptionsTab, canAccessOptionsAccountPage } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";

import { OrganizationPermissionsGuard } from "../../organizations/guards/org-permissions.guard";
import { OrganizationRedirectGuard } from "../../organizations/guards/org-redirect.guard";

import { AccountComponent } from "./account.component";
import { OptionsComponent } from "./options.component";

const routes: Routes = [
  {
    path: "",
    component: OptionsComponent,
    canActivate: [OrganizationPermissionsGuard],
    data: { organizationPermissions: canAccessOptionsTab },
    children: [
      {
        path: "",
        pathMatch: "full",
        canActivate: [OrganizationRedirectGuard],
        data: {
          autoRedirectCallback: getOptionsRoute,
        },
        children: [], // This is required to make the auto redirect work,
      },
      {
        path: "account",
        component: AccountComponent,
        canActivate: [OrganizationPermissionsGuard],
        data: {
          titleId: "myOrganization",
          organizationPermissions: canAccessOptionsAccountPage,
        }
      },
    ],
  },
];

function getOptionsRoute(organization: Organization): string {
  if (organization.isBravuraEnterprise && organization.canAccess) {
    return "account";
  }

  return undefined;
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationOptionsRoutingModule {}
