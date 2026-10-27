import React from 'react';
import { Home, Car, Grid, Search, X } from 'lucide-react';

interface ListingFilterProps {
  category: string;
  onCategoryChange: (cat: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const ListingFilter: React.FC<ListingFilterProps> = ({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-pink-100 shadow-soft space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => onCategoryChange('ALL')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              category === 'ALL'
                ? 'bg-gradient-to-r from-pink-400 to-sky-400 text-white shadow-sm font-semibold'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Grid size={15} />
            <span>ทั้งหมด</span>
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange('HOUSE')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              category === 'HOUSE'
                ? 'bg-pink-500 text-white shadow-sm font-semibold'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100/80'
            }`}
          >
            <Home size={15} />
            <span>บ้านและคอนโด</span>
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange('CAR')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              category === 'CAR'
                ? 'bg-sky-500 text-white shadow-sm font-semibold'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100/80'
            }`}
          >
            <Car size={15} />
            <span>รถยนต์ให้เช่า</span>
          </button>
        </div>

        {/* Status Dropdown / Quick Filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
            สถานะ:
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="AVAILABLE">เฉพาะที่ว่างให้เช่า</option>
            <option value="RENTED">มีผู้เช่าแล้ว</option>
          </select>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาตามชื่อบ้าน, ยี่ห้อรถ หรือสถานที่ (เช่น เชียงใหม่, สุขุมวิท)..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
