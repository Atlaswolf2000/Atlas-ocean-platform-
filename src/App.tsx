/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategorySidebar } from './components/CategorySidebar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ProductDetailModal } from './components/ProductDetailModal';
import { UploadProductModal } from './components/UploadProductModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CompareModal } from './components/CompareModal';
import { PriceFilter, SortOption } from './components/PriceFilter';
import { InvoiceModal } from './components/InvoiceModal';
import { RecentlyViewed } from './components/RecentlyViewed';
import { FaqSection } from './components/FaqSection';
import { NewsletterSection } from './components/NewsletterSection';
import { MaterialCardsModal } from './components/MaterialCardsModal';
import { StoreManagementModal } from './components/StoreManagementModal';
import { CreateStoreModal } from './components/CreateStoreModal';
import { VendorAccessModal } from './components/VendorAccessModal';
import { DepartmentsProductsGrid } from './components/DepartmentsProductsGrid';
import { VendorDashboard } from './components/VendorDashboard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ShoppingCartDrawer } from './components/ShoppingCartDrawer';
import { Footer } from './components/Footer';

import { Category, Product, Order, CartItem, Language, CurrencyCode, VendorApplication, DepartmentProduct } from './types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialData';
import { convertDepartmentProductToProduct } from './data/departmentProducts';

const INITIAL_VENDORS: VendorApplication[] = [
  {
    id: 'vendor-app-1',
    storeName: 'متجر الرافدين للمعدات والآليات الثقيلة',
    ownerName: 'أحمد جاسم الشمري',
    email: 'ahmed.heavy@rafidain.iq',
    phone: '07701234567',
    businessType: 'معدات صناعية وتشييد',
    description: 'توريد معدات التشييد وقطع غيار المولدات والآليات الثقيلة مع ضمان وخدمات ما بعد البيع في العراق.',
    status: 'pending',
    createdAt: '2026-03-15 11:30 ص',
  },
  {
    id: 'vendor-app-2',
    storeName: 'شركة النهرين للإلكترونيات والأجهزة الذكية',
    ownerName: 'سامر محمود',
    email: 'samer@nahrain-tech.iq',
    phone: '07809876543',
    businessType: 'إلكترونيات وشاشات تفاعلية',
    description: 'مورد معتمد للشاشات التفاعلية وحلول الصوت الاحترافية وأنظمة التحكم الذكية للمؤسسات والشركات.',
    status: 'approved',
    createdAt: '2026-03-10 09:15 ص',
    approvedAt: '2026-03-12 02:00 م',
  },
  {
    id: 'vendor-app-3',
    storeName: 'مؤسسة بابل للتجهيزات المنزلية والمطاعم',
    ownerName: 'كرار العبيدي',
    email: 'karrar@babil-home.iq',
    phone: '07501122334',
    businessType: 'معدات وأجهزة مطابخ تجارية',
    description: 'استيراد وتوريد معدات المطاعم والمقاهي والأفران الصناعية مع شهادة المنشأ.',
    status: 'rejected',
    createdAt: '2026-03-08 04:45 م',
    rejectionReason: 'يرجى تقديم وثيقة السجل التجاري المعتمدة وتحديث رقم الهاتف المسجل لتأكيد الحساب.',
  },
];

