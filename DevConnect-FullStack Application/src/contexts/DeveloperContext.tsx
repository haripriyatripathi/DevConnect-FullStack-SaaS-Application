import { createContext, useContext, useState, ReactNode } from 'react';
import { Developer, mockDevelopers } from '@/types/developer';

interface DeveloperContextType {
  developers: Developer[];
  addDeveloper: (dev: Omit<Developer, 'id'>) => void;
  updateDeveloper: (id: string, dev: Partial<Developer>) => void;
  deleteDeveloper: (id: string) => void;
  getDeveloper: (id: string) => Developer | undefined;
}

const DeveloperContext = createContext<DeveloperContextType | undefined>(undefined);

export function DeveloperProvider({ children }: { children: ReactNode }) {
  const [developers, setDevelopers] = useState<Developer[]>(mockDevelopers);

  const addDeveloper = (dev: Omit<Developer, 'id'>) => {
    const newDev: Developer = {
      ...dev,
      id: Date.now().toString(),
    };
    setDevelopers(prev => [...prev, newDev]);
  };

  const updateDeveloper = (id: string, updates: Partial<Developer>) => {
    setDevelopers(prev =>
      prev.map(dev => (dev.id === id ? { ...dev, ...updates } : dev))
    );
  };

  const deleteDeveloper = (id: string) => {
    setDevelopers(prev => prev.filter(dev => dev.id !== id));
  };

  const getDeveloper = (id: string) => {
    return developers.find(dev => dev.id === id);
  };

  return (
    <DeveloperContext.Provider value={{ developers, addDeveloper, updateDeveloper, deleteDeveloper, getDeveloper }}>
      {children}
    </DeveloperContext.Provider>
  );
}

export function useDevelopers() {
  const context = useContext(DeveloperContext);
  if (context === undefined) {
    throw new Error('useDevelopers must be used within a DeveloperProvider');
  }
  return context;
}
