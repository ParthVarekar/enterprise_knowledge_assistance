import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserPersona, PRESET_PERSONAS } from '../mockEngine/engineAdapter';
import { renderCuteAvatar } from './ui/CuteIcons';
import {
  ShieldCheck,
  Cpu,
  ChevronDown,
  Check,
  Lock,
  ShieldAlert,
  Globe,
  Building2,
  Server,
  UserCheck,
  SlidersHorizontal,
  RotateCcw,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFluidModalOpen, setIsFluidModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fluid Role Customization State
  const [fluidRoleName, setFluidRoleName] = useState(currentPersona.role);
  const [fluidLevel, setFluidLevel] = useState(currentPersona.clearanceLevel || 2);
  const [fluidGroups, setFluidGroups] = useState<string[]>(currentPersona.groups || []);
  const [fluidDepartment, setFluidDepartment] = useState(currentPersona.department || 'Corporate');

  useEffect(() => {
    setFluidRoleName(currentPersona.role);
    setFluidLevel(currentPersona.clearanceLevel || 2);
    setFluidGroups(currentPersona.groups || []);
    setFluidDepartment(currentPersona.department || 'Corporate');
  }, [currentPersona]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsFluidModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const AVAILABLE_GROUPS = [
    { id: 'all-employees', label: 'All Employees (Internal)' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'devops', label: 'DevOps & Infra' },
    { id: 'legal-team', label: 'Legal Team (DPA Restricted)' },
    { id: 'executives', label: 'Executive Board' },
    { id: 'product', label: 'Product Ops' },
    { id: 'external-vendors', label: 'External Contractors' },
  ];

  const handleToggleGroup = (groupId: string) => {
    setFluidGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const handleApplyFluidRole = () => {
    const clearanceLabels: Record<number, string> = {
      1: 'Level 1: Public Only',
      2: 'Level 2: Internal Employee',
      3: 'Level 3: Team Lead / Manager',
      4: 'Level 4: Staff / Counsel',
      5: 'Level 5: Executive / Admin',
    };

    const updatedPersona: UserPersona = {
      ...currentPersona,
      role: fluidRoleName,
      clearanceLevel: fluidLevel,
      groups: fluidGroups,
      department: fluidDepartment,
      securityClearance: clearanceLabels[fluidLevel] || `Level ${fluidLevel} Clearance`,
      isFluidRole: true,
    };

    onSelectPersona(updatedPersona);
    setIsFluidModalOpen(false);
  };

  const renderClearanceBadges = (clearanceStr: string) => {
    const badges = [];
    const lower = clearanceStr.toLowerCase();

    if (lower.includes('restricted') || lower.includes('level 5') || lower.includes('level 4')) {
      badges.push(
        <span key="restricted" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] badge-rose">
          <ShieldAlert className="w-2.5 h-2.5" />
          Restricted
        </span>
      );
    }
    if (lower.includes('confidential') || lower.includes('level 3')) {
      badges.push(
        <span key="confidential" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] badge-amber">
          <Lock className="w-2.5 h-2.5" />
          Confidential
        </span>
      );
    }
    if (lower.includes('internal') || lower.includes('level 2')) {
      badges.push(
        <span key="internal" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] badge-indigo">
          <Building2 className="w-2.5 h-2.5" />
          Internal
        </span>
      );
    }
    if (lower.includes('public') || lower.includes('level 1')) {
      badges.push(
        <span key="public" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] badge-emerald">
          <Globe className="w-2.5 h-2.5" />
          Public
        </span>
      );
    }

    return <div className="flex flex-wrap items-center gap-1.5">{badges}</div>;
  };

  return (
    <header className="h-16 bg-white/80 border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Utility Bar Left Items */}
      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {/* 1. ACL Gate Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full badge-emerald text-xs font-mono font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ACL Level Gate: L{currentPersona.clearanceLevel || 2} Active</span>
        </div>

        {/* 2. Inference Backend Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full badge-indigo text-xs font-mono font-semibold shadow-xs">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Llama.cpp CUDA: Port 8085</span>
        </div>

        {/* 3. Tenant Switcher */}
        <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 shadow-xs">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>Tenant: <strong className="text-slate-900">acme-corp</strong></span>
        </div>
      </div>

      {/* Utility Bar Right Items: Fluid Role Editor & Persona Switcher */}
      <div className="flex items-center space-x-2.5" ref={dropdownRef}>
        {/* Quick Tools: Fluid Role Editor Button */}
        <button
          onClick={() => setIsFluidModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-mono font-semibold transition-all shadow-xs active:scale-95"
          title="Customize Active Role & Clearance Level"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden md:inline">Fluid Role Editor</span>
        </button>

        {/* Persona & Clearance Switcher Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 transition-all text-left font-medium text-xs shadow-xs"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            {renderCuteAvatar(currentPersona.avatar)}
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
              <span>{currentPersona.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="text-[10px] text-indigo-600 font-mono font-semibold">
              L{currentPersona.clearanceLevel || 2} • {currentPersona.role}
            </div>
          </div>
        </button>

        {/* Persona Switcher Dropdown */}
        {isOpen && (
          <div className="absolute right-4 top-14 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Select User Persona
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFluidModalOpen(true);
                }}
                className="text-[10px] font-mono text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Customize Role</span>
              </button>
            </div>

            <div className="p-2 space-y-1.5 max-h-[360px] overflow-y-auto">
              {PRESET_PERSONAS.map(persona => {
                const isSelected = persona.id === currentPersona.id && !currentPersona.isFluidRole;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelectPersona(persona);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-200 text-indigo-900 font-semibold shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {renderCuteAvatar(persona.avatar)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                            {persona.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {persona.role}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100">
                          {renderClearanceBadges(persona.securityClearance)}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fluid Role & Clearance Level Editor Modal Popup Card */}
      {isFluidModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Fluid Role & Clearance Adjuster</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Dynamically adapt security clearance & entitlements</p>
                </div>
              </div>
              <button
                onClick={() => setIsFluidModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-mono px-2.5 py-1 rounded bg-slate-200/80"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Role Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider block">
                  Assumed Corporate Role Title
                </label>
                <input
                  type="text"
                  value={fluidRoleName}
                  onChange={e => setFluidRoleName(e.target.value)}
                  placeholder="e.g. Lead Security Architect / Principal Counsel"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Clearance Level Slider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Corporate Clearance Level: Level {fluidLevel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold badge-indigo">
                    {fluidLevel === 1 && 'Level 1: Public'}
                    {fluidLevel === 2 && 'Level 2: Internal IC'}
                    {fluidLevel === 3 && 'Level 3: Team Lead'}
                    {fluidLevel === 4 && 'Level 4: Staff/Counsel'}
                    {fluidLevel === 5 && 'Level 5: Executive/Admin'}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={fluidLevel}
                  onChange={e => setFluidLevel(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                  <span>L1 Public</span>
                  <span>L2 Internal</span>
                  <span>L3 Lead</span>
                  <span>L4 Counsel</span>
                  <span>L5 Exec</span>
                </div>
              </div>

              {/* Group Entitlement Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider block">
                  Fluid Group Entitlements ({fluidGroups.length} active)
                </label>

                <div className="space-y-1.5 max-h-40 overflow-y-auto p-1">
                  {AVAILABLE_GROUPS.map(grp => {
                    const isChecked = fluidGroups.includes(grp.id);
                    return (
                      <button
                        key={grp.id}
                        onClick={() => handleToggleGroup(grp.id)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between border ${
                          isChecked
                            ? 'bg-indigo-50/90 border-indigo-200 text-indigo-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{grp.label}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setFluidRoleName(currentPersona.role);
                  setFluidLevel(currentPersona.clearanceLevel || 2);
                  setFluidGroups(currentPersona.groups || []);
                }}
                className="inline-flex items-center space-x-1 text-xs font-mono text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleApplyFluidRole}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Apply Fluid Role State →
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
