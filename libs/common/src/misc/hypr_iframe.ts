import { HyprAuthenticationRequestModel } from "../models/request/hyprAuthenticationRequestModel";

import { I18nService } from "../abstractions/i18n.service";
import { PlatformUtilsService } from "../abstractions/platformUtils.service";
import { ApiService } from "../abstractions/api.service";
import { TwoFactorProviderType } from '../enums/twoFactorProviderType';

export class HyprIFrame {
  private parseFunction = this.parseMessage.bind(this);

  constructor(
    private signature: string,
    private teamID: string,
    private win: Window,
    private webVaultUrl: string,
    private platformUtilsService: PlatformUtilsService,
    private apiService: ApiService,
    private i18nService: I18nService,
    private successCallback: Function, // eslint-disable-line
    private errorCallback: Function // eslint-disable-line
  ) {
  }

  async init(data: any) {
    this.win.addEventListener("message", this.parseFunction, false);

    const img = this.win.document.getElementById("img");
    const num : number = TwoFactorProviderType.OrganizationHypr;
    img.setAttribute('src', '../images/' + num.toString() + '.png');

    const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
      Signature: this.signature,
      Team: this.teamID
    };
    const hyprAuthRes = await this.apiService.postTwoFactorHyprAuthReq(hyprAuthenticationRequestModel);

    let gotError: boolean = true;
    let m: string;
    switch (hyprAuthRes.status) {
      case 200:
        if (!hyprAuthRes.signature) {
          this.errorCallback("Failed to authenticate [no token]");
          return;
        }
        // no errors, break to continue with the login sequence
        gotError = false
        break;
      //case 40000:
        // get magic link [send email] or [pop up new tab]
        // break;
      case 401:
        m = `Authentication denied [${hyprAuthRes.message}]`;
        break;
      case 400:
      default:
        m = `Failed to authenticate via HYPR [${hyprAuthRes.message}]`;
        break;
    }
    if (gotError) {
      this.win.document.getElementsByClassName('fa-spinner')[0].className = 'fa fa-times';
      this.win.document.getElementById('messagePlaceHolder').innerHTML = m;
      this.errorCallback(m);
      return;
    }

    //concatenate AUTH:TX and pass it back as the token for TokenRequestTwoFactor
    const concatenatedAuthTx = hyprAuthRes.signature + ":" + this.signature;
    this.successCallback(concatenatedAuthTx);
  }

  stop() {
    this.sendMessage("stop");
  }

  start() {
    this.sendMessage("start");
  }

  sendMessage(message: any) {
    this.win.postMessage(message, this.win.location.href);
  }

  base64Encode(str: string): string {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(("0x" + p1) as any);
      })
    );
  }

  cleanup() {
    this.win.removeEventListener("message", this.parseFunction, false);
  }

  private parseMessage(event: MessageEvent) {
    if (!this.validMessage(event)) {
      return;
    }

    const parts: string[] = event.data.split("|");
    if (parts[0] === "success" && this.successCallback) {
      this.successCallback(parts[1]);
    } else if (parts[0] === "error" && this.errorCallback) {
      this.errorCallback(parts[1]);
    }
  }

  private validMessage(event: MessageEvent) {
    if (
      event.origin == null ||
      event.origin === "" ||
      event.data == null ||
      typeof event.data !== "string"
    ) {
      return false;
    }

    return (
      event.data.indexOf("success|") === 0 ||
      event.data.indexOf("error|") === 0
    );
  }

}
