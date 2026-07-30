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
  Zap,
  Bot
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
    <aside className="w-64 bg-[#121028]/95 border-r border-white/10 text-white flex flex-col justify-between h-screen sticky top-0 z-20 select-none backdrop-blur-xl">
      <div>
        {/* Susurrus Style Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-[#1b1938]/60">
          <div className="w-8 h-8 rounded-full bg-[#2A2859] border border-white/20 flex items-center justify-center text-white shadow-md">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c.6 0 1.2-.4 1.4-1 1.2-3.4 3.4-3.4 4.6 0 1.2 3.4 3.4 3.4 4.6 0 1.2-3.4 3.4-3.4 4.6 0 .2.6.8 1 1.4 1" />
              <path d="M2 18c.6 0 1.2-.4 1.4-1 1.2-3.4 3.4-3.4 4.6 0 1.2-3.4 3.4-3.4 4.6 0 .2.6.8 1 1.4 1" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="font-extrabold text-white text-base tracking-tight truncate">
                Susurrus
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#cbb7fb]/20 text-[#cbb7fb] border border-[#cbb7fb]/40 rounded-full">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-mono tracking-wider truncate">
              Speech & Enterprise RAG
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <span>{section.title}</span>
              </div>

              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#F3F0EB] text-[#0F172A] font-bold shadow-lg shadow-black/20 border border-[#dcd7d3]'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-[#2A2859]' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-bold border ${
                          isActive 
                            ? 'bg-[#2A2859] text-white border-white/20' 
                            : 'bg-white/10 text-[#cbb7fb] border-white/20'
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

      {/* System Status Badge */}
      <div className="p-3 border-t border-white/10 bg-[#1b1938]/80">
        <div className="p-3 rounded-[12px] bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-white flex items-center gap-1.5">
                Llama.cpp
                <span className="text-[#cbb7fb] text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full border border-white/20">
                  CUDA
                </span>
              </span>
            </div>
            <a
              href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#cbb7fb] transition-colors p-1"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1.5 border-t border-white/10">
            <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Cpu className="w-3 h-3" />
              <span>GPU Accelerated</span>
            </div>
            <div className="flex items-center space-x-1 text-[#cbb7fb] font-semibold">
              <Zap className="w-3 h-3 text-[#cbb7fb]" />
              <span>Port 8085</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
