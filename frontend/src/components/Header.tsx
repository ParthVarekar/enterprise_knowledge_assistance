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
        <span key="restricted" className="inline-flex items-center gap-1 font-mono font-semibold rounded px-2 py-0.5 text-[10px] bg-[#aa2d00] text-[#ffffff]">
          <ShieldAlert className="w-2.5 h-2.5" />
          Restricted
        </span>
      );
    }
    if (lower.includes('confidential')) {
      badges.push(
        <span key="confidential" className="inline-flex items-center gap-1 font-mono font-semibold rounded px-2 py-0.5 text-[10px] bg-[#d9a441] text-[#181d26]">
          <Lock className="w-2.5 h-2.5" />
          Confidential
        </span>
      );
    }
    if (lower.includes('internal')) {
      badges.push(
        <span key="internal" className="inline-flex items-center gap-1 font-mono font-semibold rounded px-2 py-0.5 text-[10px] bg-[#f8fafc] text-[#181d26] border border-[#dddddd]">
          <Building2 className="w-2.5 h-2.5" />
          Internal
        </span>
      );
    }
    if (lower.includes('public')) {
      badges.push(
        <span key="public" className="inline-flex items-center gap-1 font-mono font-semibold rounded px-2 py-0.5 text-[10px] bg-[#a8d8c4] text-[#0a2e0e]">
          <Globe className="w-2.5 h-2.5" />
          Public
        </span>
      );
    }

    return <div className="flex flex-wrap items-center gap-1.5">{badges}</div>;
  };

  return (
    <header className="h-16 bg-[#ffffff] border-b border-[#dddddd] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Live System Status Indicators */}
      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {/* Zero-Trust ACL Gate Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#f8fafc] border border-[#dddddd] text-[#181d26] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#006400]" />
          <ShieldCheck className="w-3.5 h-3.5 text-[#006400]" />
          <span className="font-semibold text-xs">Zero-Trust ACL Gate: Active</span>
        </div>

        {/* Local Llama CUDA Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#f8fafc] border border-[#dddddd] text-[#181d26] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#1b61c9]" />
          <Cpu className="w-3.5 h-3.5 text-[#1b61c9]" />
          <span className="font-semibold text-xs">Llama.cpp CUDA: Port 8085</span>
        </div>

        <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#f8fafc] border border-[#dddddd] text-xs font-mono text-[#41454d]">
          <Server className="w-3.5 h-3.5" />
          <span>Tenant: <strong className="text-[#181d26]">acme-corp</strong></span>
        </div>
      </div>

      {/* Persona Switcher Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#181d26] text-[#ffffff] hover:bg-[#0d1218] transition-colors text-left font-medium text-xs shadow-sm"
        >
          <span className="text-base">{currentPersona.avatar}</span>
          <div className="hidden sm:block">
            <div className="font-semibold text-xs text-[#ffffff] flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#ffffff] border border-[#dddddd] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-3.5 bg-[#f8fafc] border-b border-[#dddddd] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#181d26]" />
                <h3 className="text-xs font-bold text-[#181d26] uppercase tracking-wider font-mono">
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
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      isSelected
                        ? 'bg-[#181d26] text-[#ffffff] border-[#181d26]'
                        : 'bg-[#ffffff] hover:bg-[#f8fafc] border-[#dddddd] text-[#181d26]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{persona.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#ffffff]' : 'text-[#181d26]'}`}>
                            {persona.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#a8d8c4]" />}
                        </div>
                        <div className={`text-[11px] ${isSelected ? 'text-[#e0e2e6]' : 'text-[#41454d]'}`}>
                          {persona.role}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-200/40">
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
