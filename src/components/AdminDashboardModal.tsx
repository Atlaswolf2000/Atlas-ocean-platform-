import React, { useState, useRef } from 'react';
import { 
  X, 
  Package, 
  Layers, 
  TrendingUp, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  Search,
  ExternalLink,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Printer,
  FileSpreadsheet,
  BarChart3,
  Image as ImageIcon,
  Upload,
  Award,
  ArrowUpRight,
  PieChart,
  Activity,
  ShoppingBag,
  Star,
  Edit3,
  PackageOpen,
  Store
} from 'lucide-react';
import { Category, Product, Order, Language } from '../types';
import { SalesPerformanceChart } from './SalesPerformanceChart';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  orders: Order[];
  onDeleteProduct: (id: string) => void;
  onAddCategory: (nameEn: string, nameAr: string, image?: string) => void;
  onUpdateCategoryImage?: (id: string, imageUrl: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onOpenUploadProduct: (mode?: 'single' | 'bulk') => void;
  onOpenMaterialCards?: (initialProduct?: Product) => void;
  onOpenStoreManagement?: () => void;
  onResetDemoData: () => void;
  onPrintInvoice?: (order: Order) => void;
  lang: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  orders,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategoryImage,
  onDeleteCategory,
  onUpdateOrderStatus,
  onOpenUploadProduct,
  onOpenMaterialCards,
  onOpenStoreManagement,
  onResetDemoData,
  onPrintInvoice,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'sales' | 'performance'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Category State
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [selectedCatForUpload, setSelectedCatForUpload] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rowFileInputRef = useRef<HTMLInputElement>(null);

  const isAr = lang === 'ar';

  if (!isOpen) return null;

  // Category lookup
  const categoryMap = new Map(categories.map(c => [c.id, isAr ? c.nameAr : c.nameEn]));

  // Metrics
  const totalSalesRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalItemsSold = orders.reduce((sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0), 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;
  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Shipped');
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const avgOrderValue = orders.length > 0 ? (totalSalesRevenue / orders.length) : 0;

  // Best Selling Products ranking for Sales Performance Dashboard
  const bestSellingProducts = [...products].map(product => {
    const ordersUnits = orders.reduce((sum, ord) => {
      const match = ord.items.find(i => i.productId === product.id);
      return sum + (match ? match.quantity : 0);
    }, 0);
    const totalUnitsSold = (product.ordersCount || 0) + ordersUnits;
    const totalRevenue = orders.reduce((sum, ord) => {
      const match = ord.items.find(i => i.productId === product.id);
      return sum + (match ? match.price * match.quantity : 0);
    }, 0) + ((product.ordersCount || 0) * product.price);

    return {
      product,
      totalUnitsSold,
      totalRevenue,
      verifiedOrders: (product.ordersCount || 0) + orders.filter(o => o.items.some(i => i.productId === product.id)).length
    };
  }).sort((a, b) => b.totalUnitsSold - a.totalUnitsSold);

  // Category sales breakdown
  const categorySales = categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const catRevenue = catProducts.reduce((sum, p) => {
      const pOrdersRevenue = orders.reduce((pSum, ord) => {
        const item = ord.items.find(i => i.productId === p.id);
        return pSum + (item ? item.price * item.quantity : 0);
      }, 0);
      return sum + pOrdersRevenue + ((p.ordersCount || 0) * p.price);
    }, 0);
    return {
      category: cat,
      revenue: catRevenue,
      itemCount: catProducts.length
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const maxCatRevenue = Math.max(...categorySales.map(c => c.revenue), 1);

  // Filtered products
  const filteredProducts = products.filter(p => 
    p.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatEn.trim() && !newCatAr.trim()) return;
    onAddCategory(
      newCatEn.trim() || newCatAr.trim(), 
      newCatAr.trim() || newCatEn.trim(), 
      newCatImage.trim() || undefined
    );
    setNewCatEn('');
    setNewCatAr('');
    setNewCatImage('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCatImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRowImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedCatForUpload && onUpdateCategoryImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCategoryImage(selectedCatForUpload, reader.result as string);
        setSelectedCatForUpload(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="admin-management-modal-dialog"
        className="bg-white w-full max-w-5xl rounded shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[90vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-[#4d4440] text-white px-6 py-4 flex items-center justify-between border-b border-[#3b3430]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold">
                {isAr ? "لوحة إدارة المنصة والمبيعات | Atlas Ocean" : "Atlas Ocean Platform Management & Sales Hub"}
              </h2>
              <span className="bg-[#df6828] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {isAr ? "لوحة التاجر" : "Merchant Admin"}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              {isAr ? "رفع وإدارة المواد والأقسام ومتابعة طلبات المبيعات" : "Manage uploaded products, materials, departments and customer sales"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1.5 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Metric Bar */}
        <div className="bg-[#38312d] text-white px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-[#2b2522]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#4d4440] flex items-center justify-center text-[#df6828]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">{isAr ? "إجمالي المواد والمنتجات" : "Total Products"}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{products.length}</span>
                {lowStockCount > 0 && (
                  <span className="text-[10px] text-rose-300 bg-rose-950/80 border border-rose-800/80 px-1.5 py-0.2 rounded flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {lowStockCount} {isAr ? "منخفض" : "Low"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#4d4440] flex items-center justify-center text-[#e5935f]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">{isAr ? "الأقسام المتاحة" : "Active Categories"}</span>
              <span className="text-sm font-bold text-white">{categories.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#4d4440] flex items-center justify-center text-[#25D366]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">{isAr ? "طلبات المبيعات" : "Sales Orders"}</span>
              <span className="text-sm font-bold text-white">{orders.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#4d4440] flex items-center justify-center text-[#df6828]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">{isAr ? "حجم المبيعات الإجمالي" : "Total Sales"}</span>
              <span className="text-sm font-bold text-[#df6828]">
                ${totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-[#df6828] text-[#df6828] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isAr ? "إدارة المنتجات والمواد" : "Products & Materials"} ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'border-[#df6828] text-[#df6828] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isAr ? "إدارة الأقسام" : "Categories & Departments"} ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'sales'
                  ? 'border-[#df6828] text-[#df6828] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{isAr ? "المبيعات والطلبات الواردة" : "Sales Orders & Inquiries"} ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'performance'
                  ? 'border-[#df6828] text-[#df6828] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#df6828]" />
              <span>{isAr ? "لوحة تحكم أداء المبيعات" : "Sales Performance Dashboard"}</span>
            </button>
          </div>

          {/* Quick Upload Action */}
          <div className="flex items-center gap-2">
            {onOpenStoreManagement && (
              <button
                type="button"
                onClick={onOpenStoreManagement}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title={isAr ? "نظام إدارة المتجر والمنتجات والبروفايل" : "Store & Products Management System"}
              >
                <Store className="w-3.5 h-3.5" />
                <span>{isAr ? "نظام إدارة المتجر" : "Store System"}</span>
              </button>
            )}
            {onOpenMaterialCards && (
              <button
                type="button"
                onClick={() => onOpenMaterialCards()}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title={isAr ? "نظام إدارة وتعديل بطاقات المواد والصور" : "Material Cards Management & Gallery"}
              >
                <PackageOpen className="w-3.5 h-3.5" />
                <span>{isAr ? "بطاقات المواد" : "Material Cards"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenUploadProduct('bulk')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title={isAr ? "استيراد مجموعة كبيرة من المنتجات دفعة واحدة عبر ملف Excel / CSV" : "Bulk import products via Excel / CSV"}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isAr ? "استيراد عبر Excel" : "Excel Bulk Import"}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenUploadProduct('single')}
              className="bg-[#df6828] hover:bg-[#c65a1f] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? "رفع مادة جديدة" : "+ Upload New"}</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {/* TAB 1: PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Search filter */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={isAr ? "بحث في المنتجات المرفوعة..." : "Search uploaded products..."}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded bg-white text-xs outline-none focus:ring-2 focus:ring-[#df6828]"
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {isAr ? `إجمالي: ${filteredProducts.length} منتج` : `Showing: ${filteredProducts.length} items`}
                </span>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-200 rounded shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/80 text-gray-700 uppercase font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3 w-14">{isAr ? "الصورة" : "Image"}</th>
                      <th className="p-3">{isAr ? "اسم المنتج والمادة" : "Product Title"}</th>
                      <th className="p-3">{isAr ? "القسم" : "Department"}</th>
                      <th className="p-3">{isAr ? "السعر" : "Price"}</th>
                      <th className="p-3">{isAr ? "أدنى طلب" : "MOQ"}</th>
                      <th className="p-3">{isAr ? "المخزون" : "Stock"}</th>
                      <th className="p-3 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-2.5">
                          <img
                            src={prod.image}
                            alt={prod.titleEn}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-contain rounded bg-gray-50 border border-gray-200"
                          />
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-800 block">
                            {isAr ? prod.titleAr : prod.titleEn}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {prod.brand} • {isAr ? prod.titleEn : prod.titleAr}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {categoryMap.get(prod.categoryId) || prod.categoryId}
                        </td>
                        <td className="p-3 font-bold text-[#df6828]">
                          {prod.currency}{prod.price.toFixed(2)}
                        </td>
                        <td className="p-3 text-gray-600">
                          {prod.moq} {prod.unit}
                        </td>
                        <td className="p-3 text-gray-600">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-semibold ${prod.stock < 5 ? 'text-rose-600 font-bold' : 'text-gray-700'}`}>
                              {prod.stock}
                            </span>
                            {prod.stock < 5 && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                                <span>{isAr ? "مخزون منخفض!" : "Low Stock"}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {onOpenMaterialCards && (
                              <button
                                type="button"
                                onClick={() => onOpenMaterialCards(prod)}
                                className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2 py-1 rounded text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title={isAr ? "تعديل بطاقة المادة والصور والمواصفات" : "Edit Material Card, Images & Specs"}
                              >
                                <Edit3 className="w-3 h-3 text-amber-600" />
                                <span>{isAr ? "بطاقة المادة" : "Card"}</span>
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors"
                              title={isAr ? "حذف المنتج" : "Delete Product"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES / DEPARTMENTS MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Add New Department Form */}
              <div className="bg-white p-4 border border-gray-200 rounded shadow-xs">
                <h4 className="font-bold text-gray-800 text-xs uppercase mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#df6828]" />
                  <span>{isAr ? "إضافة قسم ومادة جديدة للمنصة مع صورة مصغرة" : "Add New Department / Category with Thumbnail"}</span>
                </h4>
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newCatAr}
                      onChange={(e) => setNewCatAr(e.target.value)}
                      placeholder={isAr ? "اسم القسم بالعربية (مثال: قسم الآلات والمعدات)" : "Category Name (Arabic)"}
                      className="px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-[#df6828]"
                      dir="rtl"
                    />
                    <input
                      type="text"
                      required
                      value={newCatEn}
                      onChange={(e) => setNewCatEn(e.target.value)}
                      placeholder="Category Name (English, e.g. Machinery & Tools)"
                      className="px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-[#df6828]"
                      dir="ltr"
                    />
                  </div>

                  {/* Category Image Upload & URL */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer flex-shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#df6828]" />
                        <span>{isAr ? "رفع صورة القسم" : "Upload Image"}</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      {newCatImage && (
                        <div className="flex items-center gap-2">
                          <img
                            src={newCatImage}
                            alt="Category preview"
                            className="w-7 h-7 rounded object-cover border border-orange-300 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setNewCatImage('')}
                            className="text-gray-400 hover:text-red-500 text-[11px]"
                            title={isAr ? "إزالة الصورة" : "Remove image"}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <input
                      type="url"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      placeholder={isAr ? "أو الصق رابط صورة القسم مباشرة (URL)" : "Or paste Category Image URL directly"}
                      className="flex-1 w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-[#df6828]"
                      dir="ltr"
                    />

                    <button
                      type="submit"
                      className="bg-[#df6828] hover:bg-[#c65a1f] text-white font-bold px-4 py-2 rounded text-xs flex items-center justify-center gap-1 transition-colors w-full sm:w-auto flex-shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? "حفظ القسم" : "Save Department"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Categories Table */}
              <div className="bg-white border border-gray-200 rounded shadow-xs overflow-hidden">
                {/* Hidden input for row-level image uploads */}
                <input
                  type="file"
                  ref={rowFileInputRef}
                  accept="image/*"
                  onChange={handleRowImageChange}
                  className="hidden"
                />

                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/80 text-gray-700 uppercase font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3 w-10">#</th>
                      <th className="p-3 w-20 text-center">{isAr ? "الصورة" : "Thumbnail"}</th>
                      <th className="p-3">{isAr ? "اسم القسم (العربية)" : "Department Name (Arabic)"}</th>
                      <th className="p-3">{isAr ? "اسم القسم (English)" : "Department Name (English)"}</th>
                      <th className="p-3">{isAr ? "عدد المنتجات" : "Items Count"}</th>
                      <th className="p-3 text-center">{isAr ? "إجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat, idx) => {
                      const count = products.filter(p => p.categoryId === cat.id).length;
                      return (
                        <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-3 text-gray-400">{idx + 1}</td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1.5 group relative">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.nameEn}
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded object-cover border border-gray-200 shadow-2xs"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCatForUpload(cat.id);
                                  rowFileInputRef.current?.click();
                                }}
                                className="p-1 rounded bg-gray-100 hover:bg-[#df6828] hover:text-white text-gray-500 border border-gray-300 transition-colors cursor-pointer"
                                title={isAr ? "تغيير صورة القسم" : "Upload / Change category photo"}
                              >
                                <Upload className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 font-bold text-gray-800">{cat.nameAr}</td>
                          <td className="p-3 text-gray-600">{cat.nameEn}</td>
                          <td className="p-3 text-gray-600">
                            <span className="bg-orange-50 text-[#df6828] px-2 py-0.5 rounded font-bold border border-orange-200">
                              {count} {isAr ? "منتج" : "items"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => onDeleteCategory(cat.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors"
                              title={isAr ? "حذف القسم" : "Delete Category"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SALES & ORDERS */}
          {activeTab === 'sales' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800 text-xs uppercase">
                  {isAr ? "سجل المبيعات والطلبات الواردة" : "Customer Sales Orders & Inquiries"}
                </h4>
                <span className="text-xs text-gray-500">
                  {isAr ? `إجمالي المبيعات: ${orders.length} طلب` : `Total Orders: ${orders.length}`}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white p-8 text-center border border-gray-200 rounded">
                  <p className="text-gray-500 text-xs">
                    {isAr ? "لا توجد طلبات مبيعات حتى الآن." : "No customer orders received yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="bg-white border border-gray-200 rounded p-4 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-gray-400">
                            {ord.date}
                          </span>
                        </div>

                        {/* Status badge, selector & Print Invoice */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {onPrintInvoice && (
                            <button
                              onClick={() => onPrintInvoice(ord)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                              title={isAr ? "طباعة الفاتورة" : "Print Invoice"}
                            >
                              <Printer className="w-3.5 h-3.5 text-[#df6828]" />
                              <span>{isAr ? "طباعة الفاتورة" : "Print Invoice"}</span>
                            </button>
                          )}

                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            ord.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'Confirmed' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ord.status}
                          </span>

                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer & Item details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400 block text-[10px]">{isAr ? "العميل والمشتري" : "Customer"}</span>
                          <p className="font-bold text-gray-800">{ord.customerName}</p>
                          <p className="text-gray-500">{ord.customerPhone}</p>
                          <p className="text-gray-500">{ord.customerEmail}</p>
                        </div>

                        <div>
                          <span className="text-gray-400 block text-[10px]">{isAr ? "عنوان الشحن والتسليم" : "Shipping Destination"}</span>
                          <p className="text-gray-700">{ord.shippingAddress}</p>
                          {ord.notes && (
                            <p className="text-gray-500 text-[10px] mt-1 italic">
                              "{ord.notes}"
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="text-gray-400 block text-[10px]">{isAr ? "المواد المطلوبة والإجمالي" : "Ordered Items & Total"}</span>
                          <ul className="space-y-1 my-1">
                            {ord.items.map((item, i) => (
                              <li key={i} className="flex justify-between text-gray-700">
                                <span className="truncate pr-2">{item.quantity}x {item.productTitle}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="border-t border-gray-200 pt-1 flex justify-between font-bold text-[#df6828]">
                            <span>{isAr ? "إجمالي المبلغ:" : "Total Amount:"}</span>
                            <span>${ord.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SALES PERFORMANCE DASHBOARD */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* 1. Header & Quick Context */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded border border-gray-200 shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#df6828]" />
                    <span>{isAr ? "لوحة تحكم وتحليلات أداء المبيعات" : "Sales Performance Analytics Dashboard"}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isAr ? "نظرة شمولية على حجم الإيرادات، تدفق الطلبات النشطة، والمنتجات الأكثر طلباً في السوق" : "Comprehensive overview of revenue growth, active pipeline, and highest performing products"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? "محدث ومباشر" : "Real-time Live Sync"}</span>
                  </span>
                </div>
              </div>

              {/* 2. Top Summary KPI Cards (إحصائيات عامة ملخصة) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Total Revenue */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      {isAr ? "إجمالي المبيعات" : "Total Revenue"}
                    </span>
                    <div className="w-7 h-7 rounded bg-orange-100 text-[#df6828] flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-gray-900">
                    ${totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{isAr ? "+18.4% نمو المبيعات" : "+18.4% volume growth"}</span>
                  </div>
                </div>

                {/* Active Orders */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      {isAr ? "الطلبات النشطة" : "Active Orders"}
                    </span>
                    <div className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-blue-600">
                    {activeOrders.length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    {isAr ? `${orders.filter(o => o.status === 'Pending').length} قيد الانتظار • ${orders.filter(o => o.status === 'Shipped').length} في الشحن` : `${orders.filter(o => o.status === 'Pending').length} Pending • ${orders.filter(o => o.status === 'Shipped').length} in Transit`}
                  </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      {isAr ? "الطلبات المكتملة" : "Completed Orders"}
                    </span>
                    <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">
                    {completedOrders.length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    {isAr ? `من إجمالي ${orders.length} طلب مسجل` : `Out of ${orders.length} total orders`}
                  </div>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      {isAr ? "متوسط قيمة الطلب" : "Avg Order Value (AOV)"}
                    </span>
                    <div className="w-7 h-7 rounded bg-purple-100 text-purple-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-purple-700">
                    ${avgOrderValue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    {isAr ? `${totalItemsSold.toLocaleString()} قطعة تم شحنها` : `${totalItemsSold.toLocaleString()} units shipped`}
                  </div>
                </div>
              </div>

              {/* NEW SECTION: INTERACTIVE SALES PERFORMANCE CHART (رسوم بيانية تفاعلية للمبيعات) */}
              <SalesPerformanceChart 
                orders={orders}
                lang={lang}
              />

              {/* 3. Best Selling Products Table (قائمة بأكثر المنتجات مبيعاً) */}
              <div className="bg-white rounded border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#df6828]" />
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      {isAr ? "قائمة المنتجات الأكثر مبيعاً وطلباً" : "Top Best-Selling Products Leaderboard"}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    {isAr ? `أعلى ${Math.min(bestSellingProducts.length, 6)} منتجات أداءً` : `Top ${Math.min(bestSellingProducts.length, 6)} High Performers`}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100/80 text-gray-700 uppercase font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3 w-14 text-center">{isAr ? "الترتيب" : "Rank"}</th>
                        <th className="p-3">{isAr ? "المنتج والمادة" : "Product & Material"}</th>
                        <th className="p-3">{isAr ? "القسم" : "Department"}</th>
                        <th className="p-3 text-center">{isAr ? "سعر الجملة" : "Unit Price"}</th>
                        <th className="p-3 text-center">{isAr ? "الكمية المباعة" : "Units Sold"}</th>
                        <th className="p-3 text-center">{isAr ? "إجمالي العائد" : "Gross Revenue"}</th>
                        <th className="p-3 text-center">{isAr ? "المخزون الحالي" : "Stock Status"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bestSellingProducts.slice(0, 6).map((item, idx) => {
                        const rank = idx + 1;
                        const product = item.product;
                        const catName = categoryMap.get(product.categoryId) || (isAr ? "قسم عام" : "General");

                        return (
                          <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                            {/* Rank Badge */}
                            <td className="p-3 text-center">
                              {rank === 1 && (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs border border-amber-300 shadow-2xs" title="Top 1 Best Seller">
                                  🥇 1
                                </span>
                              )}
                              {rank === 2 && (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs border border-slate-300" title="Top 2 Best Seller">
                                  🥈 2
                                </span>
                              )}
                              {rank === 3 && (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 font-black text-xs border border-orange-300" title="Top 3 Best Seller">
                                  🥉 3
                                </span>
                              )}
                              {rank > 3 && (
                                <span className="font-bold text-gray-500 text-xs">
                                  #{rank}
                                </span>
                              )}
                            </td>

                            {/* Product Info */}
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={product.image} 
                                  alt={product.titleEn}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded object-cover border border-gray-200 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-gray-800 truncate max-w-xs" title={isAr ? product.titleAr : product.titleEn}>
                                    {isAr ? product.titleAr : product.titleEn}
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    {product.brand} • {product.moq} {product.unit} (MOQ)
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="p-3 text-gray-600">
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200">
                                {catName}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="p-3 text-center font-bold text-gray-800">
                              ${product.price.toFixed(2)}
                            </td>

                            {/* Units Sold */}
                            <td className="p-3 text-center">
                              <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {item.totalUnitsSold.toLocaleString()} {product.unit}
                              </span>
                            </td>

                            {/* Gross Revenue */}
                            <td className="p-3 text-center font-black text-[#df6828]">
                              ${item.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>

                            {/* Stock */}
                            <td className="p-3 text-center">
                              {product.stock < 5 ? (
                                <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                                  {isAr ? `منخفض (${product.stock})` : `Low (${product.stock})`}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded font-medium">
                                  {product.stock} {product.unit}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Category Performance & Pipeline Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Category Performance Breakdown */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs">
                  <h4 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-[#df6828]" />
                    <span>{isAr ? "توزيع الإيرادات حسب الأقسام (Category Sales)" : "Revenue Distribution by Department"}</span>
                  </h4>
                  <div className="space-y-3">
                    {categorySales.slice(0, 5).map(({ category, revenue, itemCount }) => {
                      const percent = Math.round((revenue / maxCatRevenue) * 100);
                      const displayName = isAr ? category.nameAr : category.nameEn;

                      return (
                        <div key={category.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-gray-700 truncate max-w-[200px]" title={displayName}>
                              {displayName} ({itemCount} {isAr ? "منتج" : "items"})
                            </span>
                            <span className="font-bold text-gray-900 font-mono">
                              ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-[#df6828] rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percent, 6)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Fulfillment Pipeline Status */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs">
                  <h4 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#df6828]" />
                    <span>{isAr ? "مراحل تدفق وتنفيذ الطلبات (Fulfillment Pipeline)" : "Order Fulfillment Pipeline"}</span>
                  </h4>

                  <div className="space-y-3">
                    {[
                      { status: 'Pending', label: isAr ? 'قيد المراجعة والانتظار' : 'Pending Verification', count: orders.filter(o => o.status === 'Pending').length, color: 'bg-amber-500' },
                      { status: 'Confirmed', label: isAr ? 'تم التأكيد وتجهيز الشحنة' : 'Confirmed & Processing', count: orders.filter(o => o.status === 'Confirmed').length, color: 'bg-blue-500' },
                      { status: 'Shipped', label: isAr ? 'تم الشحن عبر الميناء / الجو' : 'Shipped & In Transit', count: orders.filter(o => o.status === 'Shipped').length, color: 'bg-purple-500' },
                      { status: 'Completed', label: isAr ? 'مكتمل وتم التسليم بنجاح' : 'Delivered & Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'bg-emerald-500' },
                    ].map(stage => {
                      const total = Math.max(orders.length, 1);
                      const percentage = Math.round((stage.count / total) * 100);

                      return (
                        <div key={stage.status} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-gray-700">{stage.label}</span>
                            <span className="font-bold text-gray-900">{stage.count} {isAr ? 'طلب' : 'orders'} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs">
          <button
            onClick={onResetDemoData}
            className="text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
            title={isAr ? "استعادة البيانات الافتراضية الأصلية" : "Reset to default Atlas Ocean data"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? "إعادة تعيين البيانات الافتراضية" : "Reset Demo Data"}</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#4d4440] hover:bg-[#38312d] text-white px-5 py-2 rounded font-bold transition-colors"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
};
