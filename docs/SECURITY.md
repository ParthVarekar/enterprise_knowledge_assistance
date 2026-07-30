# Enterprise Security & Zero-Trust Access Control Model

This document specifies the security architecture, access control logic, verification algorithms, and compliance audit ledger mechanics of the Enterprise Knowledge Assistant.

---

## 1. Zero-Trust Security Philosophy & Defense-in-Depth Architecture

The Enterprise Knowledge Assistant operates on a strict **Zero-Trust Security Philosophy**:
* **Never Trust Pre-Indexed ACLs Implicitly**: Source system permissions are dynamic. User roles are modified, files are un-shared, and tickets are restricted after ingestion.
* **Deny-by-Default Posture**: Access is explicitly prohibited unless affirmative authorization conditions are proven.
* **Multi-Tenant Isolation**: Tenant boundaries (`tenant_id`) are immutable and isolated across indexing, storage, retrieval, and audit logging.

### 1.1 Dual-Layer Defense-in-Depth Architecture

To balance sub-millisecond retrieval performance with dynamic source permissions, access control is split into two complementary layers:

```
                            +----------------------------------------+
                            |          Incoming User Query           |
                            |   (UserEntitlements + query text)      |
                            +----------------------------------------+
                                                |
                                                v
                            +----------------------------------------+
                            |       LAYER 1: Static In-Memory        |
                            |            ACL Evaluation              |
                            |        [src/security/acl.ts]           |
                            +----------------------------------------+
                                                |
                             +------------------+------------------+
                             |                                     |
                             v                                     v
                     [Static Check PASS]                   [Static Check DENY]
                             |                                     |
                             v                                     v
            +----------------------------------+        +--------------------+
            |      Candidate Dense Vector      |        | Filter Candidate   |
            |     Cosine Similarity Search     |        | Record `acl_deny`  |
            +----------------------------------+        +--------------------+
                             |
                             v
            +----------------------------------+
            |    LAYER 2: Live Permission Gate |
            | [src/security/livePermissionGate] |
            +----------------------------------+
                             |
         +-------------------+-------------------+
         |                                       |
  [TTL Cache Hit]                         [TTL Cache Miss]
         |                                       |
         ├─► Allowed: Retain Candidate           ├─► Evaluate Static ACL
         └─► Denied:  Filter Candidate           └─► IF Security Classification == 'restricted'
                                                     THEN Re-Verify Live Source API
                                                 └─► Update TTL Permission Cache
                                                         |
                                                         v
                                              +-----------------------+
                                              | Final Verified Chunks |
                                              +-----------------------+
```

---

## 2. Formal Specification of `ACLEvaluator` Rules

