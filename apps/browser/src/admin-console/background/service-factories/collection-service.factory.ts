import { CollectionService as AbstractCollectionService } from "@bitwarden/common/admin-console/abstractions/collection.service";
import { CollectionService } from "@bitwarden/common/admin-console/services/collection.service";

import {
  cryptoServiceFactory,
  CryptoServiceInitOptions,
} from "../../../background/service_factories/crypto-service.factory";
import {
  CachedServices,
  factory,
  FactoryOptions,
} from "../../../background/service_factories/factory-options";
import {
  i18nServiceFactory,
  I18nServiceInitOptions,
} from "../../../background/service_factories/i18n-service.factory";
import {
  stateServiceFactory as stateServiceFactory,
  StateServiceInitOptions,
} from "../../../background/service_factories/state-service.factory";

type CollectionServiceFactoryOptions = FactoryOptions;

export type CollectionServiceInitOptions = CollectionServiceFactoryOptions &
  CryptoServiceInitOptions &
  I18nServiceInitOptions &
  StateServiceInitOptions;

export function collectionServiceFactory(
  cache: { collectionService?: AbstractCollectionService } & CachedServices,
  opts: CollectionServiceInitOptions
): Promise<AbstractCollectionService> {
  return factory(
    cache,
    "collectionService",
    opts,
    async () =>
      new CollectionService(
        await cryptoServiceFactory(cache, opts),
        await i18nServiceFactory(cache, opts),
        await stateServiceFactory(cache, opts)
      )
  );
}
