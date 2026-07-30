import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Copy, 
  Check, 
  User, 
  Users as GroupIcon, 
  ShieldAlert, 
  Key, 
  FileCode, 
  Layers, 
  Zap, 
  Globe, 
  RefreshCw 
} from 'lucide-react';

type VisibilityMode = 'restricted_groups' | 'explicit_users' | 'tenant_internal' | 'public' | 'confidential_executive';
type SecurityClearance = 'Unclassified' | 'Confidential' | 'Restricted' | 'Secret' | 'Top Secret';

interface ACLPreset {
  name: string;
  desc: string;
  visibility: VisibilityMode;
  allowedGroups: string;
  allowedUsers: string;
  deniedUsers: string;
  clearance: SecurityClearance;
  tenantId: string;
}

const PRESETS: ACLPreset[] = [
  {
    name: '🛠️ Engineering Architecture Doc',
    desc: 'Restricted to engineering & devops groups with Secret clearance required.',
    visibility: 'restricted_groups',
    allowedGroups: 'engineering, devops',
    allowedUsers: 'user-101',
    deniedUsers: '',
    clearance: 'Secret',
    tenantId: 'tenant-acme-corp',
  },
  {
    name: '🔒 Executive Board Memo',
    desc: 'Strictly restricted to executive group with Top Secret clearance requirement.',
    visibility: 'confidential_executive',
    allowedGroups: 'executive, board',
    allowedUsers: 'sarah.ceo@acme.com',
    deniedUsers: '',
    clearance: 'Top Secret',
    tenantId: 'tenant-acme-corp',
  },
  {
    name: '🌐 Public FAQ & Release Notes',
    desc: 'Unclassified public knowledge base document accessible by anyone.',
    visibility: 'public',
    allowedGroups: '',
    allowedUsers: '',
    deniedUsers: '',
    clearance: 'Unclassified',
    tenantId: 'tenant-acme-corp',
  },
  {
    name: '🚫 Deny Precedence Edge Case',
    desc: 'User user-999 is in engineering group but explicitly denied via override invariant.',
    visibility: 'restricted_groups',
    allowedGroups: 'engineering, devops',
    allowedUsers: '',
    deniedUsers: 'user-999',
    clearance: 'Confidential',
    tenantId: 'tenant-acme-corp',
  },
];

const CLEARANCE_RANKS: Record<SecurityClearance, number> = {
  'Unclassified': 0,
  'Confidential': 1,
  'Restricted': 2,
  'Secret': 3,
  'Top Secret': 4,
};

