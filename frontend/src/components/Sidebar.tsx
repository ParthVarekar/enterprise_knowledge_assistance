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
    <aside className="w-64 bg-[#181d26] border-r border-[#2d333f] text-[#ffffff] flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#2d333f] flex items-center space-x-3 bg-[#0d1218]">
          <div className="w-8 h-8 rounded-lg bg-[#ffffff] text-[#181d26] flex items-center justify-center shadow font-bold">
            <Lock className="w-4 h-4 text-[#181d26]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="font-semibold text-[#ffffff] text-sm tracking-tight truncate">
                Enterprise AI
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold bg-[#2a303c] text-[#a8d8c4] border border-[#3e4656] rounded">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#9297a0] font-mono tracking-wider truncate">
              Zero-Trust RAG v1.0
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold text-[#9297a0] uppercase tracking-widest flex items-center space-x-2">
                <span>{section.title}</span>
              </div>

              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#ffffff] text-[#181d26] font-semibold shadow-sm'
                        : 'text-[#e0e2e6] hover:bg-[#252b37] hover:text-[#ffffff]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-[#181d26]' : 'text-[#9297a0]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-medium border ${
                          isActive 
                            ? 'bg-[#181d26] text-[#ffffff] border-[#181d26]' 
                            : 'bg-[#2a303c] text-[#a8d8c4] border-[#3e4656]'
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
      <div className="p-3 border-t border-[#2d333f] bg-[#0d1218]">
        <div className="p-3 rounded-lg bg-[#181d26] border border-[#2d333f] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#39bf45] shadow" />
              <span className="text-[11px] font-semibold font-mono text-[#ffffff] flex items-center gap-1.5">
                Llama.cpp
                <span className="text-[#a8d8c4] text-[10px] bg-[#2a303c] px-1.5 py-0.2 rounded border border-[#3e4656]">
                  CUDA
                </span>
              </span>
            </div>
            <a
              href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9297a0] hover:text-[#ffffff] transition-colors p-1"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#9297a0] pt-1.5 border-t border-[#2d333f]">
            <div className="flex items-center space-x-1 text-[#39bf45]">
              <Cpu className="w-3 h-3" />
              <span>GPU Accelerated</span>
            </div>
            <div className="flex items-center space-x-1 text-[#e0e2e6]">
              <Zap className="w-3 h-3 text-[#f4d35e]" />
              <span>Port 8085</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
