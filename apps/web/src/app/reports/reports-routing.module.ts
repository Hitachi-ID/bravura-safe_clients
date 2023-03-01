import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "@bitwarden/angular/guards/auth.guard";

import { HasPremiumGuard } from "../shared/guards/has-premium.guard";

import { BreachReportComponent } from "./pages/breach-report.component";
import { ExposedPasswordsReportComponent } from "./pages/exposed-passwords-report.component";
import { InactiveTwoFactorReportComponent } from "./pages/inactive-two-factor-report.component";
import { ReusedPasswordsReportComponent } from "./pages/reused-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./pages/unsecured-websites-report.component";
import { WeakPasswordsReportComponent } from "./pages/weak-passwords-report.component";
import { SecurityAssessmentReportComponent } from "./pages/security-assessment-report.component";
import { ReportsLayoutComponent } from "./reports-layout.component";

const routes: Routes = [
  {
    path: "",
    component: ReportsLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "security-assessment-report" },
      {
        path: "security-assessment-report",
        component: SecurityAssessmentReportComponent,
        data: { titleId: "securityAssessmentReport" },
        canActivate: [HasPremiumGuard],
      },
      {
        path: "reused-passwords-report",
        component: ReusedPasswordsReportComponent,
        data: { titleId: "reusedPasswordsReport" },
        canActivate: [HasPremiumGuard],
      },
      {
        path: "unsecured-websites-report",
        component: UnsecuredWebsitesReportComponent,
        data: { titleId: "unsecuredWebsitesReport" },
        canActivate: [HasPremiumGuard],
      },
      {
        path: "weak-passwords-report",
        component: WeakPasswordsReportComponent,
        data: { titleId: "weakPasswordsReport" },
        canActivate: [HasPremiumGuard],
      },
      {
        path: "exposed-passwords-report",
        component: ExposedPasswordsReportComponent,
        data: { titleId: "exposedPasswordsReport" },
        canActivate: [HasPremiumGuard],
      },
      {
        path: "inactive-two-factor-report",
        component: InactiveTwoFactorReportComponent,
        data: { titleId: "inactive2faReport" },
        canActivate: [HasPremiumGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ReportsRoutingModule {}
