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
    <div className="flex min-h-screen bg-[#FBFBFA] font-sans text-[#37352F] antialiased selection:bg-[#2383E2] selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentPersona={currentPersona} onSelectPersona={setCurrentPersona} />

        <main className="flex-1 overflow-y-auto pb-12">
          {/* Preserve view component instances in DOM to keep chat history, scroll state & active inputs intact */}
          <div className={activeTab === 'chat' ? 'block' : 'hidden'}>
            <ChatView currentPersona={currentPersona} />
          </div>
          <div className={activeTab === 'pipeline' ? 'block' : 'hidden'}>
            <RAGPipelineView />
          </div>
          <div className={activeTab === 'security' ? 'block' : 'hidden'}>
            <SecurityLabView />
          </div>
          <div className={activeTab === 'qa' ? 'block' : 'hidden'}>
            <AegisQAView />
          </div>
          <div className={activeTab === 'connectors' ? 'block' : 'hidden'}>
            <ConnectorsView />
          </div>
          <div className={activeTab === 'audit' ? 'block' : 'hidden'}>
            <AuditLedgerView />
          </div>
        </main>
      </div>
    </div>
  );
};
