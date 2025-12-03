import React from 'react';
import CustomerDetailsWithSlides from './CustomerDetailsWithSlides-Enhanced';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  type: any;
  interestLevel: any;
  tags: string[];
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  [key: string]: any;
}

interface CustomerDetailsPageProps {
  customer: Customer;
  onBack: () => void;
  onUpdate?: (customer: Customer) => void;
  onNavigate?: (page: string, options?: any) => void;
}

export function CustomerDetailsPage({
  customer,
  onBack,
  onUpdate,
  onNavigate
}: CustomerDetailsPageProps) {
  return (
    <CustomerDetailsWithSlides
      customer={customer}
      onClose={onBack}
      onUpdate={onUpdate}
      isFullPage={true}
      onNavigate={onNavigate}
    />
  );
}

export default CustomerDetailsPage;
