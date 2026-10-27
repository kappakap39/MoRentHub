import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Listing, StatusType } from '../../types';
import { api } from '../../services/api';
import { CheckCircle2, Clock } from 'lucide-react';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onSuccess: () => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSuccess,
}) => {
  const [status, setStatus] = useState<StatusType>('AVAILABLE');
  const [rentalStartDate, setRentalStartDate] = useState<string>('');
  const [rentalEndDate, setRentalEndDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listing) {
      setStatus(listing.status);
      setRentalStartDate(
        listing.rentalStartDate ? listing.rentalStartDate.split('T')[0] : ''
      );
      setRentalEndDate(
        listing.rentalEndDate ? listing.rentalEndDate.split('T')[0] : ''
      );
      setError(null);
    }
  }, [listing]);

  if (!listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.updateListingStatus(listing.id, {
        status,
        rentalStartDate: rentalStartDate || null,
        rentalEndDate: rentalEndDate || null,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถอัปเดตสถานะได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="อัปเดตสถานะการเช่าและระยะเวลา"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500">ชื่อรายการ:</p>
          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{listing.title}</p>
        </div>

        {/* Status Radios */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            สถานะปัจจุบัน:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus('AVAILABLE')}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                status === 'AVAILABLE'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 size={16} className={status === 'AVAILABLE' ? 'text-emerald-600' : 'text-slate-400'} />
              <span>ว่างให้เช่า (AVAILABLE)</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('RENTED')}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                status === 'RENTED'
                  ? 'border-rose-400 bg-rose-50 text-rose-800 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock size={16} className={status === 'RENTED' ? 'text-rose-600' : 'text-slate-400'} />
              <span>มีผู้เช่าแล้ว (RENTED)</span>
            </button>
          </div>
        </div>

        {/* Rental Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              วันที่เริ่มเช่า / เปิดจอง:
            </label>
            <input
              type="date"
              value={rentalStartDate}
              onChange={(e) => setRentalStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              วันที่สิ้นสุดสัญญาเช่า:
            </label>
            <input
              type="date"
              value={rentalEndDate}
              onChange={(e) => setRentalEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>
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
            disabled={isSubmitting}
            className="px-5 py-2 text-xs sm:text-sm rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกสถานะ'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
