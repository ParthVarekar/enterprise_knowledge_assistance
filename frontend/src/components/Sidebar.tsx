import React from 'react';
import { 
  MessageSquare, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Plug, 
  FileText, 
  Activity,
  Github,
  Lock
} from 'lucide-react';

export type TabType = 'chat' | 'pipeline' | 'security' | 'qa' | 'connectors' | 'audit';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'chat', label: 'AI Workspace & Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'pipeline', label: 'RAG Retrieval Pipeline', icon: <Layers className="w-4 h-4" /> },
    { id: 'security', label: 'Zero-Trust ACL Lab', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Active' },
    { id: 'qa', label: 'Aegis-QA Platform', icon: <Sparkles className="w-4 h-4" />, badge: '100%' },
    { id: 'connectors', label: 'Knowledge Hub', icon: <Plug className="w-4 h-4" /> },
    { id: 'audit', label: 'Compliance Audit Ledger', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-xl z-20">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
              Enterprise Assistant
            </h1>
            <p className="text-[11px] text-cyan-400 font-mono">Zero-Trust RAG v1.0</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Navigation
          </div>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-medium ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="glass-panel p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-slate-300">Engine Live</span>
          </div>
          <a
            href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
};
