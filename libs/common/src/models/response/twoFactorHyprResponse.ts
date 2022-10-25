import { BaseResponse } from "./baseResponse";

export class TwoFactorHyprResponse extends BaseResponse {
  enabled: boolean;
  serverUrl: string;
  apiKey: string;

  constructor(response: any) {
    super(response);
    this.enabled = this.getResponseProperty("Enabled");
    this.serverUrl = this.getResponseProperty("ServerUrl");
    this.apiKey = this.getResponseProperty("ApiKey");
  }
}
