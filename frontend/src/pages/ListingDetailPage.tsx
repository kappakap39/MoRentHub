import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Listing } from '../types';
import { api } from '../services/api';
import { StatusBadge, CategoryBadge } from '../components/common/Badge';
import { MapView } from '../components/listings/MapView';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Share2,
  ExternalLink,
  Navigation,
} from 'lucide-react';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getListingById(id);
        setListing(data);
      } catch (err: any) {
        setError(err.message || 'ไม่พบข้อมูลรายการ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <span className="text-xs text-slate-500">กำลังโหลดรายละเอียด...</span>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-red-100 shadow-soft space-y-4">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <h2 className="text-lg font-bold text-slate-800">ไม่พบรายการที่คุณต้องการ</h2>
        <p className="text-xs text-slate-500">{error || 'รายการอาจถูกลบหรือไม่มีอยู่ในระบบ'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-50 text-pink-700 font-medium rounded-xl hover:bg-pink-100 text-xs"
        >
          <ArrowLeft size={16} />
          <span>กลับสู่หน้าแรก</span>
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('th-TH').format(listing.price);
  const unitLabel =
    listing.priceUnit === 'day' ? 'วัน' : listing.priceUnit === 'month' ? 'เดือน' : 'ปี';

  const images = listing.images.length > 0 ? listing.images.map((img) => img.url) : [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80',
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'ไม่ได้ระบุ';
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `ดูรายการเช่า: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
    }
  };

  // Directions (นำทาง): ฟิกเส้นทางจากตำแหน่งปัจจุบันของฉันไปยังจุดหมายปลายทางทันที
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}&travelmode=driving`;
  
  // View Location (ดูสถานที่): เปิดลิงก์หมุดสถานที่ตามที่แชร์ หรือเปิดค้นหาพิกัด
  const googleMapsSearchUrl = listing.mapUrl
    ? listing.mapUrl
    : `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`;

  return (
    <div className="space-y-8 pb-16">
      {/* Back button & Category badge */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>กลับหน้ารายการ</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-600 transition-all shadow-sm"
        >
          <Share2 size={14} />
          <span>แชร์รายการนี้</span>
        </button>
      </div>

      {/* Main Grid: Images & Summary details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Large Image */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 border border-pink-100 shadow-soft">
            <img
              src={images[activeImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <CategoryBadge category={listing.category} />
            </div>
            <div className="absolute top-4 right-4">
              <StatusBadge status={listing.status} />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-pink-500 scale-95 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Quick Booking Callout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={listing.status} size="sm" />
                <span className="text-xs text-slate-400">
                  อัปเดต: {new Date(listing.updatedAt).toLocaleDateString('th-TH')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
                {listing.title}
              </h1>
            </div>

            {/* Price block */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-sky-50 border border-pink-100/60">
              <div className="text-xs text-slate-500 font-medium">ราคาค่าเช่า</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-pink-600">฿{formattedPrice}</span>
                <span className="text-sm font-medium text-slate-600">/{unitLabel}</span>
              </div>
            </div>

            {/* Rental Period (วันที่เช่าถึงวันที่สิ้นสุด - แอดมินเป็นผู้อัปเดต) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Calendar size={16} className="text-sky-500" />
                <span>ระยะเวลาสัญญาเช่า / ข้อมูลการจอง</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">วันที่เริ่มเช่า:</span>
                  <span className="font-medium text-slate-700">{formatDate(listing.rentalStartDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">วันที่สิ้นสุด:</span>
                  <span className="font-medium text-slate-700">{formatDate(listing.rentalEndDate)}</span>
                </div>
              </div>
            </div>

            {/* Location info */}
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <MapPin size={16} className="text-pink-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block">{listing.locationName}</span>
                {listing.address && !listing.address.startsWith('http') && (
                  <span className="text-slate-500 text-[11px]">{listing.address}</span>
                )}
              </div>
            </div>

            {/* Official Contact Box: "ถ้ากดสนใจเช่าจะต้อง ติดต่อตามข้อมูลที่แอดมินให้ไปเท่านั้น" */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-1.5 text-pink-600 text-xs font-bold">
                <ShieldCheck size={18} />
                <span>สนใจเช่า ติดต่อแอดมินโดยตรงเท่านั้น</span>
              </div>
              <p className="text-[11px] text-slate-500">
                เพื่อความปลอดภัยสูงสุดและป้องกันการแอบอ้าง ติดต่อสอบถามหรือนัดหมายได้ตามช่องทางที่แอดมินระบุไว้ด้านล่างนี้เท่านั้น:
              </p>

              <div className="space-y-2 pt-1">
                {/* Phone */}
                <a
                  href={`tel:${listing.contactPhone}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors border border-pink-100 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-pink-600" />
                    <span>โทร: {listing.contactPhone} ({listing.contactName})</span>
                  </div>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded-lg border border-pink-200">
                    โทรออกทันที
                  </span>
                </a>

                {/* Line */}
                {listing.contactLine && (
                  <a
                    href={`https://line.me/ti/p/~${listing.contactLine.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors border border-emerald-100 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle size={16} className="text-emerald-600" />
                      <span>LINE: {listing.contactLine}</span>
                    </div>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                      แชททางไลน์
                    </span>
                  </a>
                )}

                {/* Facebook */}
                {listing.contactFacebook && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 transition-colors border border-sky-100 text-xs font-semibold">
                    <div className="flex items-center gap-2.5">
                      <Facebook size={16} className="text-sky-600" />
                      <span>Facebook: {listing.contactFacebook}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft space-y-4">
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
          รายละเอียดและเงื่อนไขการเช่า
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {listing.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
        </p>
      </div>

      {/* Map & Google Maps Navigation Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            พิกัดแผนที่และการเดินทาง
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ดูตำแหน่งที่ตั้งจริง และเปิดระบบนำทางด้วย Google Maps เพื่อคำนวณเส้นทางถนนจริง
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map Viewer (8 cols) */}
          <div className="lg:col-span-8">
            <MapView
              destLat={listing.latitude}
              destLng={listing.longitude}
              destTitle={listing.title}
            />
          </div>

          {/* Navigation Action Box (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-pink-100 shadow-soft flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm">
                <MapPin size={18} />
                <span>สถานที่ตั้ง</span>
              </div>
              <p className="text-xs font-medium text-slate-700">{listing.locationName}</p>
              {listing.address && !listing.address.startsWith('http') && (
                <p className="text-[11px] text-slate-500 leading-relaxed">{listing.address}</p>
              )}
              <div className="pt-2 text-[11px] text-slate-400">
                {listing.mapUrl ? (
                  <span className="text-sky-600 font-medium flex items-center gap-1">
                    <MapPin size={13} className="text-sky-500" /> หมุดตรงตามลิงก์ Google Maps
                  </span>
                ) : (
                  <span className="font-mono">พิกัด: {listing.latitude.toFixed(5)}, {listing.longitude.toFixed(5)}</span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              {/* Turn-by-turn navigation via Google Maps */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              >
                <Navigation size={16} />
                <span>เปิดนำทาง Google Maps</span>
              </a>

              {/* View on Google Maps pin */}
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-xl border border-slate-200 transition-all"
              >
                <ExternalLink size={14} />
                <span>ดูสถานที่บน Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
