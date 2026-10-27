import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Listing } from '../../types';
import { StatusBadge, CategoryBadge } from '../common/Badge';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  // Use cover image or first image or placeholder
  const coverImage =
    listing.images.find((img) => img.isCover)?.url ||
    listing.images[0]?.url ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

  const formattedPrice = new Intl.NumberFormat('th-TH').format(listing.price);
  const unitLabel =
    listing.priceUnit === 'day' ? 'วัน' : listing.priceUnit === 'month' ? 'เดือน' : 'ปี';

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-pink-100/70 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <CategoryBadge category={listing.category} />
        </div>

        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={listing.status} size="sm" />
        </div>

        {/* Price tag pill */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm border border-white/60">
          <span className="text-base font-bold text-pink-600">฿{formattedPrice}</span>
          <span className="text-xs text-slate-500 font-normal"> /{unitLabel}</span>
        </div>
      </div>

      {/* 2. Card Content (ชื่อ, สถานะ, สถานที่) */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* ชื่อบ้าน / ชื่อรถ */}
          <h3 className="font-semibold text-slate-800 text-base line-clamp-1 group-hover:text-pink-600 transition-colors">
            {listing.title}
          </h3>

          {/* สถานที่ */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={14} className="text-sky-500 shrink-0" />
            <span className="truncate">{listing.locationName}</span>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>คลิกดูรายละเอียดเพิ่มเติม</span>
          <span className="w-7 h-7 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};
