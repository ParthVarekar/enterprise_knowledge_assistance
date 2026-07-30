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
        <span key="restricted" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-[#421d24] text-rose-200 border border-rose-400/30">
          <ShieldAlert className="w-2.5 h-2.5" />
          Restricted
        </span>
      );
    }
    if (lower.includes('confidential')) {
      badges.push(
        <span key="confidential" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-amber-950 text-amber-200 border border-amber-400/30">
          <Lock className="w-2.5 h-2.5" />
          Confidential
        </span>
      );
    }
    if (lower.includes('internal')) {
      badges.push(
        <span key="internal" className="inline-flex items-center gap-1 font-mono font-bold rounded-full px-2 py-0.5 text-[10px] bg-[#2A2859] text-white border border-white/20">
          <Building2 className="w-2.5 h-2.5" />
          Internal
        </span>
      );
    }
    if (lower.includes('public')) {
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
          <span className="font-bold text-xs">Zero-Trust ACL Gate: Active</span>
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

      {/* Persona Switcher Dropdown */}
      <div className="relative" ref={dropdownRef}>
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
            <div className="text-[10px] text-[#cbb7fb] font-mono">{currentPersona.role}</div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-[#121028] border border-white/20 rounded-[20px] shadow-2xl overflow-hidden z-50 backdrop-blur-2xl">
            <div className="p-3.5 bg-[#1b1938] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#cbb7fb]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
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
    </header>
  );
};
