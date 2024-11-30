import { QueryClient } from 'react-query';

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnMount: true,
      // Disable structural sharing to prevent serialization issues
      structuralSharing: false,
      // Add custom serialization
      isDataEqual: (oldData, newData) => {
        try {
          return JSON.stringify(oldData) === JSON.stringify(newData);
        } catch {
          return false;
        }
      },
    },
    mutations: {
      retry: 1,
    },
  },
});