import { BaseResponse } from "./baseResponse";

export class TwoFactorHyprAuthResponse extends BaseResponse {
  signature: string;
  status: number;
  message: string;

  constructor(response: any) {
    super(response);
    this.signature = this.getResponseProperty("signature");
    this.status = this.getResponseProperty("status");
    this.message = this.getResponseProperty("message");
  }
}
