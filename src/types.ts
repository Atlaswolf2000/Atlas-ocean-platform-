export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  icon?: string;
  image?: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name?: string;
  titleEn: string;
  titleAr: string;
  categoryId: string;
  department?: string;
  brand: string;
  vendor?: string;
  price: number;
  currency: string;
  moq: number; // Minimum Order Quantity
  unit: string; // e.g. "Piece", "Set", "Ton", "Roll"
  stock: number;
  image: string;
  images?: string[];
  descriptionEn: string;
  descriptionAr: string;
  specs: { [key: string]: string };
  isFeatured: boolean;
  rating: number;
  ordersCount: number;
  createdAt: string;
  badge?: string;
  badgeAr?: string;
}

export interface DepartmentProduct {
  id: string;
  name: string;
  department: string;
  price: number;
  currency: 'SAR';
  moq: string;
  rating: number;
  vendor: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  items: {
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed' | 'Cancelled';
  date: string;
  paymentMethod: string;
  notes?: string;
}

export type Language = 'en' | 'ar';

export type CurrencyCode = 'USD' | 'SAR' | 'EUR' | 'IQD';

export interface RFQSubmission {
  id: string;
  productId: string;
  productTitle: string;
  targetQuantity: number;
  destinationPort: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  incoterm?: 'FOB' | 'CIF' | 'CNF' | 'EXW';
  notes?: string;
  createdAt: string;
  status: 'Pending' | 'Reviewing' | 'Quoted';
}

export interface VendorApplication {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  businessType: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  logo?: string;
}
