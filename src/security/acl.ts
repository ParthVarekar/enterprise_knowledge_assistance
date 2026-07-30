import { UnifiedACL, UserEntitlements } from '../types';

export class ACLEvaluator {
  public static evaluate(user: UserEntitlements, acl: UnifiedACL): boolean {
    if (acl.denied_users && acl.denied_users.includes(user.user_guid)) {
      return false;
    }
    if (acl.denied_groups && acl.denied_groups.some(group => user.group_guids.includes(group))) {
      return false;
    }
    switch (acl.visibility) {
      case 'public':
        return true;
      case 'tenant_internal':
        return true;
      case 'explicit_users':
        return acl.allowed_users.includes(user.user_guid);
      case 'restricted_groups':
      default: {
        if (acl.allowed_users && acl.allowed_users.includes(user.user_guid)) {
          return true;
        }
        if (acl.allowed_groups && acl.allowed_groups.length > 0) {
          const hasGroupAccess = acl.allowed_groups.some(group =>
            user.group_guids.includes(group)
          );
          if (hasGroupAccess) {
            return true;
          }
        }
        return false;
      }
    }
  }

  public static filterCandidates<T extends { acl: UnifiedACL }>(
    candidates: T[],
    user: UserEntitlements
  ): T[] {
    return candidates.filter(item => this.evaluate(user, item.acl));
  }
}
