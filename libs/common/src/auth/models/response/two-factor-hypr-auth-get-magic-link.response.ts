import { BaseResponse } from "../../../models/response/base.response";

export class TwoFactorHyprAuthGetMagicLink extends BaseResponse {
  url: string;
  status: number;
  message: string;

  constructor(response: any) {
    super(response);
    this.url = this.getResponseProperty("url");
    this.status = this.getResponseProperty("status");
    this.message = this.getResponseProperty("message");
  }
}
