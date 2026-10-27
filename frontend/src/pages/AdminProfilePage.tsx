import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Lock, KeyRound, Shield, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      setUsername(user.username);
      setName(user.name);
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage('กรุณาระบุรหัสผ่านปัจจุบันเพื่อยืนยันตัวตน');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.updateProfile({
        username: username.trim(),
        name: name.trim(),
        currentPassword,
        newPassword: newPassword ? newPassword : undefined,
      });

      updateUser(res.user, res.token);
      setSuccessMessage('บันทึกการเปลี่ยนแปลงโปรไฟล์เรียบร้อยแล้ว!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถอัปเดตโปรไฟล์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>กลับไปหน้าแดชบอร์ด</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-sky-400 text-white flex items-center justify-center shadow-sm">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">ตั้งค่าโปรไฟล์ผู้ดูแลระบบ</h1>
            <p className="text-xs text-slate-500">
              แก้ไขชื่อผู้ใช้ (Username) และเปลี่ยนรหัสผ่านเข้าสู่ระบบ (Password)
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-xs font-medium animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">ชื่อผู้ดูแล (Display Name)</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              ชื่อผู้ใช้สำหรับเข้าสู่ระบบ (Username)
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100 font-mono"
            />
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Change Password Block */}
          <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
              <KeyRound size={16} className="text-sky-600" />
              <span>เปลี่ยนรหัสผ่าน (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  รหัสผ่านใหม่
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="พิมพ์รหัสใหม่อีกครั้ง"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Password for confirmation */}
          <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
            <label className="block text-xs font-bold text-pink-900">
              ยืนยันด้วยรหัสผ่านปัจจุบัน (จำเป็นต้องกรอกทุกครั้ง) *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="รหัสผ่านปัจจุบันของคุณ"
              className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white text-xs sm:text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
