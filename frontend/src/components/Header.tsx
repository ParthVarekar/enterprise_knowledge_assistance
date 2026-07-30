import React from 'react';
import { UserPersona, PRESET_PERSONAS } from '../mockEngine/engineAdapter';
import { Shield, ChevronDown, User, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Title & Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ACL Pre-Filter Active</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="text-xs text-slate-400 font-mono">
          Tenant: <span className="text-slate-200 font-semibold">acme-corp</span>
        </div>
      </div>

      {/* Persona Switcher Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
        >
          <span className="text-lg">{currentPersona.avatar}</span>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              {currentPersona.name}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">{currentPersona.role}</div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Switch Active User Persona</span>
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="p-1 space-y-1 max-h-80 overflow-y-auto">
              {PRESET_PERSONAS.map(persona => {
                const isSelected = persona.id === currentPersona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelectPersona(persona);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{persona.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-100 truncate">{persona.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{persona.role}</div>
                        <div className="text-[10px] text-cyan-400/90 font-mono mt-0.5">
                          Clearance: {persona.securityClearance}
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
