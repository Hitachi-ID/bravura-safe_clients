import { SecretVerificationRequest } from "./secretVerificationRequest";

export class UpdateTwoFactorHyprRequest extends SecretVerificationRequest {
  apiKey: string;
  serverHurl: string;
}
