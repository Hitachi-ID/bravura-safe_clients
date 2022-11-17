import { TokenRequestTwoFactor } from './../models/request/identityToken/tokenRequestTwoFactor';
import { HyprAuthenticationRequestModel } from "../models/request/hyprAuthenticationRequestModel";

import { I18nService } from "../abstractions/i18n.service";
import { PlatformUtilsService } from "../abstractions/platformUtils.service";
import { ApiService } from "../abstractions/api.service";

export class HyprIFrame {
  private iframe: HTMLIFrameElement = null;
  private connectorLink: HTMLAnchorElement;
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
    this.connectorLink = win.document.createElement("a");
  }

  async init(data: any) {
    const params = new URLSearchParams({
      data: this.base64Encode(JSON.stringify(data)),
      parent: encodeURIComponent(this.win.document.location.href),
      TX: this.signature,
      v: "1",
    });

    this.connectorLink.href = `${this.webVaultUrl}/hypr-connector.html?${params}`;
    this.iframe = this.win.document.getElementById("hypr_iframe") as HTMLIFrameElement;
    this.iframe.src = this.connectorLink.href;

    this.win.addEventListener("message", this.parseFunction, false);

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
      case 401:
        m = `Authentication denied [${hyprAuthRes.message}]`;
        break;
      case 400:
      default:
        m = `Failed to authenticate [${hyprAuthRes.message}]`;
        break;
    }
    if (gotError) {
      this.iframe.contentDocument.getElementById('messagePlaceHolder').innerHTML = m;
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
      event.data.indexOf("error|") === 0
    );
  }

}
