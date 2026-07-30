import { DocumentChunk, UnifiedACL, UserEntitlements, SecurityClassification, SourceSystem } from '../types';
import { ACLEvaluator } from '../security/acl';

export interface FuzzResult {
  testName: string;
  passed: boolean;
  details: string;
}

export class PayloadFuzzer {
  public static runAll(): FuzzResult[] {
    const results: FuzzResult[] = [];
    results.push(this.fuzzEmptyACL());
    results.push(this.fuzzOversizedGroups());
    results.push(this.fuzzSpecialCharacters());
    results.push(this.fuzzNullishFields());
    return results;
  }

  private static fuzzEmptyACL(): FuzzResult {
    try {
      const acl: UnifiedACL = {
        allowed_users: [], allowed_groups: [], denied_users: [], denied_groups: [],
        visibility: 'restricted_groups', acl_hash: 'empty',
      };
      const user: UserEntitlements = {
        user_guid: 'u1', slack_user_id: 'S1', tenant_id: 't1',
        email: 'test@test.com', group_guids: ['any-group'], roles: [],
      };
      const result = ACLEvaluator.evaluate(user, acl);
      return { testName: 'Empty ACL Lists', passed: result === false, details: 'Empty allowed_users and allowed_groups with restricted visibility should deny access.' };
    } catch (e: any) {
      return { testName: 'Empty ACL Lists', passed: false, details: `Threw exception: ${e.message}` };
    }
  }

  private static fuzzOversizedGroups(): FuzzResult {
    try {
      const groups = Array.from({ length: 1000 }, (_, i) => `group-${i}`);
      const acl: UnifiedACL = {
        allowed_users: [], allowed_groups: groups, denied_users: [], denied_groups: [],
        visibility: 'restricted_groups', acl_hash: 'oversized',
      };
      const user: UserEntitlements = {
        user_guid: 'u1', slack_user_id: 'S1', tenant_id: 't1',
        email: 'test@test.com', group_guids: ['group-500'], roles: [],
      };
      const result = ACLEvaluator.evaluate(user, acl);
      return { testName: 'Oversized Group Lists', passed: result === true, details: `Handled 1000 groups correctly. Access granted: ${result}` };
    } catch (e: any) {
      return { testName: 'Oversized Group Lists', passed: false, details: `Threw exception: ${e.message}` };
    }
  }

  private static fuzzSpecialCharacters(): FuzzResult {
    try {
      const specialChars = ['user<script>', 'user\'; DROP TABLE', 'user\\n\\r', 'üßér-íð', '😀-user'];
      let allPassed = true;
      for (const userId of specialChars) {
        const acl: UnifiedACL = {
          allowed_users: [userId], allowed_groups: [], denied_users: [], denied_groups: [],
          visibility: 'explicit_users', acl_hash: 'special',
        };
        const user: UserEntitlements = {
          user_guid: userId, slack_user_id: 'S1', tenant_id: 't1',
          email: 'test@test.com', group_guids: [], roles: [],
        };
        if (!ACLEvaluator.evaluate(user, acl)) allPassed = false;
      }
      return { testName: 'Special Characters in IDs', passed: allPassed, details: `Tested ${specialChars.length} special character patterns.` };
    } catch (e: any) {
      return { testName: 'Special Characters in IDs', passed: false, details: `Threw exception: ${e.message}` };
    }
  }

  private static fuzzNullishFields(): FuzzResult {
    try {
      const acl: UnifiedACL = {
        allowed_users: [], allowed_groups: [], denied_users: [], denied_groups: [],
        visibility: 'public', acl_hash: '',
      };
      const user: UserEntitlements = {
        user_guid: '', slack_user_id: '', tenant_id: '',
        email: '', group_guids: [], roles: [],
      };
      const result = ACLEvaluator.evaluate(user, acl);
      return { testName: 'Nullish/Empty Fields', passed: result === true, details: 'Public documents should be accessible even with empty user fields.' };
    } catch (e: any) {
      return { testName: 'Nullish/Empty Fields', passed: false, details: `Threw exception: ${e.message}` };
    }
  }
}
