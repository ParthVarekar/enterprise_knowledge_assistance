# Security Model

The Enterprise Knowledge Assistant implements a **Zero-Trust** security architecture where no document access is assumed — every retrieval is verified.

## Defense-in-Depth Layers

### Layer 1: Static ACL Evaluation

**Class**: `ACLEvaluator` in `src/security/acl.ts`

This layer performs fast, in-memory permission checks against the document's stored ACL.

#### Algorithm
```
1. IF user is in denied_users → DENY
2. IF user's groups intersect denied_groups → DENY
3. SWITCH on visibility:
   - public → ALLOW
   - tenant_internal → ALLOW
   - explicit_users → ALLOW if user in allowed_users
   - restricted_groups → ALLOW if user in allowed_users OR user's groups intersect allowed_groups
4. DEFAULT → DENY
```

**Critical property**: Deny lists always take precedence over allow lists. This is verified by the Aegis-QA Deny Precedence Invariant.

### Layer 2: Live Permission Gate

**Class**: `LivePermissionGate` in `src/security/livePermissionGate.ts`

This layer verifies permissions against the source system's live API, catching changes since the last sync.

#### Caching
- Permissions are cached with a configurable TTL (default: 300 seconds)
- Cache key: `{user_guid}:{document_id}:{acl_hash}`
- Cache can be bypassed per-request

#### Flow
```
1. Check cache for user+document pair
2. If cache hit and not expired → use cached result
3. If cache miss → run static ACL check
4. If static check passes → call source API
5. Cache the result
6. Return verified candidates
```

## UnifiedACL Schema

| Field | Type | Purpose |
|-------|------|--------|
| `allowed_users` | `string[]` | User GUIDs with explicit access |
| `allowed_groups` | `string[]` | Group GUIDs with access |
| `denied_users` | `string[]` | Explicitly denied users (takes precedence) |
| `denied_groups` | `string[]` | Explicitly denied groups (takes precedence) |
| `visibility` | `VisibilityMode` | Access scope |
| `acl_hash` | `string` | Content-addressable ACL fingerprint |

## Security Classification

Documents carry a `SecurityClassification` that affects how the Live Permission Gate handles them:

| Classification | Gate Behavior |
|---------------|---------------|
| `public` | Static check only |
| `internal` | Static check + tenant verification |
| `confidential` | Static check + source API |
| `restricted` | Full ACL re-evaluation against live source |

## Audit Trail

Every access decision is logged in the `AuditLedger`:
- `acl_deny` events record denied access attempts
- `retrieval` events record what was returned
- `answer_served` events record what the user saw

This creates a complete compliance trail for SOC2/ISO27001 audits.
