import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface CaptchaInputProps {
  value: string;
  onChange: (value: string, token: string) => void;
  error?: string;
}

export const CaptchaInput: React.FC<CaptchaInputProps> = ({ value, onChange, error }) => {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCaptcha = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCaptcha();
      setSvgHtml(data.svg);
      setToken(data.token);
      onChange('', data.token); // Reset parent answer when new captcha is fetched
    } catch (err) {
      console.error('Failed to load captcha', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, token);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-700">
        รหัสความปลอดภัย (CAPTCHA)
      </label>
      <div className="flex items-center gap-3">
        {/* Captcha Image display */}
        <div
          className="h-12 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center shadow-sm"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />

        {/* Reload button */}
        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={isLoading}
          title="เปลี่ยนรหัสภาพใหม่"
          className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin text-pink-500' : ''} />
        </button>

        {/* Captcha Input */}
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="พิมพ์ตัวอักษร 4 หลัก"
            maxLength={4}
            className={`w-full px-3 py-2 text-sm font-semibold tracking-widest text-center uppercase border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                : 'border-slate-200 focus:border-pink-300 focus:ring-pink-100 bg-white'
            }`}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
