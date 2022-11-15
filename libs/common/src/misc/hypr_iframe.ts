import { HyprAuthenticationRequestModel } from "../models/request/hyprAuthenticationRequestModel";
import { AuthTxCookies } from "../models/request/authTxCookies";
import { TwoFactorProviderType } from "../enums/twoFactorProviderType";
import { HyprAuthTokenResponse } from "../models/response/hyprAuthTokenResponse";
import { TokenRequestTwoFactor } from "../models/request/identityToken/tokenRequestTwoFactor";
import { ApiTokenRequest } from "../models/request/identityToken/apiTokenRequest";

import { I18nService } from "../abstractions/i18n.service";
import { PlatformUtilsService } from "../abstractions/platformUtils.service";
import { ApiService } from "../abstractions/api.service";

export class HyprIFrame {
  private iframe: HTMLIFrameElement = null;
  private connectorLink: HTMLAnchorElement;
  private parseFunction = this.parseMessage.bind(this);
  //private authTxToken: string = null;

  constructor(
    private signature: string,
    private teamID: string,
    private win: Window,
    private webVaultUrl: string,
   // private webAuthnNewTab: boolean,
    private platformUtilsService: PlatformUtilsService,
    private apiService: ApiService,
    private i18nService: I18nService,
    private successCallback: Function, // eslint-disable-line
    private errorCallback: Function, // eslint-disable-line
    private infoCallback: Function // eslint-disable-line
  ) {
    this.connectorLink = win.document.createElement("a");
  }

  /*getAuthTxToken(): string {
    return this.authTxToken;
  }*/

  async init(data: any) {
    const params = new URLSearchParams({
      data: this.base64Encode(JSON.stringify(data)),
      parent: encodeURIComponent(this.win.document.location.href),
      TX: this.signature,
      //btnText: encodeURIComponent(this.i18nService.t("webAuthnAuthenticate")),
      v: "1",
    });

    /*if (this.webAuthnNewTab) {
      // Firefox fallback which opens the webauthn page in a new tab
      params.append("locale", this.i18nService.translationLocale);
      this.platformUtilsService.launchUri(
        `${this.webVaultUrl}/webauthn-fallback-connector.html?${params}`
      );
    } else {*/
      this.connectorLink.href = `${this.webVaultUrl}/hypr-connector.html?${params}`;
      this.iframe = this.win.document.getElementById("hypr_iframe") as HTMLIFrameElement;
      //this.iframe.allow = "publickey-credentials-get " + new URL(this.webVaultUrl).origin;
      this.iframe.src = this.connectorLink.href;

      this.win.addEventListener("message", this.parseFunction, false);
    //}
    const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
      Signature: this.signature,
      Team: this.teamID
    };
    const hyprAuthRes = await this.apiService.postTwoFactorHyprAuthReq(hyprAuthenticationRequestModel);

    if (hyprAuthRes.status !== 200) {
      return;
    }

    const concatenatedAuthTx = hyprAuthRes.signature + ":" + this.signature;
    //this.authTxToken = concatenatedAuthTx;
    this.successCallback(concatenatedAuthTx);
    //concatenated: AUTH:TX
    //put AUTH in "twoFactorToken"
    /*const twoFactorInfo = new TokenRequestTwoFactor(
      TwoFactorProviderType.OrganizationHypr,
      concatenatedAuthTx,
      false//todo fix later
    );
    const token = new ApiTokenRequest(
      "web",
      "",
      twoFactorInfo
    );
    await this.apiService.postIdentityToken(token);*/
    /*const authTxCookies: AuthTxCookies = {
      Signature: concatenatedAuthTx
    };
    const hyprAuthTokenResponse = await this.apiService.postTwoFactorHyprTokenReq(authTxCookies);

    if (hyprAuthTokenResponse.status !== 200) {
      return;
    }*/
  }

  stop() {
    this.sendMessage("stop");
  }

  start() {
    this.sendMessage("start");
  }

  sendMessage(message: any) {
    if (!this.iframe || !this.iframe.src || !this.iframe.contentWindow) {
      return;
    }

    this.iframe.contentWindow.postMessage(message, this.iframe.src);
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
    } else if (parts[0] === "info" && this.infoCallback) {
      this.infoCallback(parts[1]);
    }
  }

  private validMessage(event: MessageEvent) {
    if (
      event.origin == null ||
      event.origin === "" ||
      event.origin !== (this.connectorLink as any).origin ||
      event.data == null ||
      typeof event.data !== "string"
    ) {
      return false;
    }

    return (
      event.data.indexOf("success|") === 0 ||
      event.data.indexOf("error|") === 0 ||
      event.data.indexOf("info|") === 0
    );
  }

}
