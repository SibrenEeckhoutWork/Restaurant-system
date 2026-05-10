'use client';

import { createContext, useContext } from 'react';
import { apiService } from '@/services/api.service';
import { webSocketService } from '@/services/websocket.service';

interface ServicesContextValue {
  api: typeof apiService;
  ws: typeof webSocketService;
}

const ServicesContext = createContext<ServicesContextValue>({
  api: apiService,
  ws: webSocketService,
});

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  return (
    <ServicesContext.Provider value={{ api: apiService, ws: webSocketService }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): ServicesContextValue {
  return useContext(ServicesContext);
}
