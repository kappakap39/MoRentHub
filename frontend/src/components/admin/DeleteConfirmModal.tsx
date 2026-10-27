import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Listing } from '../../types';
import { api } from '../../services/api';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onSuccess: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!listing) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteListing(listing.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถลบรายการได้');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ยืนยันการลบข้อมูล"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-2xl border border-red-100">
          <AlertTriangle size={24} className="shrink-0 text-red-500" />
          <p className="text-xs sm:text-sm font-medium">
            คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500">ชื่อรายการ:</p>
          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{listing.title}</p>
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 text-xs sm:text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-all disabled:opacity-50"
          >
            {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบรายการ'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
