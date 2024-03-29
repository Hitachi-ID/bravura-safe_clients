import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { canAccessReportingTab } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";

import { ExposedPasswordsReportComponent } from "../../../admin-console/organizations/tools/exposed-passwords-report.component";
import { InactiveTwoFactorReportComponent } from "../../../admin-console/organizations/tools/inactive-two-factor-report.component";
import { ReusedPasswordsReportComponent } from "../../../admin-console/organizations/tools/reused-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "../../../admin-console/organizations/tools/unsecured-websites-report.component";
import { WeakPasswordsReportComponent } from "../../../admin-console/organizations/tools/weak-passwords-report.component";
import { IsPaidOrgGuard } from "../guards/is-paid-org.guard";
import { OrganizationPermissionsGuard } from "../guards/org-permissions.guard";
import { OrganizationRedirectGuard } from "../guards/org-redirect.guard";
import { EventsComponent } from "../manage/events.component";
import { SecurityAssessmentReportComponent } from "../tools/security-assessment-report.component";
import { ConfiguredTwoFactorReportComponent } from "../tools/configured-two-factor-report.component";

import { ReportingComponent } from "./reporting.component";

const routes: Routes = [
  {
    path: "",
    component: ReportingComponent,
    canActivate: [OrganizationPermissionsGuard],
    data: { organizationPermissions: canAccessReportingTab },
    children: [
      {
        path: "",
        pathMatch: "full",
        canActivate: [OrganizationRedirectGuard],
        data: {
          autoRedirectCallback: getReportRoute,
        },
        children: [], // This is required to make the auto redirect work,
      },
      {
        path: "reports",
        canActivate: [OrganizationPermissionsGuard],
        children: [
          { path: "", pathMatch: "full", redirectTo: "security-assessment-report" },
          {
            path: "security-assessment-report",
            component: SecurityAssessmentReportComponent,
            data: { titleId: "securityAssessmentReport" },
          },
          {
            path: "exposed-passwords-report",
            component: ExposedPasswordsReportComponent,
            data: {
              titleId: "exposedPasswordsReport",
            },
            canActivate: [IsPaidOrgGuard],
          },
          {
            path: "inactive-two-factor-report",
            component: InactiveTwoFactorReportComponent,
            data: {
              titleId: "inactive2faReport",
            },
            canActivate: [IsPaidOrgGuard],
          },
          {
            path: "reused-passwords-report",
            component: ReusedPasswordsReportComponent,
            data: {
              titleId: "reusedPasswordsReport",
            },
            canActivate: [IsPaidOrgGuard],
          },
          {
            path: "unsecured-websites-report",
            component: UnsecuredWebsitesReportComponent,
            data: {
              titleId: "unsecuredWebsitesReport",
            },
            canActivate: [IsPaidOrgGuard],
          },
          {
            path: "weak-passwords-report",
            component: WeakPasswordsReportComponent,
            data: {
              titleId: "weakPasswordsReport",
            },
            canActivate: [IsPaidOrgGuard],
          },
          {
            path: "configured-two-factor-report",
            component: ConfiguredTwoFactorReportComponent,
            data: {
              titleId: "configured2faReport",
            },
          },
        ],
      },
      {
        path: "events",
        component: EventsComponent,
        canActivate: [OrganizationPermissionsGuard],
        data: {
          titleId: "eventLogs",
          organizationPermissions: (org: Organization) => org.canAccessEventLogs,
        },
      },
    ],
  },
];

function getReportRoute(organization: Organization): string {
  if (organization.canAccessReports) {
    return "reports";
  }
  if (organization.canAccessEventLogs) {
    return "events";
  }
  return undefined;
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationReportingRoutingModule {}
