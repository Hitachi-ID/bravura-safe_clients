import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";

import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";

@Component({
  selector: "app-org-options",
  templateUrl: "options.component.html",
})
export class OptionsComponent implements OnInit, OnDestroy {
  organization: Organization;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(async (params) => await this.organizationService.get(params.organizationId)),
        takeUntil(this.destroy$)
      )
      .subscribe((organization) => {
        this.organization = organization;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
