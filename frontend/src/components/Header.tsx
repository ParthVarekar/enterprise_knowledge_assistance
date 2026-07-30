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
  KeyRound,
  Server,
  Activity,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Helper to render distinct security clearance badges
  const renderClearanceBadges = (clearanceStr: string, compact = false) => {
    const badges = [];
    const lower = clearanceStr.toLowerCase();

    if (lower.includes('restricted')) {
      badges.push(
        <span
          key="restricted"
          className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
          } bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-sm`}
        >
          <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
          Restricted
        </span>
      );
    }
    if (lower.includes('confidential')) {
      badges.push(
        <span
          key="confidential"
          className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
          } bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm`}
        >
          <Lock className="w-2.5 h-2.5 text-amber-400" />
          Confidential
        </span>
      );
    }
    if (lower.includes('internal')) {
      badges.push(
        <span
          key="internal"
          className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
          } bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-sm`}
        >
          <Building2 className="w-2.5 h-2.5 text-cyan-400" />
          Internal
        </span>
      );
    }
    if (lower.includes('public')) {
      badges.push(
        <span
          key="public"
          className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
          } bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm`}
        >
          <Globe className="w-2.5 h-2.5 text-emerald-400" />
          Public
        </span>
      );
    }

    return <div className="flex flex-wrap items-center gap-1.5">{badges}</div>;
  };

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-all">
      {/* Live System Status Indicators */}
      <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-1 no-scrollbar">
        {/* Zero-Trust ACL Gate Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-emerald-500/25 text-slate-200 text-xs font-mono shadow-inner group hover:border-emerald-500/40 transition-colors">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Zero-Trust ACL Gate</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>

        <span className="text-slate-800 hidden md:inline">|</span>

        {/* Local Llama CUDA Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/25 text-slate-200 text-xs font-mono shadow-inner group hover:border-cyan-500/40 transition-colors">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <Cpu className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Local Llama CUDA</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 uppercase tracking-wider">
              Connected on 8085
            </span>
          </div>
        </div>

        {/* Tenant metadata badge (desktop) */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/40 border border-slate-700/50 text-[11px] font-mono text-slate-400">
          <Server className="w-3 h-3 text-slate-400" />
          <span>Tenant:</span>
          <span className="text-slate-200 font-semibold">acme-corp</span>
        </div>
      </div>

      {/* High-End Persona Switcher Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-3 px-3.5 py-1.5 rounded-xl border transition-all text-left group ${
            isOpen
              ? 'bg-slate-800 border-cyan-500/50 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-700/80 shadow-md hover:border-slate-600'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-base shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
            {currentPersona.avatar}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-200'
                }`}
              />
            </div>
            <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
              <span>{currentPersona.role}</span>
            </div>
          </div>
          <div className="sm:hidden">
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10">
            {/* Header Banner */}
            <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Security Context & Persona
                  </h3>
                  <p className="text-[10px] text-slate-400">Select active user to evaluate ACL pre-filtering</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                4 Personas
              </span>
            </div>

            {/* Persona List */}
            <div className="p-2 space-y-1.5 max-h-[360px] overflow-y-auto">
              {PRESET_PERSONAS.map(persona => {
                const isSelected = persona.id === currentPersona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelectPersona(persona);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-150 border ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/30 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950/40 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border shadow-inner ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-500/40 text-cyan-300'
                            : 'bg-slate-900/80 border-slate-700/80 text-slate-300'
                        }`}
                      >
                        {persona.avatar}
                      </div>

                      {/* Info & Clearance */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-cyan-200' : 'text-slate-100'
                            }`}
                          >
                            {persona.name}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Active
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                          {persona.role}
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          {persona.email}
                        </div>

                        {/* Explicit Security Clearance Badges */}
                        <div className="mt-2 pt-2 border-t border-slate-800/80">
                          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                            Security Clearance:
                          </div>
                          {renderClearanceBadges(persona.securityClearance)}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-3.5 py-2.5 bg-slate-950/90 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Zero-Trust Policy Enforced</span>
              </div>
              <span className="text-slate-300 font-semibold">Acme Corp Enterprise</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

