import { BaseResponse } from "./baseResponse";

export class HyprAuthTokenResponse extends BaseResponse {
  signature: string;
  status: number;

  constructor(response: any) {
    super(response);
    this.signature = this.getResponseProperty("signature");
    this.status = this.getResponseProperty("status");
  }
}
