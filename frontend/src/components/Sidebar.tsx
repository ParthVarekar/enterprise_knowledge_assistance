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
  Bot,
  Shield,
  SlidersHorizontal
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
    <aside className="w-64 bg-slate-50/90 border-r border-slate-200 text-slate-800 flex flex-col justify-between h-screen sticky top-0 z-20 select-none backdrop-blur-md">
      <div>
        {/* EKRS Brand Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center space-x-3 bg-white/50">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20 font-extrabold text-sm tracking-tight">
            EK
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="font-extrabold text-slate-900 text-base tracking-tight truncate">
                EKRS AI
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 rounded">
                RAG
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider truncate">
              Enterprise Knowledge System
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative group ${
                      isActive
                        ? 'bg-indigo-50/90 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {/* Left edge indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1 bottom-1 w-1 bg-indigo-600 rounded-r" />
                    )}

                    <div className="flex items-center space-x-2.5 min-w-0 pl-1">
                      <span className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded font-medium border ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-slate-200/80 text-slate-600 border-slate-300/60'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Status Panel */}
      <div className="p-3 border-t border-slate-200 bg-white/60">
        <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-slate-800 flex items-center gap-1.5">
                Llama.cpp
                <span className="text-indigo-700 text-[10px] bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  CUDA
                </span>
              </span>
            </div>
            <a
              href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-200/80">
            <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <Cpu className="w-3 h-3" />
              <span>GPU Active</span>
            </div>
            <div className="flex items-center space-x-1 text-indigo-700 font-semibold">
              <Zap className="w-3 h-3 text-indigo-600" />
              <span>Port 8085</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
