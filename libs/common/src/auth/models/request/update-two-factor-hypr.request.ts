import { SecretVerificationRequest } from "./secret-verification.request";

export class UpdateTwoFactorHyprRequest extends SecretVerificationRequest {
  apiKey: string;
  serverUrl: string;
  appId: string;
  hyprMagicLinkDuration: number;
}
