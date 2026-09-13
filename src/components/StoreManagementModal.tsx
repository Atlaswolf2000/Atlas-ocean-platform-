import React, { useState, useRef } from 'react';
import {
  Store,
  Plus,
  Search,
  Trash2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  X,
  Layers,
  CheckCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  Building,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { Product, Language } from '../types';

interface StoreManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  lang: Language;
  initialTab?: 'main-catalog' | 'store-products' | 'add-product' | 'store-profile' | 'store-contact';
}

export const StoreManagementModal: React.FC<StoreManagementModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct,
  lang,
  initialTab = 'main-catalog',
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'main-catalog' | 'store-products' | 'add-product' | 'store-profile' | 'store-contact'>(initialTab);
  const [searchInput, setSearchInput] = useState('');

  // Add Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('أجهزة ومعدات');
  const [price, setPrice] = useState('');
  const [minOrder, setMinOrder] = useState('5 قطع');
  const [stock, setStock] = useState('100 قطعة');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter for Main Catalog
  const query = searchInput.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    if (!query) return true;
    const titleMatch = (p.titleAr && p.titleAr.toLowerCase().includes(query)) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(query));
    const descMatch = (p.descriptionAr && p.descriptionAr.toLowerCase().includes(query)) ||
      (p.descriptionEn && p.descriptionEn.toLowerCase().includes(query));
    return titleMatch || descMatch;
  });

  // Filter for Store Products (items belonging to atlas store or default)
  const storeProducts = products.filter(
    (p) => !p.vendor || p.vendor === 'أطلس المحيط' || p.vendor.includes('أطلس') || p.brand?.includes('ATLAS')
  );

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageFilePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(isAr ? 'يرجى إدخال اسم المنتج' : 'Please enter product name');
      return;
    }

    const numericPrice = parseFloat(price) || 0;
    const numericStock = parseInt(stock.replace(/\D/g, '')) || 100;
    const numericMoq = parseInt(minOrder.replace(/\D/g, '')) || 1;
    const finalImg = imageFilePreview || imageUrl.trim() || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80';

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      titleEn: title,
      titleAr: title,
      categoryId: 'cat-vehicles',
      brand: 'ATLAS',
      vendor: 'أطلس المحيط',
      price: numericPrice,
      currency: '$',
      moq: numericMoq,
      unit: 'قطع',
      stock: numericStock,
      image: finalImg,
      images: [finalImg],
      descriptionEn: description,
      descriptionAr: description,
      specs: {
        'القسم': category,
        'الحد الأدنى للطلب': minOrder,
        'المخزون': stock,
        'المورد المعتمد': 'أطلس المحيط للتجارة العامة'
      },
      isFeatured: true,
      rating: 5.0,
      ordersCount: 1,
      createdAt: new Date().toISOString(),
      badge: 'متجر أطلس',
      badgeAr: 'متجر أطلس',
    };

    onAddProduct(newProduct);
    alert(isAr ? 'تم إضافة المنتج بنجاح إلى متجر أطلس!' : 'Product successfully added to Atlas Store!');

    // Reset Form
    setTitle('');
    setCategory('أجهزة ومعدات');
    setPrice('');
    setMinOrder('5 قطع');
    setStock('100 قطعة');
    setImageUrl('');
    setDescription('');
    setImageFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Switch to Store Products
    setActiveTab('store-products');
  };

  const handleDelete = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      onDeleteProduct(id);
    }
  };

  return (
    <div
      id="atlas-store-management-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex flex-col justify-between min-h-screen text-gray-800"
      dir="rtl"
    >
      <div>
        {/* Header */}
        <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 text-slate-900 font-black p-2 rounded-lg text-xl shadow-xs">
                أطلس
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base text-white leading-tight">
                  أطلس المحيط للتجارة العامة والشحن الجوي
                </h1>
                <span className="block text-xs text-amber-400 font-medium">
                  نظام إدارة المتجر والمنتجات
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('store-products')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>متجري</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-bar */}
          <div className="bg-slate-800 px-4 py-2 border-t border-slate-700 flex gap-4 overflow-x-auto text-sm max-w-7xl mx-auto">
            <button
              id="tab-main-catalog"
              type="button"
              onClick={() => setActiveTab('main-catalog')}
              className={`tab-btn px-3 py-1 rounded transition whitespace-nowrap cursor-pointer ${
                activeTab === 'main-catalog' ? 'text-amber-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              المنصة الرئيسية
            </button>
            <button
              id="tab-store-products"
              type="button"
              onClick={() => setActiveTab('store-products')}
              className={`tab-btn px-3 py-1 rounded transition whitespace-nowrap cursor-pointer ${
                activeTab === 'store-products' ? 'text-amber-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              منتجات المتجر
            </button>
            <button
              id="tab-add-product"
              type="button"
              onClick={() => setActiveTab('add-product')}
              className={`tab-btn px-3 py-1 rounded transition whitespace-nowrap cursor-pointer ${
                activeTab === 'add-product' ? 'text-amber-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              إضافة منتج جديد
            </button>
            <button
              id="tab-store-profile"
              type="button"
              onClick={() => setActiveTab('store-profile')}
              className={`tab-btn px-3 py-1 rounded transition whitespace-nowrap cursor-pointer ${
                activeTab === 'store-profile' ? 'text-amber-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              بروفايل المتجر
            </button>
            <button
              id="tab-store-contact"
              type="button"
              onClick={() => setActiveTab('store-contact')}
              className={`tab-btn px-3 py-1 rounded transition whitespace-nowrap cursor-pointer ${
                activeTab === 'store-contact' ? 'text-amber-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              معلومات التواصل
            </button>
          </div>
        </header>

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* 1. Main Catalog Section */}
          {activeTab === 'main-catalog' && (
            <section id="section-main-catalog" className="view-section">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center border border-gray-200">
                <div className="w-full md:w-1/3 relative">
                  <Search className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    id="searchInput"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ابحث باسم المادة أو الوصف..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  إجمالي المواد في المنصة: <span id="totalProductsCount" className="font-bold text-slate-900 bg-amber-100 text-slate-900 px-2.5 py-0.5 rounded-full">{filteredProducts.length}</span>
                </div>
              </div>

              <div id="productsGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const mainImg = (product.images && product.images.length > 0)
                    ? product.images[0]
                    : (product.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80');
                  const displayTitle = product.titleAr || product.titleEn;
                  const displayDesc = product.descriptionAr || product.descriptionEn || '';

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={mainImg}
                          alt={displayTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-xs">
                          {product.vendor || 'أطلس المحيط'}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-amber-600 font-semibold block mb-1">
                            {product.brand || 'أجهزة ومعدات'}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 mb-2 line-clamp-2 leading-snug">
                            {displayTitle}
                          </h4>
                          <p className="text-amber-600 font-extrabold text-lg mb-2">
                            ${product.price.toFixed(2)}{' '}
                            <span className="text-xs font-normal text-gray-500">/ قطعة</span>
                          </p>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {displayDesc}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                          <span>متوفر: {product.stock ? `${product.stock} قطع` : 'متوفر'}</span>
                          <span className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700">
                            الحد الأدنى: {product.moq ? `${product.moq} قطع` : '1'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 2. Store Products Section */}
          {activeTab === 'store-products' && (
            <section id="section-store-products" className="view-section">
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">منتجات متجر أطلس المحيط</h2>
                  <p className="text-sm text-gray-500">استعراض وإدارة المنتجات الخاصة بالمتجر فقط.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('add-product')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج للمتجر</span>
                </button>
              </div>

              <div id="storeProductsGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeProducts.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-12 bg-white rounded-xl border border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="font-bold text-gray-700 mb-1">لا توجد منتجات مسجلة للمتجر حالياً.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('add-product')}
                      className="mt-3 text-xs bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-lg"
                    >
                      + أضف أول منتج الآن
                    </button>
                  </div>
                ) : (
                  storeProducts.map((product) => {
                    const mainImg = (product.images && product.images.length > 0)
                      ? product.images[0]
                      : (product.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80');
                    const displayTitle = product.titleAr || product.titleEn;
                    const displayDesc = product.descriptionAr || product.descriptionEn || '';

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
                      >
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          <img
                            src={mainImg}
                            alt={displayTitle}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-xs">
                            متجر أطلس
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-base text-slate-900 mb-2 line-clamp-2 leading-snug">
                              {displayTitle}
                            </h4>
                            <p className="text-amber-600 font-extrabold text-lg mb-2">
                              ${product.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                              {displayDesc}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-semibold border border-emerald-200/50">
                              {product.stock ? `${product.stock} قطع` : 'متوفر'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* 3. Add Product Form Section */}
          {activeTab === 'add-product' && (
            <section id="section-add-product" className="view-section">
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b pb-3">
                  <Plus className="w-6 h-6 text-amber-500" />
                  <span>إضافة منتج جديد لمتجر أطلس</span>
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">اسم المنتج:</label>
                    <input
                      type="text"
                      id="newTitle"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="أدخل اسم المنتج أو العرض..."
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">القسم / الفئة:</label>
                      <select
                        id="newCategory"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      >
                        <option value="شحن وقطع غيار">شحن وقطع غيار</option>
                        <option value="أجهزة ومعدات">أجهزة ومعدات منزلية/صناعية</option>
                        <option value="استهدافيات يومية">استهدافيات يومية</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">السعر ($):</label>
                      <input
                        type="number"
                        step="0.01"
                        id="newPrice"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">الحد الأدنى للطلب (Minimum Order):</label>
                      <input
                        type="text"
                        id="newMinOrder"
                        value={minOrder}
                        onChange={(e) => setMinOrder(e.target.value)}
                        placeholder="مثال: 5 قطع"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">الكمية المتوفرة:</label>
                      <input
                        type="text"
                        id="newStock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="مثال: 100 قطعة"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">صورة المنتج (رابط الصورة أو رفع):</label>
                    <input
                      type="file"
                      id="newImageFile"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                    />
                    <input
                      type="text"
                      id="newImageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="أو ضع رابط صورة مباشر هنا..."
                      className="w-full mt-2 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      dir="ltr"
                    />
                    {(imageFilePreview || imageUrl) && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={imageFilePreview || imageUrl}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                        <span className="text-xs text-emerald-600 font-semibold">تم تجهيز الصورة للمعاينة</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">الوصف التفصيلي:</label>
                    <textarea
                      id="newDescription"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="اكتب المواصفات والوصف الكامل للمنتج..."
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('store-products')}
                      className="px-5 py-2.5 bg-gray-200 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-600 shadow-sm transition-colors cursor-pointer"
                    >
                      حفظ ونشر المنتج
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* 4. Store Profile Section */}
          {activeTab === 'store-profile' && (
            <section id="section-store-profile" className="view-section">
              <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-200 pb-6">
                  <div className="w-28 h-28 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 text-4xl font-black shadow-lg">
                    أطلس
                  </div>
                  <div className="text-center md:text-right">
                    <h2 className="text-2xl font-black text-slate-900">أطلس المحيط للتجارة العامة والشحن الجوي</h2>
                    <p className="text-amber-600 font-semibold mt-1">متجر موثق للخدمات التجارية واستيراد الشحنات</p>
                    <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200">
                      حساب متجر نشط
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">نبذة تعريفية عن المتجر:</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    تتخصص شركة أطلس المحيط في العمليات التجارية، الاستيراد، وإدارة الشحن الجوي والبحري، وتوفير حلول متكاملة لتتبع الحاويات، إدارة المستودعات، وتسهيل التدقيق المالي وإصدار فواتير الشحن بكفاءة عالية في العراق.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block text-xs text-gray-500 mb-1">مجال العمل الأساسي</span>
                    <span className="font-bold text-slate-900">التجارة العامة والشحن الجوي والبحري</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block text-xs text-gray-500 mb-1">منطقة العمليات الرئيسية</span>
                    <span className="font-bold text-slate-900">بغداد - العراق</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. Store Contact Section */}
          {activeTab === 'store-contact' && (
            <section id="section-store-contact" className="view-section">
              <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-gray-200 pb-3 flex items-center gap-2">
                  <Phone className="w-6 h-6 text-amber-500" />
                  <span>قنوات الاتصال والتواصل مع المتجر</span>
                </h2>
                <p className="text-gray-600 text-sm">
                  يمكنكم التواصل معنا مباشرة عبر القنوات المعتمدة أدناه لمتابعة الشحنات والطلبات:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <a
                    href="tel:07818418899"
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition border border-gray-200 group"
                  >
                    <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">رقم الهاتف الأساسي</span>
                      <span className="font-bold text-slate-900 text-lg" dir="ltr">0781 841 8899</span>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/9647818418899"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition border border-emerald-200 group"
                  >
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-emerald-700 font-semibold">مراسلة واتساب الفورية</span>
                      <span className="font-bold text-emerald-900 text-lg" dir="ltr">0781 841 8899</span>
                    </div>
                  </a>

                  {/* Email */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">البريد الإلكتروني للشركة</span>
                      <span className="font-bold text-slate-900 text-sm">atlas.ocean@trade.iq</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center text-xl font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">العنوان الرسمي</span>
                      <span className="font-bold text-slate-900 text-sm">بغداد - شارع الفروسية - الدورة</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 text-center py-4 text-xs border-t border-slate-800 mt-12">
        بغداد - التسعير والدفع المعتمد © 2026 - شركة أطلس المحيط للتجارة العامة والشحن الجوي
      </footer>
    </div>
  );
};
