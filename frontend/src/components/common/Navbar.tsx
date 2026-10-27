import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Car, Shield, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-400 via-pink-300 to-sky-300 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-sky-600 bg-clip-text text-transparent">
                BAAN NAMPETCH PROPERTY
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider -mt-1 font-medium">
                ปล่อยเช่ารถและบ้าน
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-full border border-slate-200/60">
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              ทั้งหมด
            </Link>
            <Link
              to="/?category=HOUSE"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                location.search.includes('category=HOUSE')
                  ? 'bg-pink-100/80 text-pink-700 shadow-sm'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <Home size={15} />
              <span>บ้าน / คอนโด</span>
            </Link>
            <Link
              to="/?category=CAR"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                location.search.includes('category=CAR')
                  ? 'bg-sky-100/80 text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/50'
              }`}
            >
              <Car size={15} />
              <span>รถยนต์</span>
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    isActive('/admin/dashboard')
                      ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                      : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
                  }`}
                >
                  <Shield size={14} />
                  <span>จัดการข้อมูล</span>
                </Link>

                <Link
                  to="/admin/profile"
                  className={`p-2 rounded-full border text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-all ${
                    isActive('/admin/profile') ? 'border-pink-300 bg-pink-50' : 'border-slate-200'
                  }`}
                  title="โปรไฟล์แอดมิน"
                >
                  <User size={16} />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="ออกจากระบบ"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-pink-600 bg-white hover:bg-pink-50 border border-slate-200 rounded-full transition-all shadow-sm"
              >
                <Shield size={14} className="text-pink-400" />
                <span>เข้าสู่ระบบแอดมิน</span>
              </Link>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-pink-600 rounded-xl hover:bg-pink-50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-pink-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50/50"
          >
            🏠 รายการทั้งหมด
          </Link>
          <Link
            to="/?category=HOUSE"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-pink-700 hover:bg-pink-50/50"
          >
            🏡 บ้าน / คอนโด
          </Link>
          <Link
            to="/?category=CAR"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-sky-700 hover:bg-sky-50/50"
          >
            🚗 รถยนต์
          </Link>

          <hr className="border-slate-100 my-2" />

          {user ? (
            <div className="space-y-1">
              <div className="px-4 py-1 text-xs font-semibold text-pink-500 uppercase tracking-wider">
                สำหรับผู้ดูแลระบบ ({user.username})
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50"
              >
                <Shield size={16} className="text-pink-500" />
                <span>จัดการรายการ (Dashboard)</span>
              </Link>
              <Link
                to="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50"
              >
                <User size={16} className="text-sky-500" />
                <span>ข้อมูลโปรไฟล์ / เปลี่ยนรหัสผ่าน</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-sm font-medium text-pink-600 bg-pink-50 rounded-xl hover:bg-pink-100"
            >
              <Shield size={16} />
              <span>เข้าสู่ระบบแอดมิน</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
