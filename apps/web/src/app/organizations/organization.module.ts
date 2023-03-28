import { NgModule } from "@angular/core";

import { CoreOrganizationModule } from "./core";
import { GroupAddEditComponent } from "./manage/group-add-edit.component";
import { GroupsComponent } from "./manage/groups.component";
import { OrganizationsRoutingModule } from "./organization-routing.module";
import { SharedOrganizationModule } from "./shared";
import { AccessSelectorModule } from "./shared/components/access-selector";
import { LooseComponentsModule } from "../shared";

@NgModule({
  imports: [
    SharedOrganizationModule,
    AccessSelectorModule,
    CoreOrganizationModule,
    OrganizationsRoutingModule,
    LooseComponentsModule,
  ],
  declarations: [GroupsComponent, GroupAddEditComponent],
})
export class OrganizationModule {}
