import { SecretVerificationRequest } from "./secretVerificationRequest";

export class UpdateTwoFactorHyprRequest extends SecretVerificationRequest {
  apiKey: string;
  serverUrl: string;
}
