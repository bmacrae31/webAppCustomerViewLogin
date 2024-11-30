import { useState } from 'react';
import { DashboardSection } from '../types';

export const useDashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('membership');

  return {
    activeSection,
    setActiveSection,
  };
};