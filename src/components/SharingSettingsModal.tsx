import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface SharingSettings {
  showTitle: boolean;
  showPricing: boolean;
  shareAdditionalPictures: boolean;
  shareVideo: boolean;
  showSKU: boolean;
  addLogoWatermark: boolean;
  customNote: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface SharingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: SharingSettings) => void;
  platform: 'whatsapp' | 'whatsapp-business';
}

export function SharingSettingsModal({ isOpen, onClose, onConfirm, platform }: SharingSettingsModalProps) {
  const [settings, setSettings] = useState<SharingSettings>({
    showTitle: true,
    showPricing: true,
    shareAdditionalPictures: true,
    shareVideo: true,
    showSKU: true,
    addLogoWatermark: true,
    customNote: '',
    logoPosition: 'top-right'
  });

  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const handleToggle = (key: keyof SharingSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogoPositionChange = (position: SharingSettings['logoPosition']) => {
    setSettings(prev => ({
      ...prev,
      logoPosition: position
    }));
  };

  const handleConfirm = () => {
    onConfirm(settings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#01411C]">Sharing settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Show title */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Show title</h3>
              <p className="text-sm text-gray-600 mt-1">Include title in photo</p>
            </div>
            <button
              onClick={() => handleToggle('showTitle')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showTitle ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showTitle ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Show pricing */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Show pricing</h3>
              <p className="text-sm text-gray-600 mt-1">Include price in photo</p>
            </div>
            <button
              onClick={() => handleToggle('showPricing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showPricing ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showPricing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Share additional pictures */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Share additional pictures</h3>
              <p className="text-sm text-gray-600 mt-1">If additional pictures are present in the product, they will also be shared</p>
            </div>
            <button
              onClick={() => handleToggle('shareAdditionalPictures')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.shareAdditionalPictures ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareAdditionalPictures ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Share video */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Share video</h3>
              <p className="text-sm text-gray-600 mt-1">If video is present in the product, they will also be shared</p>
            </div>
            <button
              onClick={() => handleToggle('shareVideo')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.shareVideo ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareVideo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Show SKU */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Show SKU</h3>
              <p className="text-sm text-gray-600 mt-1">Include SKU in photo</p>
            </div>
            <button
              onClick={() => handleToggle('showSKU')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showSKU ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showSKU ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Add logo watermark */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Add logo watermark</h3>
              <p className="text-sm text-gray-600 mt-1">Show your logo water mark on each photo while sharing</p>
            </div>
            <button
              onClick={() => handleToggle('addLogoWatermark')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.addLogoWatermark ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.addLogoWatermark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Add a note */}
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Add a note</h3>
                <p className="text-sm text-gray-600 mt-1">Add additional information on your photos like special offers, etc</p>
              </div>
              <button
                onClick={() => setShowNoteEditor(!showNoteEditor)}
                className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5 text-teal-500" />
              </button>
            </div>
            
            {showNoteEditor && (
              <div className="mt-3">
                <textarea
                  value={settings.customNote}
                  onChange={(e) => setSettings(prev => ({ ...prev, customNote: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                  rows={3}
                  placeholder="أدخل ملاحظة إضافية..."
                />
              </div>
            )}
          </div>

          {/* Logo position */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Logo position</h3>
            <div className="grid grid-cols-4 gap-2">
              {/* Top Left */}
              <button
                onClick={() => handleLogoPositionChange('top-left')}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  settings.logoPosition === 'top-left'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 bg-gray-100'
                }`}
              >
                <div className="relative w-full h-full p-2">
                  <div className={`absolute top-2 left-2 w-3 h-3 rounded ${
                    settings.logoPosition === 'top-left' ? 'bg-teal-500' : 'bg-gray-400'
                  }`}></div>
                  {settings.logoPosition === 'top-left' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {/* Top Right */}
              <button
                onClick={() => handleLogoPositionChange('top-right')}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  settings.logoPosition === 'top-right'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 bg-gray-100'
                }`}
              >
                <div className="relative w-full h-full p-2">
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded ${
                    settings.logoPosition === 'top-right' ? 'bg-teal-500' : 'bg-gray-400'
                  }`}></div>
                  {settings.logoPosition === 'top-right' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {/* Bottom Left */}
              <button
                onClick={() => handleLogoPositionChange('bottom-left')}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  settings.logoPosition === 'bottom-left'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 bg-gray-100'
                }`}
              >
                <div className="relative w-full h-full p-2">
                  <div className={`absolute bottom-2 left-2 w-3 h-3 rounded ${
                    settings.logoPosition === 'bottom-left' ? 'bg-teal-500' : 'bg-gray-400'
                  }`}></div>
                  {settings.logoPosition === 'bottom-left' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {/* Bottom Right */}
              <button
                onClick={() => handleLogoPositionChange('bottom-right')}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  settings.logoPosition === 'bottom-right'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 bg-gray-100'
                }`}
              >
                <div className="relative w-full h-full p-2">
                  <div className={`absolute bottom-2 right-2 w-3 h-3 rounded ${
                    settings.logoPosition === 'bottom-right' ? 'bg-teal-500' : 'bg-gray-400'
                  }`}></div>
                  {settings.logoPosition === 'bottom-right' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-4 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-bold"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all font-bold"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
}
