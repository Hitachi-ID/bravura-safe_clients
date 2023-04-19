import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../shared";

import { BreachReportComponent } from "./pages/breach-report.component";
import { ExposedPasswordsReportComponent } from "./pages/exposed-passwords-report.component";
import { InactiveTwoFactorReportComponent } from "./pages/inactive-two-factor-report.component";
import { ReusedPasswordsReportComponent } from "./pages/reused-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./pages/unsecured-websites-report.component";
import { WeakPasswordsReportComponent } from "./pages/weak-passwords-report.component";
import { SecurityAssessmentReportComponent } from "./pages/security-assessment-report.component";
import { ConfiguredTwoFactorReportComponent } from "./pages/configured-two-factor-report.component";
import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportsSharedModule } from "./shared";

@NgModule({
  imports: [CommonModule, SharedModule, ReportsSharedModule, ReportsRoutingModule],
  declarations: [
    BreachReportComponent,
    ExposedPasswordsReportComponent,
    InactiveTwoFactorReportComponent,
    ReusedPasswordsReportComponent,
    UnsecuredWebsitesReportComponent,
    WeakPasswordsReportComponent,
    SecurityAssessmentReportComponent,
    ConfiguredTwoFactorReportComponent,
  ],
})
export class ReportsModule {}
