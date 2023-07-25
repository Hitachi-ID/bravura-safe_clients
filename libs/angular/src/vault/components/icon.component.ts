import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
} from "rxjs";

import { SettingsService } from "@bitwarden/common/abstractions/settings.service";
import { EnvironmentService } from "@bitwarden/common/platform/abstractions/environment.service";
import { Utils } from "@bitwarden/common/platform/misc/utils";
import { CipherType } from "@bitwarden/common/vault/enums/cipher-type";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";
const IconMap: any = {
  "fa-globe": String.fromCharCode(0xf0ac),
  "fa-sticky-note-o": String.fromCharCode(0xf24a),
  "fa-id-card-o": String.fromCharCode(0xf2c3),
  "fa-credit-card": String.fromCharCode(0xf09d),
  "fa-android": String.fromCharCode(0xf17b),
  "fa-apple": String.fromCharCode(0xf179),
};

/**
 * Provides a mapping from supported card brands to
 * the filenames of icon that should be present in images/cards folder of clients.
 */
const cardIcons: Record<string, string> = {
  Visa: "card-visa",
  Mastercard: "card-mastercard",
  Amex: "card-amex",
  Discover: "card-discover",
  "Diners Club": "card-diners-club",
  JCB: "card-jcb",
  Maestro: "card-maestro",
  UnionPay: "card-union-pay",
  RuPay: "card-ru-pay",
};

@Component({
  selector: "app-vault-icon",
  templateUrl: "icon.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit {
  @Input()
  set cipher(value: CipherView) {
    this.cipher$.next(value);
  }

  protected data$: Observable<{
    imageEnabled: boolean;
    image?: string;
  fallbackImage: string;
    icon?: string;
  }>;

  private cipher$ = new BehaviorSubject<CipherView>(undefined);

  constructor(
    private environmentService: EnvironmentService,
    private settingsService: SettingsService
  ) {}

  async ngOnInit() {
    const iconsUrl = this.environmentService.getIconsUrl();

    this.data$ = combineLatest([
      this.settingsService.disableFavicon$.pipe(distinctUntilChanged()),
      this.cipher$.pipe(filter((c) => c !== undefined)),
    ]).pipe(
      map(([disableFavicon, cipher]) => {
        const imageEnabled = !disableFavicon;
        let image = undefined;
        let fallbackImage = "";
        let icon = undefined;

        switch (cipher.type) {
      case CipherType.Login:
            icon = "fa-globe";

            if (cipher.login.uri) {
              let hostnameUri = cipher.login.uri;
      let isWebsite = false;

      if (hostnameUri.indexOf("androidapp://") === 0) {
                icon = "fa-android";
                image = null;
      } else if (hostnameUri.indexOf("iosapp://") === 0) {
                icon = "fa-apple";
                image = null;
      } else if (
                imageEnabled &&
        hostnameUri.indexOf("://") === -1 &&
        hostnameUri.indexOf(".") > -1
      ) {
        hostnameUri = "http://" + hostnameUri;
        isWebsite = true;
              } else if (imageEnabled) {
        isWebsite = hostnameUri.indexOf("http") === 0 && hostnameUri.indexOf(".") > -1;
      }

              if (imageEnabled && isWebsite) {
        try {
                  image = iconsUrl + "/" + Utils.getHostname(hostnameUri) + "/icon.png";
                  fallbackImage = "images/fa-globe.png";
        } catch (e) {
          // Ignore error since the fallback icon will be shown if image is null.
        }
      }
    } else {
              image = null;
    }
            break;
          case CipherType.SecureNote:
            icon = "fa-sticky-note-o";
            break;
          case CipherType.Card:
            icon = "fa-credit-card";
            if (imageEnabled && cipher.card.brand in cardIcons) {
              icon = "credit-card-icon " + cardIcons[cipher.card.brand];
  }
            break;
          case CipherType.Identity:
            icon = "fa-id-card-o";
            break;
          default:
            break;
        }

        return {
          imageEnabled,
          image,
          fallbackImage,
          icon,
        };
      })
    );
    }
  }
