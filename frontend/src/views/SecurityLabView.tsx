import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Play } from 'lucide-react';

export const SecurityLabView: React.FC = () => {
  const [visibility, setVisibility] = useState<'public' | 'tenant_internal' | 'restricted_groups' | 'explicit_users'>('restricted_groups');
  const [allowedUsers, setAllowedUsers] = useState('user-101');
  const [allowedGroups, setAllowedGroups] = useState('engineering, devops');
  const [deniedUsers, setDeniedUsers] = useState('');
  const [testUserGroups, setTestUserGroups] = useState('engineering');
  const [testUserId, setTestUserId] = useState('user-101');

  const runACLCheck = () => {
    if (deniedUsers.split(',').map(s => s.trim()).filter(Boolean).includes(testUserId)) {
      return { allowed: false, reason: 'Explicitly blocked by Deny User List (Deny Precedence Invariant)' };
    }
    if (visibility === 'public') return { allowed: true, reason: 'Document visibility set to Public' };
    if (visibility === 'tenant_internal') return { allowed: true, reason: 'Document visibility set to Tenant Internal' };
    if (visibility === 'explicit_users') {
      const allowedList = allowedUsers.split(',').map(s => s.trim());
      const isUserAllowed = allowedList.includes(testUserId);
      return {
        allowed: isUserAllowed,
        reason: isUserAllowed ? 'User ID found in explicit allowed users list' : 'User ID not found in explicit allowed users list',
      };
    }

    const userGrpList = testUserGroups.split(',').map(s => s.trim());
    const docGrpList = allowedGroups.split(',').map(s => s.trim());
    const hasGroup = userGrpList.some(g => docGrpList.includes(g));

    return {
      allowed: hasGroup,
      reason: hasGroup
        ? `User group membership [${testUserGroups}] intersects document allowed groups [${allowedGroups}]`
        : `User group membership [${testUserGroups}] has no intersection with document allowed groups [${allowedGroups}]`,
    };
  };

  const evalResult = runACLCheck();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Zero-Trust ACL Security Evaluator Lab</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Interactively configure UnifiedACL schemas and test permission evaluation rules with real-time feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-700/80">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Document ACL Schema Configuration</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Visibility Mode</label>
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value as any)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="restricted_groups">restricted_groups (Group based)</option>
                <option value="explicit_users">explicit_users (Specific users only)</option>
                <option value="tenant_internal">tenant_internal (All employees)</option>
                <option value="public">public (Anyone)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Allowed Groups (comma separated)</label>
              <input
                type="text"
                value={allowedGroups}
                onChange={e => setAllowedGroups(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Allowed Users (comma separated)</label>
              <input
                type="text"
                value={allowedUsers}
                onChange={e => setAllowedUsers(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-rose-400 font-mono mb-1">Denied Users (Precedence Override)</label>
              <input
                type="text"
                value={deniedUsers}
                onChange={e => setDeniedUsers(e.target.value)}
                placeholder="e.g. user-101"
                className="w-full bg-slate-950/80 border border-rose-500/40 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-700/80">
          <div className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>Requesting User Entitlements</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Test User ID (user_guid)</label>
              <input
                type="text"
                value={testUserId}
                onChange={e => setTestUserId(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">User Group Memberships</label>
              <input
                type="text"
                value={testUserGroups}
                onChange={e => setTestUserGroups(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              evalResult.allowed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2 font-mono font-bold text-sm">
                {evalResult.allowed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>ACCESS GRANTED (PASS)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>ACCESS DENIED (BLOCKED)</span>
                  </>
                )}
              </div>
              <p className="text-xs font-sans leading-relaxed opacity-90">{evalResult.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
