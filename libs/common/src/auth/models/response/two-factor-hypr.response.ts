import { BaseResponse } from "../../../models/response/base.response";

export class TwoFactorHyprResponse extends BaseResponse {
  enabled: boolean;
  appId: string;
  serverUrl: string;
  apiKey: string;
  hyprMagicLinkDuration: number;

  constructor(response: any) {
    super(response);
    this.enabled = this.getResponseProperty("enabled");
    this.serverUrl = this.getResponseProperty("serverURL");
    this.appId = this.getResponseProperty("appID");
    this.apiKey = this.getResponseProperty("apiKey");
    let hyprMagicLinkDuration = this.getResponseProperty("hyprMagicLinkDuration");
    this.hyprMagicLinkDuration = hyprMagicLinkDuration ? hyprMagicLinkDuration : 900;
  }
}
