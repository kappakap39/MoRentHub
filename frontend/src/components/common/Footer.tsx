import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-pink-100/60 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="BAAN NAMPETCH PROPERTY"
              className="w-7 h-7 object-contain rounded-lg bg-white border border-pink-100 p-0.5"
            />
            <span className="font-semibold text-sm text-slate-700">BAAN NAMPETCH PROPERTY</span>
            <span className="text-xs text-slate-400 hidden sm:inline">• แพลตฟอร์มปล่อยเช่ารถและบ้าน</span>
          </div>
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} BAAN NAMPETCH PROPERTY. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
