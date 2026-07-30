import React from 'react';
import { useEKRS } from '../context/EKRSContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatView } from '../views/ChatView';
import { RAGPipelineView } from '../views/RAGPipelineView';
import { SecurityLabView } from '../views/SecurityLabView';
import { AegisQAView } from '../views/AegisQAView';
import { ConnectorsView } from '../views/ConnectorsView';
import { AuditLedgerView } from '../views/AuditLedgerView';

export const EKRSDashboard: React.FC = () => {
  const { activeTab, setActiveTab, currentPersona, setCurrentPersona } = useEKRS();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-[#4f46e5] selection:text-[#ffffff]">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentPersona={currentPersona} onSelectPersona={setCurrentPersona} />

        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'chat' && <ChatView currentPersona={currentPersona} />}
          {activeTab === 'pipeline' && <RAGPipelineView />}
          {activeTab === 'security' && <SecurityLabView />}
          {activeTab === 'qa' && <AegisQAView />}
          {activeTab === 'connectors' && <ConnectorsView />}
          {activeTab === 'audit' && <AuditLedgerView />}
        </main>
      </div>
    </div>
  );
};
