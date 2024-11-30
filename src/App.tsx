import React from 'react';
import { QueryClientProvider } from 'react-query';
import { CustomerProvider } from './context/CustomerContext';
import { AppContent } from './components/AppContent';
import { createQueryClient } from './lib/queryClient';

const App: React.FC = () => {
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <AppContent />
      </CustomerProvider>
    </QueryClientProvider>
  );
};

export default App;