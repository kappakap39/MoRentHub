import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Listing } from '../types';
import { StatusBadge, CategoryBadge } from '../components/common/Badge';
import { ListingFormModal } from '../components/admin/ListingFormModal';
import { StatusUpdateModal } from '../components/admin/StatusUpdateModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import {
  Plus,
  Edit,
  Trash2,
  CalendarCheck,
  Search,
  Home,
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  Eye,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusListing, setStatusListing] = useState<Listing | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const data = await api.getListings();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  // Statistics calculation
  const totalCount = listings.length;
  const houseCount = listings.filter((l) => l.category === 'HOUSE').length;
  const carCount = listings.filter((l) => l.category === 'CAR').length;
  const availableCount = listings.filter((l) => l.status === 'AVAILABLE').length;
  const rentedCount = listings.filter((l) => l.status === 'RENTED').length;

  const filteredListings = listings.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.locationName.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingListing(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (listing: Listing) => {
    setEditingListing(listing);
    setIsFormModalOpen(true);
  };

  const handleOpenStatus = (listing: Listing) => {
    setStatusListing(listing);
    setIsStatusModalOpen(true);
  };

  const handleOpenDelete = (listing: Listing) => {
    setDeletingListing(listing);
    setIsDeleteModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-pink-100 shadow-soft">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            ระบบจัดการข้อมูลเช่า (Admin Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ยินดีต้อนรับคุณ <strong className="text-pink-600">{user?.name || user?.username}</strong> — เพิ่ม แก้ไข ลบ และอัปเดตสถานะการเช่า
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white text-xs sm:text-sm font-semibold shadow-md transition-all shrink-0"
        >
          <Plus size={18} />
          <span>เพิ่มรายการใหม่</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Home size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">บ้าน/คอนโด</span>
            <span className="text-xl font-bold text-slate-800">{houseCount} หลัง</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Car size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">รถยนต์</span>
            <span className="text-xl font-bold text-slate-800">{carCount} คัน</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">ว่างให้เช่า</span>
            <span className="text-xl font-bold text-emerald-600">{availableCount} รายการ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">มีผู้เช่าแล้ว</span>
            <span className="text-xl font-bold text-rose-600">{rentedCount} รายการ</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'ALL' ? 'bg-pink-100 text-pink-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({totalCount})
          </button>
          <button
            onClick={() => setCategoryFilter('HOUSE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'HOUSE' ? 'bg-pink-100 text-pink-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            บ้าน/คอนโด ({houseCount})
          </button>
          <button
            onClick={() => setCategoryFilter('CAR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'CAR' ? 'bg-sky-100 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            รถยนต์ ({carCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ หรือสถานที่..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            <span className="text-xs text-slate-400">กำลังโหลดข้อมูล...</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            ไม่พบรายการข้อมูล
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">รูปภาพ & ชื่อรายการ</th>
                  <th className="py-3.5 px-3 font-semibold">หมวดหมู่</th>
                  <th className="py-3.5 px-3 font-semibold">ราคา</th>
                  <th className="py-3.5 px-3 font-semibold">สถานะการเช่า</th>
                  <th className="py-3.5 px-3 font-semibold">ระยะเวลาสัญญาเช่า</th>
                  <th className="py-3.5 px-3 font-semibold">สถานที่</th>
                  <th className="py-3.5 px-4 font-semibold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredListings.map((item) => {
                  const cover = item.images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80';
                  const unitLabel = item.priceUnit === 'day' ? 'วัน' : item.priceUnit === 'month' ? 'เดือน' : 'ปี';

                  return (
                    <tr key={item.id} className="hover:bg-pink-50/20 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cover}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <CategoryBadge category={item.category} />
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-semibold text-pink-600">
                        ฿{item.price.toLocaleString()} /{unitLabel}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} size="sm" />
                          <button
                            onClick={() => handleOpenStatus(item)}
                            title="คลิกเพื่ออัปเดตสถานะ"
                            className="p-1 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50"
                          >
                            <CalendarCheck size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Rental dates */}
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {item.rentalStartDate ? (
                          <div>
                            <span>{new Date(item.rentalStartDate).toLocaleDateString('th-TH')}</span>
                            <span className="text-slate-400"> ถึง </span>
                            <span>{item.rentalEndDate ? new Date(item.rentalEndDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">
                        {item.locationName}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View public */}
                          <a
                            href={`/listings/${item.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="ดูหน้าสาธารณะ"
                          >
                            <Eye size={15} />
                          </a>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleOpenDelete(item)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            title="ลบรายการ"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ListingFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        listingToEdit={editingListing}
        onSuccess={fetchListings}
      />

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        listing={statusListing}
        onSuccess={fetchListings}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        listing={deletingListing}
        onSuccess={fetchListings}
      />
    </div>
  );
};
