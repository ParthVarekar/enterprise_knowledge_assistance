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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold shadow-md">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-slate-50 text-sm tracking-tight truncate">
                Enterprise AI
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-sky-400 font-mono tracking-wider truncate">
              Zero-Trust RAG v1.0
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-bold border ${
                          isActive 
                            ? 'bg-slate-950 text-sky-300 border-slate-800' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
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
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-slate-100 flex items-center gap-1.5">
                Llama.cpp
                <span className="text-sky-300 text-[10px] bg-sky-950 px-1.5 py-0.2 rounded border border-sky-500/30">
                  CUDA
                </span>
              </span>
            </div>
            <a
              href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors p-1"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1.5 border-t border-slate-800">
            <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Cpu className="w-3 h-3" />
              <span>GPU Accelerated</span>
            </div>
            <div className="flex items-center space-x-1 text-sky-400 font-semibold">
              <Zap className="w-3 h-3 text-sky-400" />
              <span>Port 8085</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
