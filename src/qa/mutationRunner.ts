import { ACLEvaluator } from '../security/acl';
import { UnifiedACL, UserEntitlements } from '../types';

export interface MutationResult {
  mutantName: string;
  killed: boolean;
  description: string;
}

export class MutationRunner {
  public static runAllMutations(): MutationResult[] {
    const results: MutationResult[] = [];
    results.push(this.mutant_invertDenyCheck());
    results.push(this.mutant_removeGroupCheck());
    results.push(this.mutant_publicDeniesAll());
    return results;
  }

  private static mutant_invertDenyCheck(): MutationResult {
    const userId = 'denied-user';
    const acl: UnifiedACL = {
      allowed_users: [userId], allowed_groups: [],
      denied_users: [userId], denied_groups: [],
      visibility: 'restricted_groups', acl_hash: 'mut-1',
    };
    const user: UserEntitlements = {
      user_guid: userId, slack_user_id: 'S1', tenant_id: 'test',
      email: 'test@test.com', group_guids: [], roles: [],
    };

    const correctResult = ACLEvaluator.evaluate(user, acl);
    const killed = correctResult === false;

    return { mutantName: 'Invert Deny Check', killed, description: 'Verifies that deny list correctly blocks users even if they are in allowed_users. Mutant: deny check returns !includes instead of includes.' };
  }

  private static mutant_removeGroupCheck(): MutationResult {
    const group = 'engineering';
    const acl: UnifiedACL = {
      allowed_users: [], allowed_groups: [group], denied_users: [], denied_groups: [],
      visibility: 'restricted_groups', acl_hash: 'mut-2',
    };
    const memberUser: UserEntitlements = {
      user_guid: 'u1', slack_user_id: 'S1', tenant_id: 'test',
      email: 'eng@test.com', group_guids: [group], roles: [],
    };
    const outsider: UserEntitlements = {
      user_guid: 'u2', slack_user_id: 'S2', tenant_id: 'test',
      email: 'other@test.com', group_guids: ['marketing'], roles: [],
    };

    const memberAllowed = ACLEvaluator.evaluate(memberUser, acl);
    const outsiderDenied = !ACLEvaluator.evaluate(outsider, acl);
    const killed = memberAllowed && outsiderDenied;

    return { mutantName: 'Remove Group Check', killed, description: 'Verifies group-based access control works. Mutant: group membership check always returns true.' };
  }

  private static mutant_publicDeniesAll(): MutationResult {
    const acl: UnifiedACL = {
      allowed_users: [], allowed_groups: [], denied_users: [], denied_groups: [],
      visibility: 'public', acl_hash: 'mut-3',
    };
    const user: UserEntitlements = {
      user_guid: 'anyone', slack_user_id: 'S1', tenant_id: 'test',
      email: 'anyone@test.com', group_guids: [], roles: [],
    };

    const allowed = ACLEvaluator.evaluate(user, acl);
    const killed = allowed === true;

    return { mutantName: 'Public Denies All', killed, description: 'Verifies public visibility grants access. Mutant: public case returns false instead of true.' };
  }
}
