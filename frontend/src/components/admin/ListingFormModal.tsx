import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Listing, CategoryType, StatusType, PriceUnitType } from '../../types';
import { api } from '../../services/api';
import { Upload, X, Plus, MapPin, Loader2 } from 'lucide-react';

interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingToEdit: Listing | null;
  onSuccess: () => void;
}

export const ListingFormModal: React.FC<ListingFormModalProps> = ({
  isOpen,
  onClose,
  listingToEdit,
  onSuccess,
}) => {
  const [category, setCategory] = useState<CategoryType>('HOUSE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priceUnit, setPriceUnit] = useState<PriceUnitType>('month');
  const [status, setStatus] = useState<StatusType>('AVAILABLE');
  const [rentalStartDate, setRentalStartDate] = useState('');
  const [rentalEndDate, setRentalEndDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [latitude, setLatitude] = useState<number>(13.7563);
  const [longitude, setLongitude] = useState<number>(100.5018);
  const [contactName, setContactName] = useState('Admin Rental');
  const [contactPhone, setContactPhone] = useState('089-123-4567');
  const [contactLine, setContactLine] = useState('');
  const [contactFacebook, setContactFacebook] = useState('');

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolvingMap, setIsResolvingMap] = useState(false);
  const [mapResolveStatus, setMapResolveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listingToEdit) {
      setCategory(listingToEdit.category);
      setTitle(listingToEdit.title);
      setDescription(listingToEdit.description);
      setPrice(listingToEdit.price);
      setPriceUnit(listingToEdit.priceUnit);
      setStatus(listingToEdit.status);
      setRentalStartDate(listingToEdit.rentalStartDate ? listingToEdit.rentalStartDate.split('T')[0] : '');
      setRentalEndDate(listingToEdit.rentalEndDate ? listingToEdit.rentalEndDate.split('T')[0] : '');
      setLocationName(listingToEdit.locationName);
      setAddress(listingToEdit.address || '');
      setMapUrl(listingToEdit.mapUrl || '');
      setLatitude(listingToEdit.latitude);
      setLongitude(listingToEdit.longitude);
      setContactName(listingToEdit.contactName);
      setContactPhone(listingToEdit.contactPhone);
      setContactLine(listingToEdit.contactLine || '');
      setContactFacebook(listingToEdit.contactFacebook || '');
      setImages(listingToEdit.images.map((img) => img.url));
    } else {
      // Reset form
      setCategory('HOUSE');
      setTitle('');
      setDescription('');
      setPrice('');
      setPriceUnit('month');
      setStatus('AVAILABLE');
      setRentalStartDate('');
      setRentalEndDate('');
      setLocationName('');
      setAddress('');
      setMapUrl('');
      setLatitude(13.7563);
      setLongitude(100.5018);
      setContactName('Admin Rental');
      setContactPhone('089-123-4567');
      setContactLine('');
      setContactFacebook('');
      setImages([]);
    }
    setError(null);
  }, [listingToEdit, isOpen]);

  // Handle local file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    try {
      const uploadedUrls = await api.uploadImages(files);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle map URL change & auto-extract coordinates if full Google Maps link is pasted
  const handleMapUrlChange = async (value: string) => {
    setMapUrl(value);
    setMapResolveStatus(null);
    const trimmed = value.trim();
    if (!trimmed) return;

    // Pattern 1: !3d12.6155991!4d99.9512898
    const m1 = trimmed.match(/!3d(-?\d+(?:\.\d+)?)(?:!4d|.*!4d)(-?\d+(?:\.\d+)?)/);
    if (m1) {
      const lat = parseFloat(m1[1]);
      const lng = parseFloat(m1[2]);
      setLatitude(lat);
      setLongitude(lng);
      setMapResolveStatus(`ดึงพิกัดสำเร็จ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      return;
    }

    // Pattern 2: query=... หรือ place/...
    const m2 = trimmed.match(/(?:[?&](?:q|query)=|place\/)(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (m2) {
      const lat = parseFloat(m2[1]);
      const lng = parseFloat(m2[2]);
      setLatitude(lat);
      setLongitude(lng);
      setMapResolveStatus(`ดึงพิกัดสำเร็จ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      return;
    }

    // Pattern 3: @lat,lng
    const m3 = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m3) {
      const lat = parseFloat(m3[1]);
      const lng = parseFloat(m3[2]);
      setLatitude(lat);
      setLongitude(lng);
      setMapResolveStatus(`ดึงพิกัดสำเร็จ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      return;
    }

    // สำหรับ short link (goo.gl, maps.app) หรือลิงก์หมุดสถานที่ ให้เรียก API ช่วยแกะพิกัด
    if (trimmed.startsWith('http')) {
      setIsResolvingMap(true);
      try {
        const coords = await api.resolveMapCoords(trimmed);
        if (coords) {
          setLatitude(coords.lat);
          setLongitude(coords.lng);
          setMapResolveStatus(`ดึงพิกัดจากลิงก์ Google Maps สำเร็จ: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
        }
      } catch (err) {
        console.warn('Map resolving error:', err);
      } finally {
        setIsResolvingMap(false);
      }
    }
  };

  const handleAddressChange = (value: string) => {
    // ถ้าผู้ใช้เผลอนำลิงก์แผนที่มาวางในช่องที่อยู่
    if (value.includes('maps.app.goo.gl') || value.includes('goo.gl/maps') || value.includes('google.com/maps')) {
      setAddress('');
      handleMapUrlChange(value.trim());
      return;
    }
    setAddress(value);
  };

  // Get current GPS for coordinates
  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(6)));
        },
        () => {
          alert('ไม่สามารถดึงพิกัดจาก GPS ได้');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price === '' || !locationName.trim() || !contactPhone.trim()) {
      setError('กรุณากรอกข้อมูลสำคัญ (ชื่อ, ราคา, สถานที่, เบอร์โทรติดต่อ)');
      return;
    }

    if (images.length === 0) {
      setError('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let finalMapUrl = mapUrl.trim() || null;
    let finalAddress = address.trim();

    if (finalAddress && (finalAddress.includes('maps.app.goo.gl') || finalAddress.includes('goo.gl/maps') || finalAddress.includes('google.com/maps'))) {
      if (!finalMapUrl) {
        finalMapUrl = finalAddress;
      }
      finalAddress = '';
    }

    const payload = {
      category,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      priceUnit,
      status,
      rentalStartDate: rentalStartDate || null,
      rentalEndDate: rentalEndDate || null,
      locationName: locationName.trim(),
      address: finalAddress,
      mapUrl: finalMapUrl,
      latitude,
      longitude,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactLine: contactLine.trim() || null,
      contactFacebook: contactFacebook.trim() || null,
      images,
    };

    try {
      if (listingToEdit) {
        await api.updateListing(listingToEdit.id, payload);
      } else {
        await api.createListing(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={listingToEdit ? 'แก้ไขข้อมูลรายการเช่า' : 'เพิ่มรายการเช่าใหม่ (รถ/บ้าน)'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่ *</label>
            <select
              value={category}
              onChange={(e) => {
                const cat = e.target.value as CategoryType;
                setCategory(cat);
                if (cat === 'CAR' && priceUnit === 'month') setPriceUnit('day');
                if (cat === 'HOUSE' && priceUnit === 'day') setPriceUnit('month');
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
            >
              <option value="HOUSE">🏡 บ้าน / คอนโด (House / Condo)</option>
              <option value="CAR">🚗 รถยนต์ (Car)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">สถานะ *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
            >
              <option value="AVAILABLE">ว่างให้เช่า (AVAILABLE)</option>
              <option value="RENTED">มีผู้เช่าแล้ว / ไม่ว่าง (RENTED)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อบ้าน หรือ ยี่ห้อ/รุ่นรถ *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น พูลวิลล่าสไตล์โมเดิร์น เชียงใหม่ หรือ Toyota Camry 2.5 HEV"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>

        {/* Price & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ราคาค่าเช่า (บาท) *</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="เช่น 2500 หรือ 35000"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">หน่วยเวลา *</label>
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value as PriceUnitType)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
            >
              <option value="day">ต่อวัน (บาท/วัน)</option>
              <option value="month">ต่อเดือน (บาท/เดือน)</option>
              <option value="year">ต่อปี (บาท/ปี)</option>
            </select>
          </div>
        </div>

        {/* Rental Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">วันที่เริ่มเช่า / เปิดจอง</label>
            <input
              type="date"
              value={rentalStartDate}
              onChange={(e) => setRentalStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">วันที่สิ้นสุดสัญญาเช่า</label>
            <input
              type="date"
              value={rentalEndDate}
              onChange={(e) => setRentalEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">รายละเอียด *</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ระบุจุดเด่น สิ่งอำนวยความสะดวก เงื่อนไขการเช่า ฯลฯ"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>

        {/* Location & Coordinates */}
        <div className="space-y-3 p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-800 flex items-center gap-1.5">
              <MapPin size={16} className="text-sky-500" />
              <span>สถานที่และพิกัดแผนที่ (สำหรับคำนวณระยะทาง)</span>
            </span>
            <button
              type="button"
              onClick={handleGetCoordinates}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium underline"
            >
              ใช้ GPS ปัจจุบัน
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">ชื่อสถานที่/ย่าน *</label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="เช่น เชียงใหม่ หางดง, กรุงเทพฯ สุขุมวิท 39"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">ที่อยู่เต็ม (ถ้ามี)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="บ้านเลขที่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Google Maps Direct Share Link */}
          <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1.5">
            <label className="block text-xs font-semibold text-sky-900">
              📍 ลิงก์แชร์ Google Maps (แนะนำ แม่นยำที่สุด)
            </label>
            <input
              type="url"
              value={mapUrl}
              onChange={(e) => handleMapUrlChange(e.target.value)}
              placeholder="วางลิงก์ เช่น https://maps.app.goo.gl/RKMiEwGzBQVz54a89"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 placeholder:text-slate-400"
            />
            {isResolvingMap && (
              <p className="text-[11px] text-sky-600 animate-pulse font-medium flex items-center gap-1 mt-1">
                <Loader2 size={12} className="animate-spin" /> กำลังตรวจสอบและดึงพิกัดจากลิงก์ Google Maps...
              </p>
            )}
            {mapResolveStatus && !isResolvingMap && (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                ✅ {mapResolveStatus}
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              💡 วิธีแชร์: เปิด Google Maps บนมือถือหรือคอม กดที่จุดสถานที่แล้วกด <strong>"แชร์ (Share)"</strong> แล้วคัดลอกลิงก์มาวางได้เลยครับ ระบบจะดึงพิกัดจริงให้อัตโนมัติทันที
            </p>
          </div>

          <div className="pt-1">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              พิกัด GPS สำรอง (ละติจูด, ลองจิจูด)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ละติจูด (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ลองจิจูด (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
          <span className="text-xs font-semibold text-pink-800 block">
            ข้อมูลติดต่อผู้ให้เช่า (แอดมิน)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">ชื่อผู้ติดต่อ *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="ชื่อผู้ดูแล"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="08X-XXX-XXXX"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">LINE ID</label>
              <input
                type="text"
                value={contactLine}
                onChange={(e) => setContactLine(e.target.value)}
                placeholder="@mylineid หรือ myline"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Facebook / Page</label>
              <input
                type="text"
                value={contactFacebook}
                onChange={(e) => setContactFacebook(e.target.value)}
                placeholder="ชื่อเพจ หรือ ลิงก์โปรไฟล์"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Images Management */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">รูปภาพ ({images.length} รูป) *</label>

          {/* Upload file button or URL input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-pink-300 hover:border-pink-500 rounded-xl bg-pink-50/50 hover:bg-pink-50 text-pink-600 text-xs font-semibold transition-all">
              <Upload size={16} />
              <span>{isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปจากเครื่อง'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="หรือวางลิงก์รูปภาพ (URL)"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1"
              >
                <Plus size={14} />
                <span>เพิ่ม</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            💡 แนะนำ: รองรับการเลือกรูปจากเครื่อง (จัดเก็บคลาวด์ถาวรอัตโนมัติ) หรือคัดลอกลิงก์ตรงจาก ImgBB มาวางได้
          </p>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img src={imgUrl} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-pink-600 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                      ภาพปก
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-6 py-2 text-xs sm:text-sm rounded-xl bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-medium shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังบันทึก...' : listingToEdit ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
