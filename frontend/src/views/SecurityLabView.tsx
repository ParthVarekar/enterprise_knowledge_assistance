import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  FileText, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Terminal, 
  Copy, 
  Check, 
  Filter, 
  Zap, 
  Key,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { PRESET_PERSONAS, UserPersona } from '../mockEngine/engineAdapter';

export const SecurityLabView: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(PRESET_PERSONAS[0]);
  const [targetDoc, setTargetDoc] = useState<string>('GDRIVE-002');
  const [customGroups, setCustomGroups] = useState<string>('engineering, devops');
  const [clearanceLevel, setClearanceLevel] = useState<number>(4);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [evalLog, setEvalLog] = useState<string>('Select parameters and run Live Evaluation Sandbox.');

  const DOCUMENTS = [
    { id: 'CONF-001', title: 'API Gateway Architecture', classification: 'Internal', minLevel: 2, allowed: ['engineering', 'devops'] },
    { id: 'CONF-002', title: 'Deployment Runbook', classification: 'Confidential', minLevel: 3, allowed: ['devops', 'engineering'] },
    { id: 'GDRIVE-001', title: 'Engineering Onboarding Guide', classification: 'Internal', minLevel: 2, allowed: ['all-employees'] },
    { id: 'GDRIVE-002', title: 'Restricted Customer DPA', classification: 'Restricted', minLevel: 4, allowed: ['legal-team', 'executives'] },
    { id: 'ZD-001', title: 'Public MFA Setup Guide', classification: 'Public', minLevel: 1, allowed: [] },
  ];

  const currentDocObj = DOCUMENTS.find(d => d.id === targetDoc) || DOCUMENTS[3];
  
  const parsedGroups = customGroups.split(',').map(g => g.trim()).filter(Boolean);
  const hasGroupAccess = currentDocObj.classification === 'Public' || 
                         currentDocObj.classification === 'Internal' ||
                         currentDocObj.allowed.some(g => parsedGroups.includes(g));
  const hasLevelAccess = clearanceLevel >= currentDocObj.minLevel;
  const isAccessGranted = hasGroupAccess && hasLevelAccess;

  const jsonPayload = JSON.stringify({
    timestamp: new Date().toISOString(),
    evaluator: 'EKRS-ZeroTrust-v2.4',
    subject: {
      id: selectedPersona.id,
      name: selectedPersona.name,
      assumed_role: selectedPersona.role,
      clearance_level: clearanceLevel,
      entitlement_groups: parsedGroups,
    },
    resource: {
      document_id: currentDocObj.id,
      title: currentDocObj.title,
      classification: currentDocObj.classification,
      min_clearance_required: currentDocObj.minLevel,
      required_groups: currentDocObj.allowed,
    },
    decision: {
      status: isAccessGranted ? 'ACCESS_GRANTED' : 'ACCESS_DENIED',
      http_code: isAccessGranted ? 200 : 403,
      group_check_passed: hasGroupAccess,
      level_check_passed: hasLevelAccess,
    }
  }, null, 2);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonPayload);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunEvaluation = () => {
    const timestamp = new Date().toLocaleTimeString();
    if (isAccessGranted) {
      setEvalLog(`[${timestamp}] EVALUATION PASS: User ${selectedPersona.name} (Level ${clearanceLevel}) granted access to ${currentDocObj.id} (${currentDocObj.classification}). HTTP 200.`);
    } else {
      setEvalLog(`[${timestamp}] EVALUATION FAIL: User ${selectedPersona.name} (Level ${clearanceLevel}) DENIED access to ${currentDocObj.id}. Reason: ${!hasLevelAccess ? 'Insufficient Clearance Level' : 'Missing Required Group Entitlement'}. HTTP 403.`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 light-card p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Zero-Trust ACL Lab & Security Evaluator</span>
                <span className="px-2.5 py-0.5 rounded-full badge-emerald text-xs font-mono font-bold">
                  Live Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Simulate security clearance levels and group entitlements against classified enterprise documents.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleRunEvaluation}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start md:self-auto"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Run Live Evaluation Sandbox</span>
        </button>
      </div>

      {/* Dual-Pane Split Screen Layout Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Schema Builder & Context Simulator */}
        <div className="light-card p-6 space-y-5 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Left Column: Schema Builder & Context Simulator
              </h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-600 font-semibold">Inputs & Attributes</span>
          </div>

          {/* User Persona Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
              1. Base Subject Persona
            </label>
            <select
              value={selectedPersona.id}
              onChange={(e) => {
                const p = PRESET_PERSONAS.find(item => item.id === e.target.value);
                if (p) {
                  setSelectedPersona(p);
                  setCustomGroups(p.groups.join(', '));
                  setClearanceLevel(p.clearanceLevel || 2);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {PRESET_PERSONAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.role} (Clearance Level {p.clearanceLevel || 2})
                </option>
              ))}
            </select>
          </div>

          {/* Target Document Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
              2. Target Resource Document
            </label>
            <select
              value={targetDoc}
              onChange={(e) => setTargetDoc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {DOCUMENTS.map(d => (
                <option key={d.id} value={d.id}>
                  [{d.id}] {d.title} ({d.classification} • Min L{d.minLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Clearance Level Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700">3. Evaluated Clearance Level: Level {clearanceLevel}</span>
              <span className="font-bold text-indigo-700">Req: Level {currentDocObj.minLevel}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={clearanceLevel}
              onChange={e => setClearanceLevel(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>L1 Public</span>
              <span>L2 Internal</span>
              <span>L3 Lead</span>
              <span>L4 Staff</span>
              <span>L5 Exec</span>
            </div>
          </div>

          {/* Group Entitlements Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
              4. Entitlement Group Claims (Comma Separated)
            </label>
            <input
              type="text"
              value={customGroups}
              onChange={e => setCustomGroups(e.target.value)}
              placeholder="e.g. engineering, devops, legal-team"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <div className="text-[10px] font-mono text-slate-500">
              Required for target doc: <strong className="text-indigo-700">{currentDocObj.allowed.join(', ') || 'None (Public)'}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Live Decision Engine & JSON Generator */}
        <div className="light-card p-6 space-y-5 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Right Column: Live Decision Engine & JSON
                </h3>
              </div>
              <button
                onClick={handleCopyJSON}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-mono text-slate-700 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            {/* Decision Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between shadow-2xs ${
              isAccessGranted
                ? 'badge-emerald font-bold'
                : 'badge-rose font-bold'
            }`}>
              <div className="flex items-center space-x-2.5">
                {isAccessGranted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <div>
                  <div className="text-sm font-mono font-extrabold">
                    {isAccessGranted ? 'ACCESS GRANTED (PASS) - HTTP 200' : 'ACCESS DENIED (FAIL) - HTTP 403'}
                  </div>
                  <div className="text-[11px] font-mono mt-0.5 opacity-90">
                    {isAccessGranted
                      ? `User satisfied Level ${currentDocObj.minLevel}+ requirement and group checks.`
                      : !hasLevelAccess
                        ? `Blocked by Level Gate: User Level ${clearanceLevel} < Required Level ${currentDocObj.minLevel}`
                        : `Blocked by Group Gate: Missing entitlement (${currentDocObj.allowed.join(', ')})`}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Terminal Log */}
            <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs space-y-1 border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-indigo-400" />
                <span>Live Audit Evaluation Trace</span>
              </div>
              <p className="text-emerald-400 font-mono text-[11px] leading-relaxed pt-1">
                {evalLog}
              </p>
            </div>

            {/* JSON Payload Display */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Exportable Evaluator Decision Payload
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner border border-slate-800 max-h-64">
                <code>{jsonPayload}</code>
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