export const SecurityLabView: React.FC = () => {
  // Schema configuration state
  const [visibility, setVisibility] = useState<VisibilityMode>('restricted_groups');
  const [allowedGroups, setAllowedGroups] = useState('engineering, devops');
  const [allowedUsers, setAllowedUsers] = useState('user-101');
  const [deniedUsers, setDeniedUsers] = useState('');
  const [docClearance, setDocClearance] = useState<SecurityClearance>('Secret');
  const [docTenantId, setDocTenantId] = useState('tenant-acme-corp');

  // Requesting user entitlement state
  const [testUserId, setTestUserId] = useState('user-101');
  const [testUserGroups, setTestUserGroups] = useState('engineering');
  const [testUserClearance, setTestUserClearance] = useState<SecurityClearance>('Secret');
  const [testUserTenantId, setTestUserTenantId] = useState('tenant-acme-corp');
  const [mfaVerified, setMfaVerified] = useState(true);
  const [corporateVpn, setCorporateVpn] = useState(true);

  // UI state
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(PRESETS[0].name);

  // Apply predefined preset
  const applyPreset = (preset: ACLPreset) => {
    setActivePreset(preset.name);
    setVisibility(preset.visibility);
    setAllowedGroups(preset.allowedGroups);
    setAllowedUsers(preset.allowedUsers);
    setDeniedUsers(preset.deniedUsers);
    setDocClearance(preset.clearance);
    setDocTenantId(preset.tenantId);
  };

  // Evaluate ACL Rules
  const runACLCheck = () => {
    const steps: { name: string; status: 'PASS' | 'BLOCKED'; detail: string }[] = [];

    // Step 1: Tenant Isolation Check
    if (visibility !== 'public' && testUserTenantId !== docTenantId) {
      steps.push({
        name: 'Step 1: Tenant Boundary Verification',
        status: 'BLOCKED',
        detail: `Tenant Mismatch! User tenant [${testUserTenantId}] does not match document tenant [${docTenantId}].`,
      });
      return {
        allowed: false,
        reason: `Cross-Tenant Isolation Invariant Violation: Requesting user tenant (${testUserTenantId}) is forbidden from accessing document owned by (${docTenantId}).`,
        steps,
        failedStep: 1,
      };
    } else {
      steps.push({
        name: 'Step 1: Tenant Boundary Verification',
        status: 'PASS',
        detail: `User tenant [${testUserTenantId}] matches document tenant boundary [${docTenantId}].`,
      });
    }

    // Step 2: Deny Precedence Invariant Check
    const deniedList = deniedUsers.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (deniedList.includes(testUserId.trim().toLowerCase())) {
      steps.push({
        name: 'Step 2: Explicit Deny List Precedence',
        status: 'BLOCKED',
        detail: `User ID [${testUserId}] found in document explicit Deny list. Deny Precedence rule overrides all allow conditions.`,
      });
      return {
        allowed: false,
        reason: `Explicit Deny Precedence Invariant Enforced: User ID (${testUserId}) is explicitly blocked by document security policy override.`,
        steps,
        failedStep: 2,
      };
    } else {
      steps.push({
        name: 'Step 2: Explicit Deny List Precedence',
        status: 'PASS',
        detail: `User ID [${testUserId}] is not present on the explicit deny list.`,
      });
    }

    // Step 3: Security Clearance Verification
    const docRank = CLEARANCE_RANKS[docClearance];
    const userRank = CLEARANCE_RANKS[testUserClearance];
    if (userRank < docRank) {
      steps.push({
        name: 'Step 3: Security Clearance Rank',
        status: 'BLOCKED',
        detail: `User clearance level [${testUserClearance}] is below document required clearance [${docClearance}].`,
      });
      return {
        allowed: false,
        reason: `Insufficient Security Clearance: User clearance level (${testUserClearance}) fails to meet document clearance requirement (${docClearance}).`,
        steps,
        failedStep: 3,
      };
    } else {
      steps.push({
        name: 'Step 3: Security Clearance Rank',
        status: 'PASS',
        detail: `User clearance level [${testUserClearance}] satisfies or exceeds document requirement [${docClearance}].`,
      });
    }

    // Step 4: Visibility & Entitlement Evaluation
    if (visibility === 'public') {
      steps.push({
        name: 'Step 4: Entitlements & Visibility Evaluation',
        status: 'PASS',
        detail: 'Document visibility set to Public. Granted access to all requesting clients.',
      });
      return {
        allowed: true,
        reason: 'Visibility Mode set to Public: Unrestricted access granted to public document.',
        steps,
      };
    }

    if (visibility === 'tenant_internal') {
      steps.push({
        name: 'Step 4: Entitlements & Visibility Evaluation',
        status: 'PASS',
        detail: `Document visibility set to Tenant Internal. User belongs to verified tenant [${testUserTenantId}].`,
      });
      return {
        allowed: true,
        reason: `Tenant Internal Access Granted: User belongs to organization tenant (${testUserTenantId}).`,
        steps,
      };
    }

    if (visibility === 'explicit_users') {
      const allowedUserList = allowedUsers.split(',').map(s => s.trim().toLowerCase());
      const isUserAllowed = allowedUserList.includes(testUserId.trim().toLowerCase());
      if (isUserAllowed) {
        steps.push({
          name: 'Step 4: Entitlements & Visibility Evaluation',
          status: 'PASS',
          detail: `User ID [${testUserId}] matched explicit allowed user list.`,
        });
        return {
          allowed: true,
          reason: `Explicit User Entitlement Match: User ID (${testUserId}) found in document's explicit allowed users whitelist.`,
          steps,
        };
      } else {
        steps.push({
          name: 'Step 4: Entitlements & Visibility Evaluation',
          status: 'BLOCKED',
          detail: `User ID [${testUserId}] not found in explicit allowed users whitelist [${allowedUsers}].`,
        });
        return {
          allowed: false,
          reason: `User Whitelist Evaluation Failure: User ID (${testUserId}) is not present in document allowed users whitelist.`,
          steps,
          failedStep: 4,
        };
      }
    }

    // Restricted Groups & Confidential Executive Evaluation
    const userGrpList = testUserGroups.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const docGrpList = allowedGroups.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const matchingGroups = userGrpList.filter(g => docGrpList.includes(g));

    if (matchingGroups.length > 0) {
      steps.push({
        name: 'Step 4: Entitlements & Visibility Evaluation',
        status: 'PASS',
        detail: `Group membership intersection found: [${matchingGroups.join(', ')}].`,
      });
      return {
        allowed: true,
        reason: `Group Entitlement Intersection Matched: User group memberships [${testUserGroups}] intersect document allowed groups [${allowedGroups}] (Matched: ${matchingGroups.join(', ')}).`,
        steps,
      };
    } else {
      steps.push({
        name: 'Step 4: Entitlements & Visibility Evaluation',
        status: 'BLOCKED',
        detail: `No group membership intersection between user groups [${testUserGroups}] and document required groups [${allowedGroups}].`,
      });
      return {
        allowed: false,
        reason: `Group Entitlement Disjoint Violation: User group memberships [${testUserGroups}] share no intersection with document required groups [${allowedGroups}].`,
        steps,
        failedStep: 4,
      };
    }
  };

  const evalResult = runACLCheck();

  // Generated UnifiedACL JSON representation
  const generatedSchema = {
    schema_version: 'v2.4-unified',
    tenant_id: docTenantId,
    visibility_mode: visibility,
    clearance_level: docClearance,
    entitlements: {
      allowed_groups: allowedGroups.split(',').map(s => s.trim()).filter(Boolean),
      allowed_users: allowedUsers.split(',').map(s => s.trim()).filter(Boolean),
      denied_users_override: deniedUsers.split(',').map(s => s.trim()).filter(Boolean),
    },
    invariants_enforced: [
      'DenyPrecedenceRule',
      'StrictTenantIsolation',
      'ClearanceHierarchyCheck',
    ],
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedSchema, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span>UnifiedACL Security Evaluator & Sandbox</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Zero-Trust Core
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactively construct document entitlement schemas and evaluate request context against security invariants with real-time pass/blocked feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Persona Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Quick Persona:</span>
          <button
            onClick={() => {
              setTestUserId('user-101');
              setTestUserGroups('engineering, devops');
              setTestUserClearance('Secret');
              setTestUserTenantId('tenant-acme-corp');
            }}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Alex (Eng Lead)
          </button>
          <button
            onClick={() => {
              setTestUserId('jordan.vendor@external.com');
              setTestUserGroups('contractor');
              setTestUserClearance('Unclassified');
              setTestUserTenantId('tenant-external-inc');
            }}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Jordan (Vendor)
          </button>
          <button
            onClick={() => {
              setTestUserId('user-999');
              setTestUserGroups('engineering');
              setTestUserClearance('Confidential');
              setTestUserTenantId('tenant-acme-corp');
            }}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/50 transition-colors"
          >
            Blocked Insider
          </button>
        </div>
      </div>

      {/* Preset Selector Banner */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>ACL Schema Scenario Presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`p-3 text-left rounded-xl border transition-all text-xs ${
                activePreset === preset.name
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-100 mb-1">{preset.name}</div>
              <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Schema Builder (Left) & Request Evaluator Sandbox (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schema Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2 font-bold">
                <Lock className="w-4 h-4" />
                <span>1. UnifiedACL Document Schema Builder</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Schema: {docTenantId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Visibility Mode Select */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-slate-300 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visibility Mode</span>
                </label>
                <select
                  value={visibility}
                  onChange={e => {
                    setActivePreset(null);
                    setVisibility(e.target.value as VisibilityMode);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="restricted_groups">restricted_groups (Group-Based Entitlements)</option>
                  <option value="explicit_users">explicit_users (Specific User Whitelist Only)</option>
                  <option value="tenant_internal">tenant_internal (All Organization Employees)</option>
                  <option value="confidential_executive">confidential_executive (Executive Board Only)</option>
                  <option value="public">public (Unrestricted / Public Access)</option>
                </select>
              </div>

              {/* Allowed Groups */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-slate-300 font-medium flex items-center gap-1.5">
                  <GroupIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Allowed Groups (comma separated)</span>
                </label>
                <input
                  type="text"
                  value={allowedGroups}
                  onChange={e => {
                    setActivePreset(null);
                    setAllowedGroups(e.target.value);
                  }}
                  placeholder="e.g. engineering, devops, security"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Allowed Users Whitelist */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Allowed Users Whitelist</span>
                </label>
                <input
                  type="text"
                  value={allowedUsers}
                  onChange={e => {
                    setActivePreset(null);
                    setAllowedUsers(e.target.value);
                  }}
                  placeholder="e.g. user-101, alex@acme.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Explicit Denied Users (Precedence Override) */}
              <div className="space-y-1.5">
                <label className="block text-rose-300 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Explicit Denied Users (Override)</span>
                </label>
                <input
                  type="text"
                  value={deniedUsers}
                  onChange={e => {
                    setActivePreset(null);
                    setDeniedUsers(e.target.value);
                  }}
                  placeholder="e.g. user-999, terminated_user"
                  className="w-full bg-slate-950 border border-rose-900/60 rounded-xl px-3 py-2 text-rose-200 font-mono text-xs focus:outline-none focus:border-rose-500 transition-colors placeholder:text-rose-950"
                />
              </div>

              {/* Security Clearance Requirement */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Document Clearance Requirement</span>
                </label>
                <select
                  value={docClearance}
                  onChange={e => setDocClearance(e.target.value as SecurityClearance)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Unclassified">Unclassified (Public / Low)</option>
                  <option value="Confidential">Confidential (Internal)</option>
                  <option value="Restricted">Restricted (Sensitive)</option>
                  <option value="Secret">Secret (High Risk)</option>
                  <option value="Top Secret">Top Secret (Critical)</option>
                </select>
              </div>

              {/* Tenant Identifier */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Owner Tenant ID</span>
                </label>
                <input
                  type="text"
                  value={docTenantId}
                  onChange={e => setDocTenantId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Generated Schema JSON View */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Generated Schema Payload (JSON)</span>
              </div>
              <button
                onClick={handleCopySchema}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied!' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-[11px] font-mono text-cyan-300 overflow-x-auto border border-slate-900 leading-relaxed">
              {JSON.stringify(generatedSchema, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right Column: Request Entitlement Evaluator & Evaluation Trace (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Entitlement Request Simulator Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2 font-bold border-b border-slate-800 pb-3">
              <Play className="w-4 h-4" />
              <span>2. Requesting User Context Simulator</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Requesting User ID (user_guid)</label>
                <input
                  type="text"
                  value={testUserId}
                  onChange={e => setTestUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">User Group Memberships</label>
                <input
                  type="text"
                  value={testUserGroups}
                  onChange={e => setTestUserGroups(e.target.value)}
                  placeholder="e.g. engineering, devops"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">User Clearance</label>
                  <select
                    value={testUserClearance}
                    onChange={e => setTestUserClearance(e.target.value as SecurityClearance)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="Unclassified">Unclassified</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Secret">Secret</option>
                    <option value="Top Secret">Top Secret</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">User Tenant ID</label>
                  <input
                    type="text"
                    value={testUserTenantId}
                    onChange={e => setTestUserTenantId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Context Security Toggles */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mfaVerified}
                    onChange={e => setMfaVerified(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>MFA Verified Session</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={corporateVpn}
                    onChange={e => setCorporateVpn(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Corporate VPN Origin</span>
                </label>
              </div>
            </div>
          </div>

          {/* Instant Evaluation Feedback Result Banner */}
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
              evalResult.allowed
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                : 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 font-mono font-bold text-sm">
                  {evalResult.allowed ? (
                    <>
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 animate-pulse">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-emerald-400 text-base">ACCESS GRANTED (PASS)</div>
                        <div className="text-[10px] font-sans text-emerald-300 font-normal">Zero-Trust Evaluator Decision</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 animate-pulse">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-rose-400 text-base">ACCESS DENIED (BLOCKED)</div>
                        <div className="text-[10px] font-sans text-rose-300 font-normal">Zero-Trust Evaluator Decision</div>
                      </div>
                    </>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                  evalResult.allowed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {evalResult.allowed ? 'HTTP 200' : 'HTTP 403'}
                </span>
              </div>

              <p className={`text-xs leading-relaxed font-mono p-3 rounded-xl ${
                evalResult.allowed ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-900/50' : 'bg-rose-950/60 text-rose-200 border border-rose-900/50'
              }`}>
                {evalResult.reason}
              </p>
            </div>

            {/* Evaluation Trace Steps Breakdown */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Evaluation Pipeline Trace</span>
                <span className="text-[10px] text-cyan-400 font-semibold">{evalResult.steps.length} Checks Run</span>
              </div>

              <div className="space-y-2">
                {evalResult.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                      step.status === 'PASS'
                        ? 'bg-slate-950/70 border-emerald-900/40 text-slate-300'
                        : 'bg-rose-950/40 border-rose-900/80 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-semibold">
                      <span className="flex items-center gap-1.5">
                        {step.status === 'PASS' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span>{step.name}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        step.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans pl-5 leading-snug">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
