// hooks/useVoiceCommands.ts
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

export default function useVoiceCommands() {
  const [enabled, setEnabled] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const HOTWORD = 'عقاري أي آي';

  const commands = {
    ar: {
      confirm: ['أكد موعد', 'تأكيد موعد'],
      cancel: ['ألغِ موعد', 'إلغاء موعد'],
      suggest: ['اقترح موعد جديد', 'موعد جديد'],
      create: ['أنشئ موعد', 'إضافة موعد'],
      read: ['اقرأ الإشعارات', 'الإشعارات']
    },
    en: {
      confirm: ['confirm appointment', 'confirm meeting'],
      cancel: ['cancel appointment', 'cancel meeting'],
      suggest: ['suggest new appointment', 'new appointment'],
      create: ['create appointment', 'add appointment'],
      read: ['read notifications', 'notifications']
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('voice_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setEnabled(settings.enabled || false);
      setLanguage(settings.language || 'ar');
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (enabled) {
          recognitionRef.current.start();
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [enabled, language]);

  useEffect(() => {
    localStorage.setItem('voice_settings', JSON.stringify({ enabled, language }));
  }, [enabled, language]);

  function startListening() {
    if (recognitionRef.current && enabled) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success(language === 'ar' ? 'تم تفعيل الأوامر الصوتية' : 'Voice commands activated');
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info(language === 'ar' ? 'تم إيقاف الأوامر الصوتية' : 'Voice commands deactivated');
    }
  }

  function handleVoiceCommand(transcript: string) {
    const lowerTranscript = transcript.toLowerCase();

    if (!lowerTranscript.includes(HOTWORD.toLowerCase()) && language === 'ar') {
      return;
    }

    const currentCommands = commands[language];

    if (currentCommands.confirm.some(cmd => lowerTranscript.includes(cmd))) {
      executeCommand('confirm', transcript);
    } else if (currentCommands.cancel.some(cmd => lowerTranscript.includes(cmd))) {
      executeCommand('cancel', transcript);
    } else if (currentCommands.suggest.some(cmd => lowerTranscript.includes(cmd))) {
      executeCommand('suggest', transcript);
    } else if (currentCommands.create.some(cmd => lowerTranscript.includes(cmd))) {
      executeCommand('create', transcript);
    } else if (currentCommands.read.some(cmd => lowerTranscript.includes(cmd))) {
      executeCommand('read', transcript);
    }
  }

  function executeCommand(action: string, transcript: string) {
    const messages = {
      ar: {
        confirm: 'جاري تأكيد الموعد...',
        cancel: 'جاري إلغاء الموعد...',
        suggest: 'جاري اقتراح موعد جديد...',
        create: 'جاري إنشاء موعد جديد...',
        read: 'جاري قراءة الإشعارات...'
      },
      en: {
        confirm: 'Confirming appointment...',
        cancel: 'Cancelling appointment...',
        suggest: 'Suggesting new appointment...',
        create: 'Creating new appointment...',
        read: 'Reading notifications...'
      }
    };

    toast.info(messages[language][action as keyof typeof messages.ar]);

    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action, transcript }
    }));
  }

  function toggleEnabled() {
    if (!enabled) {
      setEnabled(true);
      startListening();
    } else {
      setEnabled(false);
      stopListening();
    }
  }

  return {
    enabled,
    language,
    isListening,
    setLanguage,
    toggleEnabled,
    startListening,
    stopListening
  };
}
