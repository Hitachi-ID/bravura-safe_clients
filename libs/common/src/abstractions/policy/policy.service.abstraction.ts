import { Observable } from "rxjs";

import { PolicyType } from "../../enums/policyType";
import { PolicyData } from "../../models/data/policyData";
import { MasterPasswordPolicyOptions } from "../../models/domain/masterPasswordPolicyOptions";
import { Policy } from "../../models/domain/policy";
import { ResetPasswordPolicyOptions } from "../../models/domain/resetPasswordPolicyOptions";
import { ListResponse } from "../../models/response/listResponse";
import { PolicyResponse } from "../../models/response/policyResponse";

export abstract class PolicyService {
  policies$: Observable<Policy[]>;
  masterPasswordPolicyOptions$: (policies?: Policy[]) => Observable<MasterPasswordPolicyOptions>;
  policyAppliesToActiveUser$: (
    policyType: PolicyType,
    policyFilter?: (policy: Policy) => boolean
  ) => Observable<boolean>;

  /**
   * @deprecated Do not call this, use the policies$ observable collection
   */
  getAll: (type?: PolicyType, userId?: string) => Promise<Policy[]>;
  evaluateMasterPassword: (
    passwordStrength: number,
    newPassword: string,
    enforcedPolicyOptions?: MasterPasswordPolicyOptions
  ) => boolean;
  getResetPasswordPolicyOptions: (
    policies: Policy[],
    orgId: string
  ) => [ResetPasswordPolicyOptions, boolean];
  mapPoliciesFromToken: (policiesResponse: ListResponse<PolicyResponse>) => Policy[];
  policyAppliesToUser: (
    policyType: PolicyType,
    policyFilter?: (policy: Policy) => boolean,
    userId?: string
  ) => Promise<boolean>;
}

export abstract class InternalPolicyService extends PolicyService {
  upsert: (policy: PolicyData) => Promise<any>;
  replace: (policies: { [id: string]: PolicyData }) => Promise<void>;
  clear: (userId?: string) => Promise<any>;
}
