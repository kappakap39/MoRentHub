import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CaptchaInput } from '../components/common/CaptchaInput';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaAnswer || !captchaToken) {
      setError('กรุณากรอกรหัส Captcha ให้ถูกต้อง');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.login({
        username: username.trim(),
        password,
        captchaAnswer: captchaAnswer.trim(),
        captchaToken,
      });

      login(data.token, data.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'ชื่อผู้ใช้ รหัสผ่าน หรือ Captcha ไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft space-y-6 relative overflow-hidden">
        {/* Soft pastel ambient background */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-300 to-sky-400" />

        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="BAAN NAMPETCH PROPERTY"
            className="w-16 h-16 object-contain rounded-2xl mx-auto shadow-soft bg-white border border-pink-100 p-1"
          />
          <h2 className="text-xl font-bold text-slate-800">เข้าสู่ระบบผู้ดูแลระบบ (Admin)</h2>
          <p className="text-xs text-slate-500">
            ระบบจัดการข้อมูลการเช่าบ้านและรถยนต์
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-medium animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              ชื่อผู้ใช้ (Username)
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้"
                autoComplete="username"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
              />
            </div>
          </div>

          {/* Captcha with Verification */}
          <CaptchaInput
            value={captchaAnswer}
            onChange={(ans, tok) => {
              setCaptchaAnswer(ans);
              setCaptchaToken(tok);
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-medium text-sm shadow-md transition-all disabled:opacity-60"
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>กลับไปยังหน้ารายการหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
