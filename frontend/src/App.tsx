import React from 'react';
import { EKRSProvider, useEKRS } from './context/EKRSContext';
import { EKRSDashboard } from './components/EKRSDashboard';
import { EKRSWidget } from './components/EKRSWidget';
import { Layout, Sparkles, Box, ShieldCheck, Layers, Cpu } from 'lucide-react';

function AppContent() {
  const { viewMode, setViewMode } = useEKRS();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Plug-and-Play Top Integration Mode Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-slate-800 select-none z-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-bold text-indigo-400">
            <Box className="w-4 h-4 text-indigo-400" />
            <span>EKRS Integration Mode:</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                viewMode === 'dashboard'
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3 h-3" />
              <span>Full Governance Dashboard</span>
            </button>
            <button
              onClick={() => setViewMode('widget')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                viewMode === 'widget'
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Floating Assistant Widget</span>
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust ACL Active</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-indigo-300">
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
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full badge-indigo text-xs font-mono font-bold">
              Host Application Shell Simulation
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Host Application Content
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              EKRS can be plugged into any existing codebase (React, Next.js, Express, Fastify) with a single provider tag <code className="bg-slate-200 px-1.5 py-0.5 rounded text-indigo-800 font-mono text-xs font-bold">&lt;EKRSProvider&gt;</code> and floating assistant widget <code className="bg-slate-200 px-1.5 py-0.5 rounded text-indigo-800 font-mono text-xs font-bold">&lt;EKRSWidget /&gt;</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-left w-full space-y-3 font-mono text-xs">
            <div className="text-indigo-700 font-bold uppercase tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-600" />
              <span>1-Line Integration Code Snippet</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
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

          <p className="text-xs text-slate-500 font-mono">
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
