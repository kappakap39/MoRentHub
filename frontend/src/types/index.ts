export type CategoryType = 'HOUSE' | 'CAR';
export type StatusType = 'AVAILABLE' | 'RENTED';
export type PriceUnitType = 'day' | 'month' | 'year';

export interface ListingImage {
  id: number;
  listingId: number;
  url: string;
  isCover: boolean;
  createdAt: string;
}

export interface Listing {
  id: number;
  category: CategoryType;
  title: string;
  description: string;
  price: number;
  priceUnit: PriceUnitType;
  status: StatusType;
  rentalStartDate: string | null;
  rentalEndDate: string | null;
  locationName: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
  contactLine?: string | null;
  contactFacebook?: string | null;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingInputPayload {
  category: CategoryType;
  title: string;
  description: string;
  price: number;
  priceUnit: PriceUnitType;
  status: StatusType;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
  locationName: string;
  address?: string | null;
  latitude?: number;
  longitude?: number;
  contactName: string;
  contactPhone: string;
  contactLine?: string | null;
  contactFacebook?: string | null;
  images?: string[];
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
}

export interface CaptchaData {
  svg: string;
  token: string;
}
