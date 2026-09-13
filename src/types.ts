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
  titleEn: string;
  titleAr: string;
  categoryId: string;
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

export type CurrencyCode = 'USD' | 'SAR' | 'EUR';

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
