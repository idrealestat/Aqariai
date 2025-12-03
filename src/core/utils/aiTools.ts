// /core/utils/aiTools.ts
// Utility functions for AI_ConsciousAssistantCore

export function AIReply(text: string, setMessages: any) {
  setMessages((prev: any[]) => [...prev, { role: 'assistant', text }]);
}

export function showOptions(
  options: string[],
  onSelect: (selected: string) => Promise<void>,
  setMessages: any,
  prompt: string
) {
  const actions = options.map(option => ({
    type: 'select_option',
    label: option,
    params: { value: option }
  }));
  
  setMessages((prev: any[]) => [...prev, {
    role: 'assistant',
    text: prompt,
    actions
  }]);
}

export async function confirmUser(
  prompt: string,
  onConfirm: () => Promise<void>,
  setMessages: any
) {
  const actions = [
    { type: 'confirm_yes', label: 'نعم' },
    { type: 'confirm_no', label: 'لا' }
  ];
  
  setMessages((prev: any[]) => [...prev, {
    role: 'assistant',
    text: prompt,
    actions
  }]);
  
  // Store callback for later execution
  if (typeof window !== 'undefined') {
    (window as any).__aiConfirmCallback = onConfirm;
  }
}

export function aiLog(message: string, ...args: any[]) {
  console.log(`[AI Core] ${message}`, ...args);
}
