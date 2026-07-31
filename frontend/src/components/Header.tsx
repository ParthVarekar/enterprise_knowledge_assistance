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
        <span key="internal" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] badge-blue">
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
    <header className="h-16 bg-[#FBFBFA]/80 backdrop-blur-md border-b border-[#E9E8E4] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Utility Bar Left Indicators */}
      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {/* 1. ACL Gate Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E9E8E4] text-[#37352F] text-xs font-mono font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#00A884] animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
          <span>ACL Level Gate: L{currentPersona.clearanceLevel || 2} Active</span>
        </div>

        {/* 2. Inference Backend Monospace Tag */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EAF2FF] border border-[#BCE0FD] text-[#2383E2] text-xs font-mono font-semibold">
          <Cpu className="w-3.5 h-3.5 text-[#2383E2]" />
          <span>Llama.cpp CUDA: Port 8085</span>
        </div>

        {/* 3. Tenant Selector Dropdown */}
        <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E9E8E4] text-xs font-mono text-[#787774] shadow-2xs">
          <Server className="w-3.5 h-3.5 text-[#787774]" />
          <span>Tenant: <strong className="text-[#37352F]">acme-corp</strong></span>
        </div>
      </div>

      {/* Utility Bar Right Actions: Fluid Role Editor & Persona Switcher */}
      <div className="flex items-center space-x-2.5" ref={dropdownRef}>
        {/* Quick Tools: Fluid Role Editor Button */}
        <button
          onClick={() => setIsFluidModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F6F3] border border-[#E9E8E4] text-[#37352F] text-xs font-mono font-semibold transition-all shadow-2xs active:scale-95"
          title="Customize Active Role & Clearance Level"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#2383E2]" />
          <span className="hidden md:inline">Fluid Role Editor</span>
        </button>

        {/* Persona & Clearance Switcher Chip */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F7F6F3] border border-[#E9E8E4] text-[#37352F] transition-all text-left font-medium text-xs shadow-2xs"
        >
          <div className="w-5 h-5 rounded-full bg-[#F1F0EC] flex items-center justify-center shrink-0">
            {renderCuteAvatar(currentPersona.avatar)}
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-xs text-[#000000] flex items-center gap-1">
              <span>{currentPersona.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#787774] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="text-[10px] text-[#2383E2] font-mono font-semibold">
              L{currentPersona.clearanceLevel || 2} • {currentPersona.role}
            </div>
          </div>
        </button>

        {/* Persona Switcher Dropdown */}
        {isOpen && (
          <div className="absolute right-4 top-14 w-80 sm:w-96 bg-[#FFFFFF] border border-[#E9E8E4] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 bg-[#F7F6F3] border-b border-[#E9E8E4] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#2383E2]" />
                <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wider font-mono">
                  Select User Persona
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFluidModalOpen(true);
                }}
                className="text-[10px] font-mono text-[#2383E2] hover:underline flex items-center gap-1 font-semibold"
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
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-[#EAF2FF] border-[#BCE0FD] text-[#000000] font-bold shadow-2xs'
                        : 'bg-[#FFFFFF] hover:bg-[#F7F6F3] border-[#E9E8E4] text-[#37352F]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-[#F1F0EC] border border-[#E9E8E4] flex items-center justify-center shrink-0">
                        {renderCuteAvatar(persona.avatar)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#2383E2]' : 'text-[#000000]'}`}>
                            {persona.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#2383E2]" />}
                        </div>
                        <div className="text-[11px] text-[#787774] font-medium">
                          {persona.role}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-[#E9E8E4]">
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
      {isFluidModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-[#37352F]/40 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E9E8E4] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-[#F7F6F3] border-b border-[#E9E8E4] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] border border-[#BCE0FD] flex items-center justify-center text-[#2383E2]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#000000] text-sm">Fluid Role & Clearance Adjuster</h3>
                  <p className="text-[10px] text-[#787774] font-mono">Dynamically adapt security clearance & entitlements</p>
                </div>
              </div>
              <button
                onClick={() => setIsFluidModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] text-xs font-mono px-2.5 py-1 rounded bg-[#E3E2E0]/60"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Role Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#2383E2] uppercase tracking-wider block">
                  Assumed Corporate Role Title
                </label>
                <input
                  type="text"
                  value={fluidRoleName}
                  onChange={e => setFluidRoleName(e.target.value)}
                  placeholder="e.g. Lead Security Architect / Principal Counsel"
                  className="w-full bg-[#F7F6F3] border border-[#E9E8E4] rounded-xl px-3.5 py-2 text-xs text-[#37352F] placeholder-[#787774] focus:outline-none focus:ring-2 focus:ring-[#2383E2] font-medium"
                />
              </div>

              {/* Clearance Level Slider */}
              <div className="p-4 rounded-2xl bg-[#F7F6F3] border border-[#E9E8E4] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#000000] uppercase tracking-wider">
                    Corporate Clearance Level: Level {fluidLevel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold badge-blue">
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
                  className="w-full accent-[#2383E2] cursor-pointer"
                />

                <div className="flex items-center justify-between text-[9px] font-mono text-[#787774] pt-1">
                  <span>L1 Public</span>
                  <span>L2 Internal</span>
                  <span>L3 Lead</span>
                  <span>L4 Counsel</span>
                  <span>L5 Exec</span>
                </div>
              </div>

              {/* Group Entitlement Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#2383E2] uppercase tracking-wider block">
                  Fluid Group Entitlements ({fluidGroups.length} active)
                </label>

                <div className="space-y-1.5 max-h-40 overflow-y-auto p-1">
                  {AVAILABLE_GROUPS.map(grp => {
                    const isChecked = fluidGroups.includes(grp.id);
                    return (
                      <button
                        key={grp.id}
                        onClick={() => handleToggleGroup(grp.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between border ${
                          isChecked
                            ? 'bg-[#EAF2FF] border-[#BCE0FD] text-[#2383E2] font-semibold shadow-2xs'
                            : 'bg-[#FFFFFF] border-[#E9E8E4] text-[#37352F] hover:bg-[#F7F6F3]'
                        }`}
                      >
                        <span>{grp.label}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#2383E2]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#787774]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F7F6F3] border-t border-[#E9E8E4] flex items-center justify-between">
              <button
                onClick={() => {
                  setFluidRoleName(currentPersona.role);
                  setFluidLevel(currentPersona.clearanceLevel || 2);
                  setFluidGroups(currentPersona.groups || []);
                }}
                className="inline-flex items-center space-x-1 text-xs font-mono text-[#787774] hover:text-[#37352F]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleApplyFluidRole}
                className="px-4 py-2 bg-[#2383E2] hover:bg-[#1D74CB] text-white text-xs font-mono font-bold rounded-lg shadow-sm active:scale-95 transition-all"
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
