import { BaseResponse } from "../../../models/response/base.response";

export class TwoFactorHyprAuthResponse extends BaseResponse {
  signature: string;
  status: number;
  message: string;
  errorCode: number;

  constructor(response: any) {
    super(response);
    this.signature = this.getResponseProperty("signature");
    this.status = this.getResponseProperty("status");
    this.message = this.getResponseProperty("message");
    this.errorCode = this.getResponseProperty("errorCode");
  }
}
