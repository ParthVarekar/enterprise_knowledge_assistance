import React from 'react';
import { 
  MessageSquare, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Plug, 
  Activity,
  Github,
  ChevronDown,
  Cpu,
  Zap,
  Box
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
    <aside className="w-64 bg-[#F7F6F3] border-r border-[#E9E8E4] text-[#37352F] flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      <div>
        {/* Notion Workspace Switcher Header */}
        <div className="p-3 border-b border-[#E9E8E4]">
          <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#EFEFED] transition-colors text-left group">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-[#2383E2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                EK
              </div>
              <div className="truncate">
                <div className="font-bold text-[#000000] text-sm tracking-tight flex items-center gap-1.5">
                  <span>EKRS AI</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#EAF2FF] text-[#2383E2] border border-[#BCE0FD] rounded">
                    RAG
                  </span>
                </div>
                <div className="text-[10px] text-[#787774] font-mono truncate">
                  acme-corp.workspace
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#787774] group-hover:text-[#37352F]" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-semibold text-[#91918E] uppercase tracking-wider font-mono">
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative ${
                      isActive
                        ? 'bg-[#EFEFED] text-[#000000] font-bold shadow-2xs'
                        : 'text-[#37352F] hover:bg-[#EFEFED] hover:text-[#000000]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-[#2383E2]' : 'text-[#787774]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded font-medium border ${
                        isActive
                          ? 'bg-[#EAF2FF] text-[#2383E2] border-[#BCE0FD]'
                          : 'bg-[#E3E2E0]/60 text-[#787774] border-[#D9D8D5]/60'
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
      <div className="p-3 border-t border-[#E9E8E4] bg-[#F7F6F3]">
        <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E8E4] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00A884] shadow-xs animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-[#37352F] flex items-center gap-1.5">
                Llama.cpp
                <span className="text-[#2383E2] text-[10px] bg-[#EAF2FF] px-1.5 py-0.2 rounded border border-[#BCE0FD]">
                  CUDA
                </span>
              </span>
            </div>
            <a
              href="https://github.com/ParthVarekar/enterprise_knowledge_assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#787774] hover:text-[#37352F] transition-colors p-0.5"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#787774] pt-1.5 border-t border-[#E9E8E4]">
            <div className="flex items-center space-x-1 text-[#00A884] font-semibold">
              <Cpu className="w-3 h-3" />
              <span>GPU Active</span>
            </div>
            <div className="flex items-center space-x-1 text-[#2383E2] font-semibold">
              <Zap className="w-3 h-3 text-[#2383E2]" />
              <span>Port 8085</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