The static access control evaluator [`ACLEvaluator`](file:///c:/Users/Parth/Desktop/airlearn/src/security/acl.ts#L3-L42) evaluates user entitlements against a document chunk's [`UnifiedACL`](file:///c:/Users/Parth/Desktop/airlearn/src/types/index.ts#L5-L12).

### 2.1 The Deny Precedence Invariant

> **Fundamental Security Invariant**: Deny rules ALWAYS take absolute precedence over allow rules, explicit user access lists, group permissions, or visibility modes.

If a user GUID appears in `denied_users` OR if any of the user's `group_guids` appear in `denied_groups`, the document chunk MUST be immediately rejected regardless of any other permission setting.

```
Rule 1 (User Deny):   user_guid ∈ acl.denied_users ==> DENY
Rule 2 (Group Deny):  (user.group_guids ∩ acl.denied_groups) ≠ ∅ ==> DENY
```

This invariant is formally validated by Aegis-QA via [`PropertyInvariants.denyListPrecedenceInvariant()`](file:///c:/Users/Parth/Desktop/airlearn/src/qa/propertyInvariants.ts#L47-L71) and security mutation testing in [`MutationRunner.mutant_invertDenyCheck()`](file:///c:/Users/Parth/Desktop/airlearn/src/qa/mutationRunner.ts#L19-L36).

---

### 2.2 Mathematical Boolean Evaluation Function

Let:
* $u \in \text{UserGUIDs}$ be the requesting user's GUID (`user.user_guid`).
* $G_{\text{user}} \subset \text{GroupGUIDs}$ be the set of groups to which the user belongs (`user.group_guids`).
* $U_{\text{denied}} = \text{acl.denied\_users}$
* $G_{\text{denied}} = \text{acl.denied\_groups}$
* $U_{\text{allowed}} = \text{acl.allowed\_users}$
* $G_{\text{allowed}} = \text{acl.allowed\_groups}$
* $V = \text{acl.visibility} \in \{\text{'public'}, \text{'tenant\_internal'}, \text{'explicit\_users'}, \text{'restricted\_groups'}\}$

The evaluation decision function $\text{Eval}(u, G_{\text{user}}, \text{ACL}) \in \{\text{true}, \text{false}\}$ is defined as:

$$\text{Eval}(u, G_{\text{user}}, \text{ACL}) = \neg \Big( u \in U_{\text{denied}} \lor (G_{\text{user}} \cap G_{\text{denied}} \neq \emptyset) \Big) \land \text{VisibilityMatch}(u, G_{\text{user}}, \text{ACL})$$

Where:

$$\text{VisibilityMatch}(u, G_{\text{user}}, \text{ACL}) = \begin{cases} 
\text{true} & \text{if } V = \text{'public'} \\
\text{true} & \text{if } V = \text{'tenant\_internal'} \\
u \in U_{\text{allowed}} & \text{if } V = \text{'explicit\_users'} \\
(u \in U_{\text{allowed}}) \lor (G_{\text{user}} \cap G_{\text{allowed}} \neq \emptyset) & \text{if } V = \text{'restricted\_groups'}
\end{cases}$$

---

### 2.3 Truth Table for Permission Resolution

| `u ∈ U_denied` | `G_user ∩ G_denied ≠ ∅` | `visibility` Mode | `u ∈ U_allowed` | `G_user ∩ G_allowed ≠ ∅` | Final Access Decision |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **True** | *Any* | *Any* | *Any* | *Any* | 🛑 **DENY** |
| *Any* | **True** | *Any* | *Any* | *Any* | 🛑 **DENY** |
| False | False | `public` | *Any* | *Any* | ✅ **ALLOW** |
| False | False | `tenant_internal` | *Any* | *Any* | ✅ **ALLOW** |
| False | False | `explicit_users` | **True** | *Any* | ✅ **ALLOW** |
| False | False | `explicit_users` | **False** | *Any* | 🛑 **DENY** |
| False | False | `restricted_groups` | **True** | False | ✅ **ALLOW** |
| False | False | `restricted_groups` | False | **True** | ✅ **ALLOW** |
| False | False | `restricted_groups` | False | False | 🛑 **DENY** |

---

## 3. `LivePermissionGate` Specification & Cache Architecture

The [`LivePermissionGate`](file:///c:/Users/Parth/Desktop/airlearn/src/security/livePermissionGate.ts#L9-L47) guarantees that documents tagged with elevated security classifications undergo dynamic re-verification against source system APIs.

### 3.1 Verification Algorithm Flowchart

```
                 verifyCandidates(candidates, user, options)
                                     │
                                     ▼
                      For each DocumentChunk in candidates
                                     │
                                     ▼
           Construct cacheKey = `${user_guid}:${doc_id}:${acl_hash}`
                                     │
                                     ▼
              Is bypassCache == false AND permissionCache.has(key)?
                                 /       \
                               /           \
                             YES           NO
                             /               \
                            v                 v
            (Date.now() - cached.ts) < TTL?    ACLEvaluator.evaluate(user, chunk.acl)
                       /       \                          |
                     YES       NO                         v
                     /           \                Did static check PASS?
                    v             v                      /         \
          Return cached.allowed  Evict                  YES        NO
                                Cache                  /             \
                                  │                   v               v
                                  └────────► Is classification ==    Set Cache FALSE
                                             'restricted'?           Return DENY
                                                /        \
                                              YES        NO
                                              /            \
                                             v              v
                                  performSourceAPICheck()  Set Cache TRUE
                                  (Re-verify live API)    Return ALLOW
                                             │
                                             v
                                    Update permissionCache
                                    Return API result
```

---

### 3.2 Cache Key Topology & TTL Mechanics

Permissions are cached in an in-memory `Map<string, { allowed: boolean; timestamp: number }>` data structure.

```typescript
const cacheKey = `${user.user_guid}:${chunk.document_id}:${chunk.acl.acl_hash}`;
```

#### Key Components:
1. `user_guid`: Isolates cached permissions per individual user identity.
2. `document_id`: Identifies the source document entity.
3. `acl_hash`: Base36 hash fingerprint computed as `hash(visibility:allowed_users:allowed_groups)`. If a document's static ACL changes in the index, `acl_hash` mutates automatically, invalidating stale cache entries.

#### TTL Parameters:
* **Default Cache TTL**: `300 seconds` (5 minutes).
* **Bypass Trigger**: Passing `LiveVerificationOptions { bypassCache: true }` forces synchronous re-evaluation against the static evaluator and source API.

---

### 3.3 Security Classification Matrix & Gate Behavior

Documents carry a `SecurityClassification` that governs the execution depth of the Live Permission Gate:

| Security Classification | Data Sensitivity Description | Layer-1 Static Check | Layer-2 Source API Re-Verification | Cache TTL |
| :--- | :--- | :---: | :---: | :---: |
| `public` | Publicly available documentation | Executed | Skipped | 300s |
| `internal` | General internal tenant documentation | Executed | Tenant match verified | 300s |
| `confidential` | Sensitive department/project data | Executed | Evaluated via static pass-through | 300s |
| `restricted` | Highly sensitive executive / financial / PII data | Executed | **Mandatory Live Source API Call** (`performSourceAPICheck`) | Configurable / Re-evaluated |

---

## 4. Visibility Modes Matrix

The system supports four granular visibility modes:

| Visibility Mode | Target Scope | Required Entitlements | Access Rule Logic | Primary Security Risk / Threat Model |
| :--- | :--- | :--- | :--- | :--- |
| `public` | Universal public access | Valid tenant identity | Granted to any user in tenant without restriction. | Exposure of public docs; threat mitigated by tenant isolation. |
| `tenant_internal` | All internal tenant employees | Active employee account in tenant | Granted if requesting user `tenant_id` matches document `tenant_id`. | Insider threat across departments; mitigated by tenant scope checks. |
| `restricted_groups` | Specific functional teams or departments | Membership in at least one allowed group | Granted if `user.group_guids` intersects `acl.allowed_groups` OR `user.user_guid` in `acl.allowed_users`. | Horizontal privilege escalation; mitigated by group intersection verification. |
| `explicit_users` | Named individual personnel only | Explicit user GUID inclusion | Granted ONLY if `user.user_guid` exists in `acl.allowed_users`. | Over-sharing sensitive docs; mitigated by strict scalar string matching. |

---

## 5. Compliance Audit Ledger Event Specification

The [`AuditLedger`](file:///c:/Users/Parth/Desktop/airlearn/src/observability/auditLedger.ts#L12-L46) provides an immutable, append-only event stream recording every security decision, retrieval operation, and answer generation action for SOC2 Type II and ISO 27001 compliance.

### 5.1 Audit Record Schema

```typescript
export interface AuditRecord {
  timestamp: string;               // ISO-8601 UTC timestamp string
  action: AuditAction;             // Action event classifier enum
  actor: string;                   // Requesting user GUID (user.user_guid)
  tenant_id: string;               // Multi-tenant isolation ID
  details: Record<string, unknown>;// Event-specific metadata payload
  trace_id?: string;               // Unique query execution correlation ID
}
```

---

### 5.2 Audit Action Specifications

```typescript
export type AuditAction = 
  | 'query' 
  | 'acl_deny' 
  | 'retrieval' 
  | 'grounding' 
  | 'answer_generation' 
  | 'answer_served' 
  | 'answer_abstained' 
  | 'mutation_test' 
  | 'invariant_check' 
  | 'fuzz_test';
```

#### Event Breakdown Table:

| Audit Action | Triggering Event | Mandatory `details` Payload | Compliance & Audit Purpose |
| :--- | :--- | :--- | :--- |
| `query` | User submits query text via Slack or API | `{ query_text: string, query_id: string }` | Tracks ingress activity and user query intent. |
| `acl_deny` | User fails static or live security checks | `{ chunk_id: string, document_id: string, reason: string }` | SOC2 unauthorized access attempt tracking. |
| `retrieval` | Candidates returned from hybrid retriever | `{ query_id: string, candidates_found: number }` | Tracks document discovery scope per user. |
| `grounding` | NLI claim verification completed | `{ overallGroundingScore: number, unverifiedClaims: string[] }` | AI safety, hallucination, and data integrity tracking. |
| `answer_served` | Grounded answer delivered to user | `{ query_id: string, confidence: number, citations: number, abstained: false }` | SOC2 / ISO audit log of information delivered to end user. |
| `answer_abstained` | Answer refused due to low confidence | `{ query_id: string, confidence: 0, citations: 0, abstained: true }` | Proves system compliance with safety abstention rules. |
| `mutation_test` | Aegis-QA mutation test executed | `{ mutantName: string, killed: boolean, description: string }` | Security control validation audit trail. |
| `invariant_check` | Property invariant test executed | `{ name: string, iterations: number, failures: number }` | Continuous security property verification. |
| `fuzz_test` | Payload fuzzer executed | `{ testName: string, passed: boolean }` | Vulnerability & robustness testing log. |

---

### 5.3 Compliance Framework Mapping

| Regulatory Standard | Mandated Control | System Mechanism Implementation |
| :--- | :--- | :--- |
| **SOC 2 Type II** | CC6.1 (Logical Access Controls) | Enforced via `ACLEvaluator` Deny Precedence & `LivePermissionGate`. |
| **SOC 2 Type II** | CC6.8 (Unauthorized Code / Access) | Checked by Aegis-QA `MutationRunner` & `PropertyInvariants`. |
| **ISO/IEC 27001** | A.9.4.1 (Information Access Restriction) | Enforced via `VisibilityMode` matrix & group intersection checks. |
| **ISO/IEC 27001** | A.12.4.1 (Event Logging) | Guaranteed via immutable append-only `AuditLedger` logging. |
| **HIPAA** | § 164.312(b) (Audit Controls) | Correlation trace IDs (`trace_id`) tracking query -> retrieval -> served answer. |
