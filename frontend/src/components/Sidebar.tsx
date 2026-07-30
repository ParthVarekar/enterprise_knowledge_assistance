import React from 'react';
import { 
  MessageSquare, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Plug, 
  Activity,
  Github,
  Lock,
  Cpu,
  Zap
} from 'lucide-react';

export type TabType = 'chat' | 'pipeline' | 'security' | 'qa' | 'connectors' | 'audit';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navSections: NavSection[] = [
    {
      title: 'PLATFORM WORKSPACE',
      items: [
        { id: 'chat', label: 'AI Workspace & Chat', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'pipeline', label: 'RAG Retrieval Pipeline', icon: <Layers className="w-4 h-4" /> },
        { id: 'connectors', label: 'Knowledge Hub', icon: <Plug className="w-4 h-4" /> },
      ]
    },
    {
      title: 'GOVERNANCE & GUARDIAN',
      items: [
        { id: 'security', label: 'Zero-Trust ACL Lab', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Active' },
        { id: 'qa', label: 'Aegis-QA Platform', icon: <Sparkles className="w-4 h-4" />, badge: '100%' },
        { id: 'audit', label: 'Compliance Audit Ledger', icon: <Activity className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0b0f19]/90 border-r border-slate-800/60 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-2xl z-20 select-none">
      <div>
        {/* Brand Header with Glowing Brand Mark */}
        <div className="p-4 border-b border-slate-800/60 flex items-center space-x-3 bg-slate-950/40">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
            <div className="relative w-9 h-9 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-slate-100 text-sm tracking-tight truncate">
                Enterprise AI
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-cyan-400/90 font-mono tracking-wider truncate">
              Zero-Trust RAG v1.0
            </p>
          </div>
        </div>

        {/* Navigation Section with Category Headings */}
        <nav className="p-3 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {/* Category Heading with font-mono tracking */}
              <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold text-slate-400/80 uppercase tracking-widest flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-cyan-500/50"></span>
                <span>{section.title}</span>
              </div>

              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent text-cyan-200 border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    {/* Active Left Pill Accent */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                    )}

                    <div className="flex items-center space-x-2.5 min-w-0 pl-1">
                      <span className={`transition-colors duration-200 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Active Glow Dot */}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,1)] animate-pulse" />
                      )}
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-medium border ${
                          isActive 
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/50'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* System Status Badge: Llama.cpp CUDA GPU Status */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-md">
        <div className="glass-card p-3 rounded-xl border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-200 space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/40 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <span className="text-[11px] font-semibold font-mono text-slate-200 flex items-center gap-1.5">
                Llama.cpp
                <span className="text-cyan-400 text-[10px] bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">
                  CUDA
                </span>
              </span>
            </div>
            <a
              href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors p-1 hover:bg-slate-800/60 rounded"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/50">
            <div className="flex items-center space-x-1 text-emerald-400">
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>GPU Accelerated</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>35/35 Layers</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
