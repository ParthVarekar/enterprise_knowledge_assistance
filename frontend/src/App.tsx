import React, { useState } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { PRESET_PERSONAS, UserPersona } from './mockEngine/engineAdapter';
import { ChatView } from './views/ChatView';
import { RAGPipelineView } from './views/RAGPipelineView';
import { SecurityLabView } from './views/SecurityLabView';
import { AegisQAView } from './views/AegisQAView';
import { ConnectorsView } from './views/ConnectorsView';
import { AuditLedgerView } from './views/AuditLedgerView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(PRESET_PERSONAS[0]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-[#2563eb] selection:text-[#ffffff]">
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
}
