import React from 'react';
import { EnhancedTeamDashboard } from '../enhanced-team-dashboard';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "team" | "office" | "company";
  avatar?: string;
  plan?: string;
}

interface IntegratedCRMLayoutProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const IntegratedCRMLayout: React.FC<IntegratedCRMLayoutProps> = ({
  user,
  onNavigate,
  onBack
}) => {
  return (
    <EnhancedTeamDashboard 
      user={user} 
      onBack={onBack}
    />
  );
};

export default IntegratedCRMLayout;
