import React from 'react';
import { EKRSProvider, useEKRS } from './context/EKRSContext';
import { EKRSDashboard } from './components/EKRSDashboard';
import { EKRSWidget } from './components/EKRSWidget';
import { Layout, Sparkles, Box, ShieldCheck, Layers, Cpu } from 'lucide-react';

function AppContent() {
  const { viewMode, setViewMode } = useEKRS();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      {/* Plug-and-Play Top Integration Mode Bar */}
      <div className="bg-[#F7F6F3] text-[#37352F] px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-[#E9E8E4] select-none z-30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-bold text-[#2383E2]">
            <Box className="w-4 h-4 text-[#2383E2]" />
            <span>EKRS Integration Mode:</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#FFFFFF] p-0.5 rounded-lg border border-[#E9E8E4]">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                viewMode === 'dashboard'
                  ? 'bg-[#2383E2] text-white font-bold shadow-2xs'
                  : 'text-[#787774] hover:text-[#37352F]'
              }`}
            >
              <Layout className="w-3 h-3" />
              <span>Full Governance Dashboard</span>
            </button>
            <button
              onClick={() => setViewMode('widget')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                viewMode === 'widget'
                  ? 'bg-[#2383E2] text-white font-bold shadow-2xs'
                  : 'text-[#787774] hover:text-[#37352F]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Floating Assistant Widget</span>
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[11px] text-[#787774]">
          <span className="flex items-center gap-1 text-[#00A884] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust ACL Active</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#2383E2]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Llama.cpp CUDA</span>
          </span>
        </div>
      </div>

      {/* Mode View Rendering */}
      {viewMode === 'dashboard' ? (
        <EKRSDashboard />
      ) : (
        /* Host Project Demo Screen for Widget Mode */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] border border-[#BCE0FD] text-[#2383E2] flex items-center justify-center shadow-2xs">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full badge-blue text-xs font-mono font-bold">
              Host Application Shell Simulation
            </span>
            <h1 className="text-3xl font-bold text-[#000000] tracking-tight">
              Your Host Application Content
            </h1>
            <p className="text-sm text-[#787774] leading-relaxed font-medium">
              EKRS can be plugged into any existing codebase (React, Next.js, Express, Fastify) with a single provider tag <code className="bg-[#F1F0EC] px-1.5 py-0.5 rounded text-[#2383E2] font-mono text-xs font-bold">&lt;EKRSProvider&gt;</code> and floating assistant widget <code className="bg-[#F1F0EC] px-1.5 py-0.5 rounded text-[#2383E2] font-mono text-xs font-bold">&lt;EKRSWidget /&gt;</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E8E4] shadow-2xs text-left w-full space-y-3 font-mono text-xs">
            <div className="text-[#2383E2] font-bold uppercase tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4 text-[#2383E2]" />
              <span>1-Line Integration Code Snippet</span>
            </div>
            <pre className="p-4 rounded-xl bg-[#F7F6F3] text-[#37352F] leading-relaxed overflow-x-auto border border-[#E9E8E4]">
              <code>{`import { EKRSProvider, EKRSWidget } from '@ekrs/react';

export default function App() {
  return (
    <EKRSProvider config={{ tenantId: 'my-project', apiEndpoint: '/api/ekrs' }}>
      <YourExistingApp />
      <EKRSWidget /> {/* Floating Assistant Widget in Bottom Right */}
    </EKRSProvider>
  );
}`}</code>
            </pre>
          </div>

          <p className="text-xs text-[#787774] font-mono">
            👇 Look at the bottom right corner to interact with the live EKRS AI Knowledge Drawer Widget!
          </p>

          <EKRSWidget />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <EKRSProvider>
      <AppContent />
    </EKRSProvider>
  );
}
