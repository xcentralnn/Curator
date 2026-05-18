import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type AdvisorMessage = {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  id: string;
};

interface AdvisorContextType {
  addMessage: (text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  message: AdvisorMessage | null;
  clearMessage: () => void;
}

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<AdvisorMessage | null>(null);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const addMessage = useCallback((text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setMessage({ text, type, id });
  }, []);

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage((current) => current?.id === message.id ? null : current);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AdvisorContext.Provider value={{ addMessage, message, clearMessage }}>
      {children}
    </AdvisorContext.Provider>
  );
}

export function useAdvisor() {
  const context = useContext(AdvisorContext);
  if (context === undefined) {
    throw new Error('useAdvisor must be used within an AdvisorProvider');
  }
  return context;
}
