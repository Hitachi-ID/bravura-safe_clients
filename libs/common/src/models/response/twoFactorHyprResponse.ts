import { BaseResponse } from "./baseResponse";

export class TwoFactorHyprResponse extends BaseResponse {
  enabled: boolean;
  appId: string;
  serverUrl: string;
  apiKey: string;

  constructor(response: any) {
    super(response);
    this.enabled = this.getResponseProperty("enabled");
    this.serverUrl = this.getResponseProperty("serverURL");
    this.appId = this.getResponseProperty("appID");
    this.apiKey = this.getResponseProperty("apiKey");
  }
}
