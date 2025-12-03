import React from 'react';
import { EnhancedTeamDashboard } from './enhanced-team-dashboard';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "team" | "office" | "company";
}

interface ComprehensiveCRMSystemProps {
  user: User | null;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function ComprehensiveCRMSystem({ user, onBack }: ComprehensiveCRMSystemProps) {
  return (
    <EnhancedTeamDashboard 
      user={user} 
      onBack={onBack}
    />
  );
}

export default ComprehensiveCRMSystem;
