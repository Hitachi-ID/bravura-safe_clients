import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { OrganizationFilterComponent as BaseOrganizationFilterComponent } from "@bitwarden/angular/modules/vault-filter/components/organization-filter.component";

@Component({
  selector: "app-organization-list",
  templateUrl: "organization-list.component.html",
})
export class OrganizationListComponent extends BaseOrganizationFilterComponent {
  displayText = "allVaults";

  constructor(
    private router: Router
  ) { super() }

  navigateOrg(id: string): void {
    this.router.navigate(["/organizations", id]);
  }
}
