import React from 'react';
import { StatusType, CategoryType } from '../../types';
import { Home, Car, CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isAvailable = status === 'AVAILABLE';

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
        isAvailable
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-rose-50 text-rose-600 border border-rose-200'
      } ${sizeClasses}`}
    >
      {isAvailable ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <CheckCircle2 size={size === 'sm' ? 12 : 14} />
          <span>ว่างให้เช่า</span>
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <Clock size={size === 'sm' ? 12 : 14} />
          <span>มีผู้เช่าแล้ว / ไม่ว่าง</span>
        </>
      )}
    </span>
  );
};

interface CategoryBadgeProps {
  category: CategoryType;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const isHouse = category === 'HOUSE';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isHouse
          ? 'bg-pink-50 text-pink-700 border-pink-200'
          : 'bg-sky-50 text-sky-700 border-sky-200'
      }`}
    >
      {isHouse ? <Home size={12} /> : <Car size={12} />}
      <span>{isHouse ? 'บ้าน / ที่พัก' : 'รถยนต์'}</span>
    </span>
  );
};
