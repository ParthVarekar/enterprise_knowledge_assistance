import React, { useState, useRef, useEffect } from 'react';
import { UserPersona, PRESET_PERSONAS } from '../mockEngine/engineAdapter';
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
  Sliders,
  Sparkles,
  RotateCcw,
  CheckSquare,
  Square
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
        <span key="restricted" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-[#421d24] text-rose-200 border border-rose-400/30">
          <ShieldAlert className="w-2.5 h-2.5" />
          Restricted
        </span>
      );
    }
    if (lower.includes('confidential') || lower.includes('level 3')) {
      badges.push(
        <span key="confidential" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-amber-950 text-amber-200 border border-amber-400/30">
          <Lock className="w-2.5 h-2.5" />
          Confidential
        </span>
      );
    }
    if (lower.includes('internal') || lower.includes('level 2')) {
      badges.push(
        <span key="internal" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-[#2A2859] text-white border border-white/20">
          <Building2 className="w-2.5 h-2.5" />
          Internal
        </span>
      );
    }
    if (lower.includes('public') || lower.includes('level 1')) {
      badges.push(
        <span key="public" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-200 border border-emerald-400/30">
          <Globe className="w-2.5 h-2.5" />
          Public
        </span>
      );
    }

    return <div className="flex flex-wrap items-center gap-1.5">{badges}</div>;
  };

  return (
    <header className="h-16 bg-[#1b1938]/90 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      {/* Susurrus Status Indicators Bar */}
      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {/* Zero-Trust ACL Gate Status */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-xs">ACL Level Gate: Active (L{currentPersona.clearanceLevel || 2})</span>
        </div>

        {/* Local Llama CUDA Status */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#cbb7fb] animate-pulse" />
          <Cpu className="w-3.5 h-3.5 text-[#cbb7fb]" />
          <span className="font-bold text-xs">Llama.cpp CUDA: Port 8085</span>
        </div>

        <div className="hidden xl:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-slate-300">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>Tenant: <strong className="text-white">acme-corp</strong></span>
        </div>
      </div>

      {/* Persona Switcher & Fluid Role Customizer Button */}
      <div className="flex items-center space-x-2" ref={dropdownRef}>
        <button
          onClick={() => setIsFluidModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#cbb7fb] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          title="Customize Active Role & Clearance Level"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Fluid Role Editor</span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#2A2859] hover:bg-[#1E1B42] border border-white/20 text-white transition-all text-left font-bold text-xs shadow-lg"
        >
          <span className="text-base">{currentPersona.avatar}</span>
          <div className="hidden sm:block">
            <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#cbb7fb] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="text-[10px] text-[#cbb7fb] font-mono">
              L{currentPersona.clearanceLevel || 2} • {currentPersona.role}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-4 top-14 w-80 sm:w-96 bg-[#121028] border border-white/20 rounded-[20px] shadow-2xl overflow-hidden z-50 backdrop-blur-2xl">
            <div className="p-3.5 bg-[#1b1938] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#cbb7fb]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Select Preset Persona
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFluidModalOpen(true);
                }}
                className="text-[10px] font-mono text-[#cbb7fb] hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
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
                    className={`w-full text-left p-3 rounded-[14px] transition-all border ${
                      isSelected
                        ? 'bg-[#2A2859] border-white/40 text-white font-bold shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{persona.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#cbb7fb]' : 'text-white'}`}>
                            {persona.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#cbb7fb]" />}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {persona.role}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-white/10">
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

      {/* Fluid Role & Clearance Level Editor Modal */}
      {isFluidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121028] border border-white/20 rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
            {/* Modal Header */}
            <div className="p-5 bg-[#1b1938] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2A2859] border border-white/20 flex items-center justify-center text-[#cbb7fb]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Fluid Role & Clearance Adjuster</h3>
                  <p className="text-[10px] text-slate-300 font-mono">Dynamically adapt security clearance & entitlements</p>
                </div>
              </div>
              <button
                onClick={() => setIsFluidModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-white/10"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Role Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#cbb7fb] uppercase tracking-wider block">
                  Assumed Corporate Role Title
                </label>
                <input
                  type="text"
                  value={fluidRoleName}
                  onChange={e => setFluidRoleName(e.target.value)}
                  placeholder="e.g. Lead Security Architect / Principal Counsel"
                  className="w-full bg-[#1b1938] border border-white/20 rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#cbb7fb] font-sans font-semibold"
                />
              </div>

              {/* Clearance Level Slider */}
              <div className="p-4 rounded-[16px] bg-[#1b1938] border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Corporate Clearance Level: Level {fluidLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2A2859] text-white border border-white/20">
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
                  className="w-full accent-[#cbb7fb] cursor-pointer"
                />

                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1">
                  <span>L1 Public</span>
                  <span>L2 Internal</span>
                  <span>L3 Lead</span>
                  <span>L4 Counsel</span>
                  <span>L5 Exec</span>
                </div>
              </div>

              {/* Group Entitlement Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#cbb7fb] uppercase tracking-wider block">
                  Fluid Group Entitlements ({fluidGroups.length} active)
                </label>

                <div className="space-y-1.5 max-h-40 overflow-y-auto p-1">
                  {AVAILABLE_GROUPS.map(grp => {
                    const isChecked = fluidGroups.includes(grp.id);
                    return (
                      <button
                        key={grp.id}
                        onClick={() => handleToggleGroup(grp.id)}
                        className={`w-full text-left p-2.5 rounded-[10px] text-xs font-mono transition-all flex items-center justify-between border ${
                          isChecked
                            ? 'bg-[#2A2859] border-white/30 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{grp.label}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#cbb7fb]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#1b1938] border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setFluidRoleName(currentPersona.role);
                  setFluidLevel(currentPersona.clearanceLevel || 2);
                  setFluidGroups(currentPersona.groups || []);
                }}
                className="inline-flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleApplyFluidRole}
                className="px-5 py-2.5 bg-[#2A2859] hover:bg-[#1E1B42] text-white text-xs font-mono font-bold rounded-[10px] border border-white/20 shadow-lg active:scale-95 transition-all"
              >
                Apply Fluid Role State →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
