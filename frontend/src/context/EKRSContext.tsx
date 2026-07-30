import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPersona, PRESET_PERSONAS, EngineAdapter, QueryResult } from '../mockEngine/engineAdapter';
import { TabType } from '../components/Sidebar';

export interface EKRSConfig {
  tenantId: string;
  apiEndpoint?: string;
  branding?: {
    name?: string;
    logo?: string;
    primaryColor?: string;
  };
  initialPersona?: UserPersona;
  defaultViewMode?: 'dashboard' | 'widget';
}

interface EKRSContextType {
  config: EKRSConfig;
  currentPersona: UserPersona;
  setCurrentPersona: (persona: UserPersona) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewMode: 'dashboard' | 'widget';
  setViewMode: (mode: 'dashboard' | 'widget') => void;
  history: QueryResult[];
  isProcessing: boolean;
  executeQuery: (queryText: string, personaOverride?: UserPersona) => Promise<QueryResult>;
  clearHistory: () => void;
}

const EKRSContext = createContext<EKRSContextType | undefined>(undefined);

export interface EKRSProviderProps {
  config?: Partial<EKRSConfig>;
  children: ReactNode;
}

const DEFAULT_CONFIG: EKRSConfig = {
  tenantId: 'acme-corp',
  branding: {
    name: 'EKRS AI',
    logo: 'EK',
  },
  defaultViewMode: 'dashboard',
};

export const EKRSProvider: React.FC<EKRSProviderProps> = ({ config, children }) => {
  const mergedConfig: EKRSConfig = { ...DEFAULT_CONFIG, ...config };
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(
    mergedConfig.initialPersona || PRESET_PERSONAS[0]
  );
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [viewMode, setViewMode] = useState<'dashboard' | 'widget'>(
    mergedConfig.defaultViewMode || 'dashboard'
  );
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeQuery = async (queryText: string, personaOverride?: UserPersona): Promise<QueryResult> => {
    setIsProcessing(true);
    const personaToUse = personaOverride || currentPersona;
    try {
      if (mergedConfig.apiEndpoint) {
        // Live API HTTP Endpoint Mode
        const res = await fetch(`${mergedConfig.apiEndpoint}/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query_text: queryText, user: personaToUse }),
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(prev => [data, ...prev]);
          return data;
        }
      }
      
      // Fallback Engine Adapter Execution
      const result = await EngineAdapter.executeQuery(queryText, personaToUse);
      setHistory(prev => [result, ...prev]);
      return result;
    } catch (err) {
      console.warn('API Endpoint query failed, using local engine fallback:', err);
      const fallbackResult = await EngineAdapter.executeQuery(queryText, personaToUse);
      setHistory(prev => [fallbackResult, ...prev]);
      return fallbackResult;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <EKRSContext.Provider
      value={{
        config: mergedConfig,
        currentPersona,
        setCurrentPersona,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        history,
        isProcessing,
        executeQuery,
        clearHistory,
      }}
    >
      {children}
    </EKRSContext.Provider>
  );
};

export const useEKRS = (): EKRSContextType => {
  const context = useContext(EKRSContext);
  if (!context) {
    throw new Error('useEKRS must be used within an <EKRSProvider>');
  }
  return context;
};
