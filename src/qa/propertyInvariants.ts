import { ACLEvaluator } from '../security/acl';
import { UnifiedACL, UserEntitlements, DocumentChunk } from '../types';

export interface InvariantResult {
  name: string;
  passed: boolean;
  iterations: number;
  failures: string[];
}

export class PropertyInvariants {
  public static securitySymmetryInvariant(iterations: number = 100): InvariantResult {
    const failures: string[] = [];
    for (let i = 0; i < iterations; i++) {
      const group = `group-${Math.random().toString(36).substring(2, 6)}`;
      const userId = `user-${Math.random().toString(36).substring(2, 6)}`;

      const acl: UnifiedACL = {
        allowed_users: [], allowed_groups: [group], denied_users: [], denied_groups: [],
        visibility: 'restricted_groups', acl_hash: `hash-${i}`,
      };

      const memberUser: UserEntitlements = {
        user_guid: userId, slack_user_id: 'S1', tenant_id: 'test',
        email: 'test@test.com', group_guids: [group], roles: [],
      };

      const nonMemberUser: UserEntitlements = {
        user_guid: userId + '-other', slack_user_id: 'S2', tenant_id: 'test',
        email: 'other@test.com', group_guids: ['different-group'], roles: [],
      };

      const memberResult = ACLEvaluator.evaluate(memberUser, acl);
      const nonMemberResult = ACLEvaluator.evaluate(nonMemberUser, acl);

      if (!memberResult) {
        failures.push(`Iteration ${i}: Member of '${group}' was denied access`);
      }
      if (nonMemberResult) {
        failures.push(`Iteration ${i}: Non-member accessed '${group}' restricted doc`);
      }
    }

    return { name: 'Security Symmetry Invariant', passed: failures.length === 0, iterations, failures };
  }

  public static denyListPrecedenceInvariant(iterations: number = 50): InvariantResult {
    const failures: string[] = [];
    for (let i = 0; i < iterations; i++) {
      const userId = `user-deny-${i}`;
      const group = `group-${i}`;

      const acl: UnifiedACL = {
        allowed_users: [userId], allowed_groups: [group],
        denied_users: [userId], denied_groups: [],
        visibility: 'restricted_groups', acl_hash: `hash-deny-${i}`,
      };

      const user: UserEntitlements = {
        user_guid: userId, slack_user_id: 'S1', tenant_id: 'test',
        email: 'test@test.com', group_guids: [group], roles: [],
      };

      const result = ACLEvaluator.evaluate(user, acl);
      if (result) {
        failures.push(`Iteration ${i}: User ${userId} on deny list was granted access`);
      }
    }

    return { name: 'Deny List Precedence Invariant', passed: failures.length === 0, iterations, failures };
  }

  public static publicVisibilityInvariant(iterations: number = 50): InvariantResult {
    const failures: string[] = [];
    for (let i = 0; i < iterations; i++) {
      const acl: UnifiedACL = {
        allowed_users: [], allowed_groups: [], denied_users: [], denied_groups: [],
        visibility: 'public', acl_hash: `hash-pub-${i}`,
      };

      const user: UserEntitlements = {
        user_guid: `random-user-${Math.random()}`, slack_user_id: 'S1',
        tenant_id: 'test', email: 'anyone@test.com', group_guids: [], roles: [],
      };

      if (!ACLEvaluator.evaluate(user, acl)) {
        failures.push(`Iteration ${i}: Public document denied to random user`);
      }
    }

    return { name: 'Public Visibility Invariant', passed: failures.length === 0, iterations, failures };
  }
}
