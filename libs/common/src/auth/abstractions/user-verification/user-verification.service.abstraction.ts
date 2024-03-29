import { Verification } from "../../../types/verification";
import { SecretVerificationRequest } from "../../models/request/secret-verification.request";

export abstract class UserVerificationService {
  buildRequest: <T extends SecretVerificationRequest>(
    verification: Verification,
    requestClass?: new () => T,
    alreadyHashed?: boolean
  ) => Promise<T>;
  verifyUser: (verification: Verification) => Promise<boolean>;
  requestOTP: () => Promise<void>;
}
