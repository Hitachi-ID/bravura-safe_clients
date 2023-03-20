import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { firstValueFrom, Subject, switchMap, takeUntil } from "rxjs";

import { Organization } from "@bitwarden/common/models/domain/organization";
import { TreeNode } from "@bitwarden/common/models/domain/tree-node";
import { CollectionView } from "@bitwarden/common/models/view/collection.view";

import { VaultFilterComponent as BaseVaultFilterComponent } from "../../individual-vault/vault-filter/components/vault-filter.component";
import {
  VaultFilterList,
  VaultFilterType,
} from "../../individual-vault/vault-filter/shared/models/vault-filter-section.type";
import { CollectionFilter, CipherTypeFilter } from "../../individual-vault/vault-filter/shared/models/vault-filter.type";

@Component({
  selector: "app-organization-vault-filter",
  templateUrl: "./vault-filter.component.html",
})
export class VaultFilterComponent extends BaseVaultFilterComponent implements OnInit, OnDestroy {
  @Input() set organization(value: Organization) {
    if (value && value !== this._organization) {
      this._organization = value;
      this.vaultFilterService.setOrganizationFilter(this._organization);
    }
  }
  _organization: Organization;
  protected destroy$: Subject<void>;

  async ngOnInit() {
    this.filters = await this.buildAllFilters();
    this.activeFilter.resetFilter();
    this.activeFilter.selectedCipherTypeNode =
      (await this.getDefaultFilter()) as TreeNode<CipherTypeFilter>;
    this.isLoaded = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadSubscriptions() {
    this.vaultFilterService.filteredCollections$
      .pipe(
        switchMap(async (collections) => {
          this.removeInvalidCollectionSelection(collections);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  protected async removeInvalidCollectionSelection(collections: CollectionView[]) {
    if (this.activeFilter.selectedCollectionNode) {
      if (!collections.some((f) => f.id === this.activeFilter.collectionId)) {
        this.activeFilter.resetFilter();
        this.activeFilter.selectedCipherTypeNode =
          (await this.getDefaultFilter()) as TreeNode<CipherTypeFilter>;
        this.applyVaultFilter(this.activeFilter);
      }
    }
  }

  async buildAllFilters(): Promise<VaultFilterList> {
    const builderFilter = {} as VaultFilterList;
    builderFilter.typeFilter = await this.addTypeFilter("organizationVaultItems", ["favorites"]);
    builderFilter.collectionFilter = await this.addCollectionFilter();
    return builderFilter;
  }

  async getDefaultFilter(): Promise<TreeNode<VaultFilterType>> {
    return await firstValueFrom(this.filters?.typeFilter.data$);
  }
}
