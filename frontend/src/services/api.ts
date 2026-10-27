import { Listing, CaptchaData, AdminUser, ListingInputPayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // === Public Listing Endpoints ===
  async getListings(params?: { category?: string; status?: string; search?: string }): Promise<Listing[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/listings?${query.toString()}`);
    if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลรายการได้');
    return res.json();
  },

  async getListingById(id: number | string): Promise<Listing> {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`);
    if (!res.ok) throw new Error('ไม่พบข้อมูลรายการ');
    return res.json();
  },

  // === Authentication Endpoints ===
  async getCaptcha(): Promise<CaptchaData> {
    const res = await fetch(`${API_BASE_URL}/auth/captcha`);
    if (!res.ok) throw new Error('ไม่สามารถโหลดรหัส Captcha ได้');
    return res.json();
  },

  async login(payload: {
    username: string;
    password: string;
    captchaAnswer: string;
    captchaToken: string;
  }): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
    return data;
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Token ไม่ถูกต้อง');
    return res.json();
  },

  async updateProfile(payload: {
    username?: string;
    currentPassword: string;
    newPassword?: string;
    name?: string;
  }): Promise<{ token: string; user: AdminUser; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
    return data;
  },

  // === Admin Listing Management ===
  async createListing(listingData: ListingInputPayload): Promise<Listing> {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(listingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'ไม่สามารถสร้างรายการได้');
    return data.listing;
  },

  async updateListing(id: number, listingData: Partial<ListingInputPayload>): Promise<Listing> {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(listingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'ไม่สามารถอัปเดตรายการได้');
    return data.listing;
  },

  async updateListingStatus(
    id: number,
    payload: { status: string; rentalStartDate?: string | null; rentalEndDate?: string | null }
  ): Promise<Listing> {
    const res = await fetch(`${API_BASE_URL}/listings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'ไม่สามารถอัปเดตสถานะได้');
    return data.listing;
  },

  async deleteListing(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('ไม่สามารถลบรายการได้');
  },

  async uploadImages(files: FileList | File[]): Promise<string[]> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/listings/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'อัปโหลดรูปภาพล้มเหลว');
    return data.urls;
  },
};
