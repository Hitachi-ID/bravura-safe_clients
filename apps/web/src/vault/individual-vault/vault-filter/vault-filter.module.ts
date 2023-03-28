import { NgModule } from "@angular/core";

import { VaultFilterSharedModule } from "../../individual-vault/vault-filter/shared/vault-filter-shared.module";

import { LinkSsoComponent } from "./components/link-sso.component";
import { OrganizationListComponent } from "./components/organization-list.component";
import { OrganizationOptionsComponent } from "./components/organization-options.component";
import { VaultFilterComponent } from "./components/vault-filter.component";
import { VaultFilterService as VaultFilterServiceAbstraction } from "./services/abstractions/vault-filter.service";
import { VaultFilterService } from "./services/vault-filter.service";

@NgModule({
  imports: [VaultFilterSharedModule],
  declarations: [VaultFilterComponent, OrganizationListComponent, OrganizationOptionsComponent, LinkSsoComponent],
  exports: [VaultFilterComponent, OrganizationListComponent],
  providers: [
    {
      provide: VaultFilterServiceAbstraction,
      useClass: VaultFilterService,
    },
  ],
})
export class VaultFilterModule {}
