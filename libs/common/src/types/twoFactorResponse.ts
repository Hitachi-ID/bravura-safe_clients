import { TwoFactorAuthenticatorResponse } from "../models/response/twoFactorAuthenticatorResponse";
import { TwoFactorDuoResponse } from "../models/response/twoFactorDuoResponse";
import { TwoFactorEmailResponse } from "../models/response/twoFactorEmailResponse";
import { TwoFactorHyprResponse } from "../models/response/twoFactorHyprResponse";
import { TwoFactorRecoverResponse } from "../models/response/twoFactorRescoverResponse";
import { TwoFactorWebAuthnResponse } from "../models/response/twoFactorWebAuthnResponse";
import { TwoFactorYubiKeyResponse } from "../models/response/twoFactorYubiKeyResponse";

export type TwoFactorResponse =
  | TwoFactorRecoverResponse
  | TwoFactorDuoResponse
  | TwoFactorEmailResponse
  | TwoFactorHyprResponse
  | TwoFactorWebAuthnResponse
  | TwoFactorAuthenticatorResponse
  | TwoFactorYubiKeyResponse;
