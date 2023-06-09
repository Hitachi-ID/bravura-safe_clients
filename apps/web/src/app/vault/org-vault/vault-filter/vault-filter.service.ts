import { Injectable, OnDestroy } from "@angular/core";
import { map, Observable, ReplaySubject, Subject } from "rxjs";

import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { TreeNode } from "@bitwarden/common/models/domain/tree-node";
import { CipherService } from "@bitwarden/common/vault/abstractions/cipher.service";
import { FolderService } from "@bitwarden/common/vault/abstractions/folder/folder.service.abstraction";

import {
  CollectionAdminService,
  CollectionAdminView,
} from "../../../admin-console/organizations/core";
import { StateService } from "../../../core";
import { VaultFilterService as BaseVaultFilterService } from "../../individual-vault/vault-filter/services/vault-filter.service";
import { CollectionFilter } from "../../individual-vault/vault-filter/shared/models/vault-filter.type";
// import { CollectionView } from "@bitwarden/common/models/view/collection.view";

@Injectable()
export class VaultFilterService extends BaseVaultFilterService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private _collections = new ReplaySubject<CollectionAdminView[]>(1);
// private _collections = new ReplaySubject<CollectionView[]>(1);
  filteredCollections$: Observable<CollectionAdminView[]> = this._collections.asObservable();
// filteredCollections$: Observable<CollectionView[]> = this._collections.asObservable();

  collectionTree$: Observable<TreeNode<CollectionFilter>> = this.filteredCollections$.pipe(
    map((collections) => this.buildCollectionTree(collections))
  );

  constructor(
    stateService: StateService,
    organizationService: OrganizationService,
    folderService: FolderService,
    cipherService: CipherService,
    policyService: PolicyService,
    i18nService: I18nService,
    protected collectionAdminService: CollectionAdminService
  ) {
    super(
      stateService,
      organizationService,
      folderService,
      cipherService,
      policyService,
      i18nService
    );
  }

  async reloadCollections(collections: CollectionAdminView[]) {
        this._collections.next(collections);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
