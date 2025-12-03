// /core/api.ts
// API helper functions for AI_ConsciousAssistantCore

export async function getCustomers(name: string) {
  // Mock implementation - replace with real API call
  try {
    const response = await fetch(`/api/customers?name=${encodeURIComponent(name)}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('getCustomers error:', error);
    return [];
  }
}

export async function openCustomerCard(customerId: string) {
  // Navigate to customer card
  if (typeof window !== 'undefined') {
    window.location.hash = `#/crm/customers/${customerId}`;
  }
}

export async function openCalendar(date?: string) {
  // Navigate to calendar
  if (typeof window !== 'undefined') {
    const hash = date ? `#/calendar?date=${date}` : '#/calendar';
    window.location.hash = hash;
  }
}

export async function sendNotification(payload: any) {
  // Send notification via API
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error('sendNotification error:', error);
    throw error;
  }
}
