import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Listing } from '../types';
import { api } from '../services/api';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingFilter } from '../components/listings/ListingFilter';
import { Sparkles, Loader2, Home, Car } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'ALL';

  const [category, setCategory] = useState<string>(categoryFromUrl);
  const [status, setStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state with URL query param if user clicked navbar links
  useEffect(() => {
    const cat = searchParams.get('category') || 'ALL';
    setCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (newCat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCat);
    }
    setSearchParams(searchParams);
  };

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getListings({
        category: category !== 'ALL' ? category : undefined,
        status: status !== 'ALL' ? status : undefined,
        search: search.trim() || undefined,
      });
      setListings(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดรายการได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 200);
    return () => clearTimeout(timer);
  }, [category, status, search]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with modern pastel styling */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-200/60 via-purple-100/50 to-sky-200/60 p-6 sm:p-10 border border-white/80 shadow-soft">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-xs font-semibold text-pink-600 shadow-sm border border-pink-100">
            <Sparkles size={14} />
            <span>แพลตฟอร์มปล่อยเช่ารถและบ้าน ครบวงจร</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            ค้นหาบ้านพักตากอากาศ และรถเช่าคุณภาพดีสำหรับคุณ
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            เลือกดูรายการเช่าอัปเดตใหม่ล่าสุด ตรวจสอบสถานะความพร้อม เช็คพิกัดแผนที่และนำทางได้ทันที
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs text-slate-700 border border-white/80">
              <Home size={14} className="text-pink-500" />
              <span>บ้านและคอนโด</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs text-slate-700 border border-white/80">
              <Car size={14} className="text-sky-500" />
              <span>รถยนต์</span>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 right-20 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Filter & Search Bar */}
      <ListingFilter
        category={category}
        onCategoryChange={handleCategoryChange}
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Listing Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            {category === 'HOUSE' ? '🏡 รายการบ้าน / คอนโดให้เช่า' : category === 'CAR' ? '🚗 รายการรถยนต์ให้เช่า' : '✨ รายการทั้งหมด'}
          </h2>
          <span className="text-xs font-medium text-slate-500">
            พบ {listings.length} รายการ
          </span>
        </div>

        {isLoading ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            <span className="text-xs text-slate-500">กำลังโหลดรายการ...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 text-red-600 rounded-3xl border border-red-100">
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={fetchListings}
              className="mt-3 px-4 py-1.5 text-xs bg-white text-red-700 rounded-xl border border-red-200 hover:bg-red-50"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-soft">
            <p className="text-base font-semibold text-slate-700">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</p>
            <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูรายการทั้งหมด</p>
            <button
              onClick={() => {
                setCategory('ALL');
                setStatus('ALL');
                setSearch('');
              }}
              className="mt-4 px-4 py-2 text-xs bg-pink-50 text-pink-700 font-medium rounded-xl hover:bg-pink-100"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
