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
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const renderClearanceBadges = (clearanceStr: string) => {
    const badges = [];
    const lower = clearanceStr.toLowerCase();

    if (lower.includes('restricted')) {
      badges.push(
        <span key="restricted" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] bg-rose-950 border border-rose-500/40 text-rose-300">
          <ShieldAlert className="w-2.5 h-2.5" />
          Restricted
        </span>
      );
    }
    if (lower.includes('confidential')) {
      badges.push(
        <span key="confidential" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] bg-amber-950 border border-amber-500/40 text-amber-300">
          <Lock className="w-2.5 h-2.5" />
          Confidential
        </span>
      );
    }
    if (lower.includes('internal')) {
      badges.push(
        <span key="internal" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] bg-sky-950 border border-sky-500/40 text-sky-300">
          <Building2 className="w-2.5 h-2.5" />
          Internal
        </span>
      );
    }
    if (lower.includes('public')) {
      badges.push(
        <span key="public" className="inline-flex items-center gap-1 font-mono font-bold rounded px-2 py-0.5 text-[10px] bg-emerald-950 border border-emerald-500/40 text-emerald-300">
          <Globe className="w-2.5 h-2.5" />
          Public
        </span>
      );
    }

    return <div className="flex flex-wrap items-center gap-1.5">{badges}</div>;
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Live System Status Indicators */}
      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {/* Zero-Trust ACL Gate Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950 border border-emerald-500/40 text-slate-100 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-xs text-slate-100">Zero-Trust ACL Gate: Active</span>
        </div>

        {/* Local Llama CUDA Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950 border border-sky-500/40 text-slate-100 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-bold text-xs text-slate-100">Llama.cpp CUDA: Port 8085</span>
        </div>

        <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>Tenant: <strong className="text-slate-100">acme-corp</strong></span>
        </div>
      </div>

      {/* Persona Switcher Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 hover:bg-slate-800 transition-all text-left font-semibold text-xs shadow-md"
        >
          <span className="text-base">{currentPersona.avatar}</span>
          <div className="hidden sm:block">
            <div className="font-bold text-xs text-slate-50 flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-sky-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="text-[10px] text-sky-300 font-mono">{currentPersona.role}</div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Select User Persona
                </h3>
              </div>
            </div>

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
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{persona.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-sky-300' : 'text-slate-100'}`}>
                            {persona.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {persona.role}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-800">
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
    </header>
  );
};
