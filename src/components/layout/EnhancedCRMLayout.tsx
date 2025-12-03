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

interface EnhancedCRMLayoutProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const EnhancedCRMLayout: React.FC<EnhancedCRMLayoutProps> = ({
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

export default EnhancedCRMLayout;