export default function App() {
  // Language state (default Arabic or English, supports both with RTL/LTR)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('ao_lang');
    return (saved as Language) || 'en';
  });

  // Multi-Currency state (USD, SAR, EUR display-only)
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('ao_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  // Data states with persistence in localStorage
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ao_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_CATEGORIES.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atlas_products') || localStorage.getItem('ao_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const parsedIds = new Set(parsed.map((p: Product) => p.id));
          const list = parsed.map((p: Product) => {
            const initial = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
            return initial
              ? { ...initial, ...p, badge: p.badge || initial.badge, badgeAr: p.badgeAr || initial.badgeAr }
              : p;
          });
          // Ensure all 24 initial department products exist in state
          INITIAL_PRODUCTS.forEach((ip) => {
            if (!parsedIds.has(ip.id)) {
              list.push(ip);
            }
          });
          return list;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Quick Sort state (الفرز السريع للمنتجات)
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ao_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ao_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Feature 1: Wishlist state & persistence
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ao_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Feature 3: Product Comparison state
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Feature 4: Price Filter state
  const globalMinPrice = 0;
  const globalMaxPrice = (Array.isArray(products) && products.length > 0)
    ? Math.max(
        100,
        Math.ceil(
          Math.max(...products.map((p) => (typeof p?.price === 'number' && !isNaN(p.price) ? p.price : 0)))
        )
      )
    : 2500;
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 2500,
  });

  // Feature 5: Invoice Print Order state
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Dark / Light Mode Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ao_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Recent Views History state
  const [recentProductIds, setRecentProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ao_recent_views');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bulk / Single Upload Mode
  const [uploadModalMode, setUploadModalMode] = useState<'single' | 'bulk'>('single');

  // UI & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMaterialCardsOpen, setIsMaterialCardsOpen] = useState(false);
  const [storeManagementModal, setStoreManagementModal] = useState<{
    isOpen: boolean;
    tab: 'main-catalog' | 'store-products' | 'add-product' | 'store-profile' | 'store-contact';
  }>({
    isOpen: false,
    tab: 'main-catalog',
  });

  // Multi-Vendor System State (نظام تعدد التجار واعتماد الإدارة)
  const [vendors, setVendors] = useState<VendorApplication[]>(() => {
    const saved = localStorage.getItem('atlas_vendors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_VENDORS;
  });

  const [currentVendorId, setCurrentVendorId] = useState<string | null>(() => {
    const saved = localStorage.getItem('atlas_current_vendor_id');
    return saved || 'vendor-app-1'; // Defaults to sample vendor for demo
  });

  const [activeStoreVendor, setActiveStoreVendor] = useState<VendorApplication | null>(null);
  const [isVendorDashboardOpen, setIsVendorDashboardOpen] = useState(false);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [vendorAccessModal, setVendorAccessModal] = useState<{
    isOpen: boolean;
    vendor: VendorApplication | null;
    status: 'pending' | 'rejected' | 'not_applied' | 'approved';
  }>({
    isOpen: false,
    vendor: null,
    status: 'not_applied',
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [whatsAppModal, setWhatsAppModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Persist data changes
  useEffect(() => {
    localStorage.setItem('ao_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ao_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ao_products', JSON.stringify(products));
    localStorage.setItem('atlas_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ao_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ao_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ao_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ao_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('atlas_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    if (currentVendorId) {
      localStorage.setItem('atlas_current_vendor_id', currentVendorId);
    } else {
      localStorage.removeItem('atlas_current_vendor_id');
    }
  }, [currentVendorId]);

  // Theme effect: apply/remove .dark on html tag
  useEffect(() => {
    localStorage.setItem('ao_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Recent Views Tracking
  const handleSelectProduct = (product: Product) => {
    setSelectedProductDetail(product);
    setRecentProductIds((prev) => {
      const filtered = prev.filter((id) => id !== product.id);
      const next = [product.id, ...filtered].slice(0, 5);
      localStorage.setItem('ao_recent_views', JSON.stringify(next));
      return next;
    });
  };

  const handleClearRecentHistory = () => {
    setRecentProductIds([]);
    localStorage.removeItem('ao_recent_views');
  };

  // Wishlist handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Compare handlers
  const handleToggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          // Keep maximum 4 items for clean comparison table
          return [...prev.slice(1), product];
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Invoice Print handler
  const handlePrintInvoice = (order: Order) => {
    setInvoiceOrder(order);
  };

  // Product actions
  const handleAddProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'ordersCount'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      ordersCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Update item count for the category
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === newProduct.categoryId ? { ...cat, itemCount: cat.itemCount + 1 } : cat
      )
    );
  };

  const handleBulkAddProducts = (newProducts: Omit<Product, 'id' | 'createdAt' | 'rating' | 'ordersCount'>[]) => {
    const createdItems: Product[] = newProducts.map((p, idx) => ({
      ...p,
      id: `prod-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      ordersCount: 0,
    }));
    setProducts((prev) => [...createdItems, ...prev]);

    // Update categories count
    setCategories((prev) =>
      prev.map((cat) => {
        const addedCount = createdItems.filter((item) => item.categoryId === cat.id).length;
        return addedCount > 0 ? { ...cat, itemCount: cat.itemCount + addedCount } : cat;
      })
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleSaveMaterialProduct = (product: Product, isNew: boolean) => {
    if (isNew) {
      setProducts((prev) => [product, ...prev]);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === product.categoryId ? { ...cat, itemCount: (cat.itemCount || 0) + 1 } : cat
        )
      );
    } else {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    }
  };

  // Category actions
  const handleAddCategory = (nameEn: string, nameAr: string, image?: string): Category => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      nameEn,
      nameAr,
      slug: nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemCount: 0,
      image,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const handleUpdateCategoryImage = (categoryId: string, imageUrl: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, image: imageUrl } : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
  };

  // Order actions
  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `AO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString(),
      status: 'Pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Cart actions
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: Math.max(product.moq, qty) }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Reset to default sample data
  const handleResetDemoData = () => {
    if (window.confirm(lang === 'ar' ? 'هل تريد استعادة بيانات منصة Atlas Ocean الأصلية؟' : 'Reset to default Atlas Ocean catalog?')) {
      setCategories(INITIAL_CATEGORIES);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setVendors(INITIAL_VENDORS);
      setCurrentVendorId('vendor-app-1');
      setActiveStoreVendor(null);
      setCart([]);
      setWishlist([]);
      setCompareList([]);
      setRecentProductIds([]);
      setPriceRange({ min: 0, max: 2500 });
      localStorage.removeItem('ao_categories');
      localStorage.removeItem('ao_products');
      localStorage.removeItem('ao_orders');
      localStorage.removeItem('ao_cart');
      localStorage.removeItem('ao_wishlist');
      localStorage.removeItem('ao_recent_views');
      localStorage.removeItem('atlas_vendors');
      localStorage.removeItem('atlas_current_vendor_id');
    }
  };

  // Multi-Vendor Handlers (إنشاء متجر، تحديث حالة الموافقة، وحذف الطلب)
  const handleCreateVendor = (newAppData: Omit<VendorApplication, 'id' | 'status' | 'createdAt'>) => {
    const newVendor: VendorApplication = {
      ...newAppData,
      id: `vendor-app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setVendors((prev) => [newVendor, ...prev]);
    setCurrentVendorId(newVendor.id);
    setIsCreateStoreOpen(false);

    // Provide immediate user feedback: show access status as pending
    setVendorAccessModal({
      isOpen: true,
      vendor: newVendor,
      status: 'pending',
    });
  };

  const handleUpdateVendorStatus = (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    const nowStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status,
            rejectionReason: status === 'rejected' ? (rejectionReason || 'لم يتم استيفاء شروط الاعتماد المطلوبة') : undefined,
            approvedAt: status === 'approved' ? nowStr : undefined,
          };
        }
        return v;
      })
    );

    // If the active store vendor is this one, update its object in state as well
    if (activeStoreVendor && activeStoreVendor.id === id) {
      setActiveStoreVendor((prev) =>
        prev
          ? {
              ...prev,
              status,
              rejectionReason: status === 'rejected' ? (rejectionReason || 'لم يتم استيفاء شروط الاعتماد المطلوبة') : undefined,
              approvedAt: status === 'approved' ? nowStr : undefined,
            }
          : null
      );
    }
  };

  const handleDeleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    if (currentVendorId === id) {
      setCurrentVendorId(null);
    }
    if (activeStoreVendor && activeStoreVendor.id === id) {
      setActiveStoreVendor(null);
    }
  };

  // Access Control: تقييد صلاحيات الدخول لنظام إدارة المتجر (Store Manager)
  const handleAttemptOpenStoreManagement = (tab?: 'main-catalog' | 'store-products' | 'add-product' | 'store-profile' | 'store-contact') => {
    // 1. Identify current vendor application
    const currentApp = vendors.find((v) => v.id === currentVendorId) || vendors[0] || null;

    if (!currentApp) {
      // User hasn't applied for a store yet
      setVendorAccessModal({
        isOpen: true,
        vendor: null,
        status: 'not_applied',
      });
      return;
    }

    if (currentApp.status === 'approved') {
      // Access Granted!
      setActiveStoreVendor(currentApp);
      setStoreManagementModal({
        isOpen: true,
        tab: tab || 'store-products',
      });
    } else if (currentApp.status === 'pending') {
      // Access Denied: Application Under Review
      setVendorAccessModal({
        isOpen: true,
        vendor: currentApp,
        status: 'pending',
      });
    } else if (currentApp.status === 'rejected') {
      // Access Denied: Application Rejected
      setVendorAccessModal({
        isOpen: true,
        vendor: currentApp,
        status: 'rejected',
      });
    }
  };

  // Filter & sort products for display
  const safeProducts = Array.isArray(products) ? products : INITIAL_PRODUCTS;

  const filteredProducts = safeProducts.filter((p) => {
    if (!p) return false;
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = q
      ? (p.titleEn || '').toLowerCase().includes(q) ||
        (p.titleAr || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.descriptionEn || '').toLowerCase().includes(q) ||
        (p.descriptionAr || '').toLowerCase().includes(q)
      : true;
    const priceVal = typeof p.price === 'number' && !isNaN(p.price) ? p.price : 0;
    const minVal = typeof priceRange?.min === 'number' && !isNaN(priceRange.min) ? priceRange.min : 0;
    const maxVal = typeof priceRange?.max === 'number' && !isNaN(priceRange.max) ? priceRange.max : 999999;
    const matchesPrice = priceVal >= minVal && priceVal <= maxVal;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const displayedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    if (sortBy === 'moq-asc') return (a.moq || 1) - (b.moq || 1);
    return 0; // default featured order
  });

  const activeCategory = (Array.isArray(categories) ? categories : INITIAL_CATEGORIES).find((c) => c && c.id === selectedCategoryId);
  const recentProductsList = (Array.isArray(recentProductIds) ? recentProductIds : [])
    .map((id) => safeProducts.find((p) => p && p.id === id))
    .filter((p): p is Product => Boolean(p && p.id));

  return (
    <div className="min-h-screen bg-[#ebebeb] dark:bg-[#181716] text-[#333333] dark:text-[#f3f3f3] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={safeProducts}
        onSelectProduct={handleSelectProduct}
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={(Array.isArray(cart) ? cart : []).reduce((s, i) => s + (i?.quantity || 0), 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={(Array.isArray(wishlist) ? wishlist : []).length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenUpload={() => {
          setUploadModalMode('single');
          setIsUploadOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMaterialCards={() => setIsMaterialCardsOpen(true)}
        onOpenVendorDashboard={() => setIsVendorDashboardOpen(true)}
        onOpenStoreManagement={handleAttemptOpenStoreManagement}
        onOpenCreateStore={() => setIsCreateStoreOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenWhatsApp={() => setWhatsAppModal({ isOpen: true, product: null })}
        onToggleCategoriesDropdown={() => {
          // Scroll to categories section smoothly
          document.getElementById('platform-category-sidebar')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoHome={() => {
          setSelectedCategoryId(null);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Platform Container - Edge to Edge Full Width */}
      <main className="flex-1 w-full m-0 p-0">
        
        {/* Top Hero Layout: Left Category Sidebar + Center Slider & Right Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start p-2 sm:p-4">
          
          {/* Left Category Sidebar (Exact replica from screenshot) */}
          <div className="lg:col-span-3 w-full">
            <CategorySidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              lang={lang}
              onOpenManageCategories={() => setIsAdminOpen(true)}
            />
          </div>

          {/* Center Slider + Right 3 Banners */}
          <div className="lg:col-span-9 w-full">
            <HeroSection
              lang={lang}
              onExploreClick={() => {
                document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBannerClick={(theme) => {
                if (theme === 'bags') {
                  setSelectedCategoryId('cat-bags');
                } else if (theme === 'machinery') {
                  setSelectedCategoryId('cat-bicycles');
                } else if (theme === 'electrical') {
                  setSelectedCategoryId('cat-electrical');
                }
                document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

        </div>

        {/* Trust Badges Bar (Exact 4 icons from screenshot) */}
        <TrustBadges lang={lang} />

        {/* Featured Products Grid */}
        <FeaturedProducts
          products={displayedProducts}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectProduct={handleSelectProduct}
          onAddToCart={(prod) => handleAddToCart(prod, prod.moq || 1)}
          onQuickWhatsApp={(prod) => setWhatsAppModal({ isOpen: true, product: prod })}
          lang={lang}
          currency={currency}
          wishlistIds={(Array.isArray(wishlist) ? wishlist : []).filter((p) => p && p.id).map((p) => p.id)}
          onToggleWishlist={handleToggleWishlist}
          compareIds={(Array.isArray(compareList) ? compareList : []).filter((p) => p && p.id).map((p) => p.id)}
          onToggleCompare={handleToggleCompare}
          onOpenCompareModal={() => setIsCompareOpen(true)}
          onClearCompare={handleClearCompare}
          priceFilterComponent={
            <PriceFilter
              minPrice={globalMinPrice}
              maxPrice={globalMaxPrice}
              currentMin={priceRange.min}
              currentMax={priceRange.max}
              onChange={(min, max) => setPriceRange({ min, max })}
              onReset={() => setPriceRange({ min: globalMinPrice, max: globalMaxPrice })}
              lang={lang}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          }
        />

        {/* 24 Departments Commercial Dummy Products Grid (شبكة الأقسام التجارية المعتمدة) */}
        <DepartmentsProductsGrid
          lang={lang}
          wishlistIds={(Array.isArray(wishlist) ? wishlist : []).filter((p) => p && p.id).map((p) => p.id)}
          onChat={(prod) => {
            const fullProd = 'titleEn' in prod ? (prod as Product) : convertDepartmentProductToProduct(prod as DepartmentProduct);
            setWhatsAppModal({ isOpen: true, product: fullProd });
          }}
          onOrder={(prod) => {
            const fullProd = 'titleEn' in prod ? (prod as Product) : convertDepartmentProductToProduct(prod as DepartmentProduct);
            handleAddToCart(fullProd, fullProd.moq || 1);
            setIsCartOpen(true);
          }}
          onPreview={(prod) => {
            const fullProd = 'titleEn' in prod ? (prod as Product) : convertDepartmentProductToProduct(prod as DepartmentProduct);
            handleSelectProduct(fullProd);
          }}
          onToggleWishlist={(prod) => {
            const fullProd = 'titleEn' in prod ? (prod as Product) : convertDepartmentProductToProduct(prod as DepartmentProduct);
            handleToggleWishlist(fullProd);
          }}
        />

        {/* 2. سجل المشاهدات الأخيرة (Recently Viewed History Section) */}
        <RecentlyViewed
          recentProducts={recentProductsList}
          categories={categories}
          onSelectProduct={handleSelectProduct}
          onAddToCart={(prod) => handleAddToCart(prod, prod.moq || 1)}
          onQuickWhatsApp={(prod) => setWhatsAppModal({ isOpen: true, product: prod })}
          onClearHistory={handleClearRecentHistory}
          lang={lang}
          currency={currency}
        />

        {/* 3. قسم الأسئلة الشائعة (FAQ Accordion Section) */}
        <FaqSection
          lang={lang}
          onOpenWhatsAppSupport={() => setWhatsAppModal({ isOpen: true, product: null })}
        />

        {/* 4. الاشتراك في النشرة الإخبارية (Newsletter Signup Section) */}
        <NewsletterSection lang={lang} />

      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        categories={categories}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenUpload={() => {
          setUploadModalMode('single');
          setIsUploadOpen(true);
        }}
        onOpenCreateStore={() => setIsCreateStoreOpen(true)}
        onOpenStoreManagement={() => handleAttemptOpenStoreManagement('main-catalog')}
      />

      {/* MODALS & DRAWERS */}
      {/* 1. Upload Product & Material Modal */}
      <UploadProductModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        categories={categories}
        onAddProduct={handleAddProduct}
        onBulkAddProducts={handleBulkAddProducts}
        onQuickAddCategory={handleAddCategory}
        initialMode={uploadModalMode}
        lang={lang}
      />

      {/* 2. Admin & Sales Management Dashboard */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        products={products}
        orders={orders}
        onDeleteProduct={handleDeleteProduct}
        onAddCategory={handleAddCategory}
        onUpdateCategoryImage={handleUpdateCategoryImage}
        onDeleteCategory={handleDeleteCategory}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onOpenUploadProduct={(mode) => {
          setUploadModalMode(mode || 'single');
          setIsAdminOpen(false);
          setIsUploadOpen(true);
        }}
        onOpenMaterialCards={() => {
          setIsAdminOpen(false);
          setIsMaterialCardsOpen(true);
        }}
        onOpenStoreManagement={() => {
          setIsAdminOpen(false);
          setActiveStoreVendor(null);
          setStoreManagementModal({
            isOpen: true,
            tab: 'store-products',
          });
        }}
        vendors={vendors}
        onUpdateVendorStatus={handleUpdateVendorStatus}
        onDeleteVendor={handleDeleteVendor}
        onResetDemoData={handleResetDemoData}
        onPrintInvoice={handlePrintInvoice}
        lang={lang}
      />

      {/* Material Cards Management & Detailed Editor System (نظام إدارة وتعديل بطاقات المواد) */}
      <MaterialCardsModal
        isOpen={isMaterialCardsOpen}
        onClose={() => setIsMaterialCardsOpen(false)}
        products={products}
        categories={categories}
        onSaveProduct={handleSaveMaterialProduct}
        onDeleteProduct={handleDeleteProduct}
        lang={lang}
      />

      {/* Store Management System (أطلس المحيط للتجارة العامة - نظام إدارة المتجر والمنتجات) */}
      <StoreManagementModal
        isOpen={storeManagementModal.isOpen}
        onClose={() => setStoreManagementModal((prev) => ({ ...prev, isOpen: false }))}
        products={products}
        onAddProduct={(newProd) => {
          setProducts((prev) => [newProd, ...prev]);
        }}
        onDeleteProduct={handleDeleteProduct}
        activeVendor={activeStoreVendor}
        approvedVendors={vendors.filter((v) => v.status === 'approved')}
        onSelectVendor={(v) => setActiveStoreVendor(v)}
        lang={lang}
        initialTab={storeManagementModal.tab}
      />

      {/* Multi-Vendor: تقديم طلب فتح متجر جديد (Vendor Application Form) */}
      <CreateStoreModal
        isOpen={isCreateStoreOpen}
        onClose={() => setIsCreateStoreOpen(false)}
        onSubmit={handleCreateVendor}
        lang={lang}
      />

      {/* Multi-Vendor: تقييد صلاحيات الدخول وفحص حالة المتجر (Store Manager Access Control) */}
      <VendorAccessModal
        isOpen={vendorAccessModal.isOpen}
        onClose={() => setVendorAccessModal((prev) => ({ ...prev, isOpen: false }))}
        vendor={vendorAccessModal.vendor}
        onOpenCreateStore={() => {
          setVendorAccessModal((prev) => ({ ...prev, isOpen: false }));
          setIsCreateStoreOpen(true);
        }}
        onOpenAdmin={() => {
          setVendorAccessModal((prev) => ({ ...prev, isOpen: false }));
          setIsAdminOpen(true);
        }}
        onContinueAsMasterStore={() => {
          setActiveStoreVendor(null);
          setVendorAccessModal((prev) => ({ ...prev, isOpen: false }));
          setStoreManagementModal({
            isOpen: true,
            tab: 'store-products',
          });
        }}
        lang={lang}
      />

      {/* 3. Product Details Modal (نافذة تفاصيل المنتج الفخمة) */}
      <ProductDetailsModal
        isOpen={!!selectedProductDetail}
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={(p, qty) => {
          const fullProd = 'titleEn' in p ? (p as Product) : convertDepartmentProductToProduct(p as DepartmentProduct);
          handleAddToCart(fullProd, qty);
          setIsCartOpen(true);
        }}
        onWhatsAppInquiry={(p) => {
          const fullProd = 'titleEn' in p ? (p as Product) : convertDepartmentProductToProduct(p as DepartmentProduct);
          setSelectedProductDetail(null);
          setWhatsAppModal({ isOpen: true, product: fullProd });
        }}
        lang={lang}
      />

      {/* 4. Cart & Quotation Drawer (ShoppingCartDrawer الفاخر) */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={(checkoutData) => {
          // Quick one-click checkout or invoice generation
          if (cart.length === 0) return;
          const newOrderNumber = `AO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const totalVal = checkoutData?.finalTotalUSD || cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            orderNumber: newOrderNumber,
            date: new Date().toLocaleString(),
            status: 'Pending',
            customerName: 'Atlas Verified Partner',
            customerPhone: '07700000000',
            customerEmail: 'buyer@atlasoceanplatform.com',
            shippingAddress: 'العراق - بغداد / الشحن التجاري السريع',
            paymentMethod: 'Bank Wire Transfer (T/T)',
            totalAmount: totalVal,
            items: cart.map((i) => ({
              productId: i.product.id,
              productTitle: lang === 'ar' ? (i.product.titleAr || i.product.titleEn) : (i.product.titleEn || i.product.titleAr),
              price: i.product.price,
              quantity: i.quantity,
              image: i.product.image || '',
            })),
          };
          setOrders((prev) => [newOrder, ...prev]);
          setInvoiceOrder(newOrder);
          setCart([]);
          setIsCartOpen(false);
        }}
        lang={lang}
        currency={currency}
      />

      {/* 5. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveItem={handleRemoveWishlist}
        onClearWishlist={handleClearWishlist}
        onAddToCart={(p) => handleAddToCart(p, p.moq || 1)}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
        onQuickWhatsApp={(p) => setWhatsAppModal({ isOpen: true, product: p })}
        lang={lang}
      />

      {/* 6. Product Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareProducts={compareList}
        categories={categories}
        onRemoveFromCompare={handleRemoveCompare}
        onClearCompare={handleClearCompare}
        onAddToCart={(p) => handleAddToCart(p, p.moq || 1)}
        onQuickWhatsApp={(p) => setWhatsAppModal({ isOpen: true, product: p })}
        lang={lang}
      />

      {/* 7. Printable Tax Order Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
        lang={lang}
      />

      {/* 8. Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        lang={lang}
      />

      {/* 9. WhatsApp Inquiry Modal */}
      <WhatsAppModal
        isOpen={whatsAppModal.isOpen}
        onClose={() => setWhatsAppModal({ isOpen: false, product: null })}
        product={whatsAppModal.product}
        lang={lang}
      />

      {/* 10. Vendor Dashboard Modal (لوحة تحكم التاجر - متجري) */}
      <VendorDashboard
        isOpen={isVendorDashboardOpen}
        onClose={() => setIsVendorDashboardOpen(false)}
        lang={lang}
        vendorName="ArtisanCrafts Global & Atlas Partners"
        onAddNewProduct={(newProd) => {
          const productObj = convertDepartmentProductToProduct(newProd);
          setProducts((prev) => [productObj, ...prev]);
        }}
        onPreviewProduct={(prod) => {
          const fullProd = 'titleEn' in prod ? (prod as Product) : convertDepartmentProductToProduct(prod as DepartmentProduct);
          handleSelectProduct(fullProd);
        }}
      />
    </div>
  );
}
