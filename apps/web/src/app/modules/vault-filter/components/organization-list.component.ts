import { Component } from "@angular/core";

import { OrganizationFilterComponent as BaseOrganizationFilterComponent } from "@bitwarden/angular/modules/vault-filter/components/organization-filter.component";

@Component({
  selector: "app-organization-list",
  templateUrl: "organization-list.component.html",
})
export class OrganizationListComponent extends BaseOrganizationFilterComponent {
  displayText = "allVaults";
}
