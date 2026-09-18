import React, { useState } from 'react';
import {
  Store,
  X,
  ExternalLink,
  PlusCircle,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';
import { UploadProductForm } from './UploadProductForm';

interface VendorDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  lang?: Language;
  vendorName?: string;
  onAddNewProduct?: (product: any) => void;
  onPreviewProduct?: (product: any) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  isOpen = true,
  onClose,
  lang = 'ar',
  vendorName = 'VIP Vendor',
  onAddNewProduct,
  onPreviewProduct,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'upload' | 'orders' | 'settings'>('overview');

  // بيانات إحصائية وهمية للعرض
  const stats = [
    { title: 'إجمالي المبيعات', value: '$124,500', icon: '💰', color: 'text-green-400' },
    { title: 'المنتجات النشطة', value: '45', icon: '📦', color: 'text-amber-400' },
    { title: 'الطلبات المعلقة', value: '12', icon: '⏳', color: 'text-[#df6828]' },
    { title: 'تقييم المتجر', value: '4.9/5.0', icon: '⭐', color: 'text-yellow-400' },
  ];

  // بيانات منتجات وهمية للجدول
  const [recentProducts, setRecentProducts] = useState([
    { id: '1', name: 'Acoustic Architectural Slat Wood Wall Panels', price: '$110', stock: '150 Panels', status: 'نشط' },
    { id: '2', name: 'Digital Dual-Basket Touch Air Fryer', price: '$240', stock: '80 Units', status: 'نشط' },
    { id: '3', name: 'Pure Organic Moroccan Argan Oil', price: '$65', stock: '0', status: 'نفدت الكمية' },
    { id: '4', name: 'Executive Ergonomic High-Back Mesh Chair', price: '$340', stock: '25 Pieces', status: 'نشط' },
    { id: '5', name: 'Hi-Res Wireless Active Noise Cancelling Headphones', price: '$185', stock: '60 Units', status: 'نشط' },
  ]);

  if (isOpen === false) return null;

  const handleDelete = (id: string) => {
    setRecentProducts(recentProducts.filter((p) => p.id !== id));
  };

  return (
    <div
      id="vendor-dashboard-wrapper"
      className={`${
        onClose ? 'fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4' : ''
      }`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className={`flex w-full ${onClose ? 'max-w-7xl h-full sm:h-[92vh] max-h-[960px] rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden' : 'min-h-screen'} bg-[#0f172a] text-slate-200 font-sans`}>
        
        {/* ======================================================== */}
        {/* الشريط الجانبي (Sidebar)                                    */}
        {/* ======================================================== */}
        <aside className="w-64 sm:w-72 bg-[#1e293b] border-e border-slate-700/50 flex flex-col shadow-2xl shrink-0">
          <div className="p-5 sm:p-6 border-b border-slate-700/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#df6828]">
                ATLAS OCEAN
              </h2>
              <p className="text-xs text-slate-400 mt-1">Vendor Management Portal</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="sm:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#df6828]/20 to-transparent text-amber-500 border-s-4 border-[#df6828]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>📊</span>
              <span>نظرة عامة (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#df6828]/20 to-transparent text-amber-500 border-s-4 border-[#df6828]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>📦</span>
              <span>منتجاتي (My Products)</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-[#df6828]/20 to-transparent text-amber-500 border-s-4 border-[#df6828]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>➕</span>
              <span>إضافة منتج (Upload Product)</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#df6828]/20 to-transparent text-amber-500 border-s-4 border-[#df6828]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🛒</span>
              <span>الطلبات (Orders)</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#df6828]/20 to-transparent text-amber-500 border-s-4 border-[#df6828]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>⚙️</span>
              <span>إعدادات المتجر (Settings)</span>
            </button>
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-[#df6828] flex items-center justify-center text-white font-bold shrink-0">
                V
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{vendorName}</p>
                <p className="text-xs text-green-400">حساب موثق ✓</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="mt-3 w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>العودة للمتجر</span>
              </button>
            )}
          </div>
        </aside>

        {/* ======================================================== */}
        {/* المنطقة الرئيسية (Main Content)                             */}
        {/* ======================================================== */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* الشريط العلوي (Header) */}
          <header className="bg-[#1e293b]/80 backdrop-blur-md p-4 sm:p-6 flex justify-between items-center border-b border-slate-700/50 shrink-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">مرحباً بعودتك، شريك أطلس!</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">إليك ملخص أداء متجرك اليوم.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('upload')}
                className="bg-gradient-to-r from-[#df6828] to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-semibold hover:shadow-lg hover:shadow-[#df6828]/20 transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
              >
                + إضافة منتج جديد
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="hidden sm:inline-flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </header>

          {/* محتوى الصفحة القابل للتمرير */}
          <div className="p-4 sm:p-8 overflow-y-auto flex-1">
            
            {/* عرض تبويب نظرة عامة (Overview) */}
            {activeTab === 'overview' && (
              <>
                {/* البطاقات الإحصائية (Stats Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-[#1e293b] p-5 sm:p-6 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-all shadow-lg flex items-center gap-4"
                    >
                      <div className={`text-3xl sm:text-4xl ${stat.color}`}>{stat.icon}</div>
                      <div>
                        <p className="text-xs sm:text-sm text-slate-400">{stat.title}</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* جدول أحدث المنتجات (Recent Products Table) */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h2 className="text-base sm:text-lg font-bold text-white">أحدث المنتجات المضافة</h2>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs sm:text-sm text-[#df6828] hover:text-amber-400 font-semibold"
                    >
                      عرض الكل &larr;
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-xs sm:text-sm">
                          <th className="p-3 sm:p-4 font-semibold text-start">اسم المنتج</th>
                          <th className="p-3 sm:p-4 font-semibold text-start">السعر</th>
                          <th className="p-3 sm:p-4 font-semibold text-start">المخزون</th>
                          <th className="p-3 sm:p-4 font-semibold text-start">الحالة</th>
                          <th className="p-3 sm:p-4 font-semibold text-end">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 text-xs sm:text-sm">
                        {recentProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 sm:p-4 text-white font-medium">{product.name}</td>
                            <td className="p-3 sm:p-4 text-amber-400 font-semibold">{product.price}</td>
                            <td className="p-3 sm:p-4 text-slate-300">{product.stock}</td>
                            <td className="p-3 sm:p-4">
                              <span
                                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold ${
                                  product.status === 'نشط'
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="p-3 sm:p-4 text-end whitespace-nowrap">
                              <button
                                onClick={() => alert(`تعديل المنتج: ${product.name}`)}
                                className="text-slate-400 hover:text-amber-400 mx-1.5 transition-colors cursor-pointer"
                              >
                                ✏️ تعديل
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-slate-400 hover:text-red-400 mx-1.5 transition-colors cursor-pointer"
                              >
                                🗑️ حذف
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* عرض تبويب منتجاتي (My Products) */}
            {activeTab === 'products' && (
              <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-lg p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">إدارة منتجات التاجر الكاملة</h2>
                    <p className="text-xs text-slate-400">إجمالي المنتجات المسجلة: {recentProducts.length} منتجاً</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="bg-[#df6828] hover:bg-[#c95b1e] text-white px-4 py-2 rounded-md font-semibold text-xs transition-colors"
                  >
                    + منتج جديد
                  </button>
                </div>

                <div className="divide-y divide-slate-700/50">
                  {recentProducts.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">{p.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="text-amber-400 font-bold">{p.price}</span>
                          <span>المخزون: {p.stock}</span>
                          <span className={p.status === 'نشط' ? 'text-green-400' : 'text-red-400'}>{p.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-slate-400 hover:text-red-400 p-1 text-xs"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* عرض تبويب إضافة منتج (Upload Product) */}
            {activeTab === 'upload' && (
              <UploadProductForm
                lang={lang}
                vendorName={vendorName}
                onPublishSuccess={(prod) => {
                  const newTableItem = {
                    id: String(Date.now()),
                    name: prod.name,
                    price: `$${prod.priceUSD}`,
                    stock: prod.moq || '50 Units',
                    status: 'نشط',
                  };
                  setRecentProducts([newTableItem, ...recentProducts]);
                  if (onAddNewProduct) {
                    onAddNewProduct(prod);
                  }
                  setTimeout(() => {
                    setActiveTab('products');
                  }, 1200);
                }}
                onCancel={() => setActiveTab('overview')}
              />
            )}

            {/* عرض تبويب الطلبات (Orders) */}
            {activeTab === 'orders' && (
              <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-lg p-6">
                <h2 className="text-lg font-bold text-white mb-2">طلبات الشراء الواردة</h2>
                <p className="text-xs text-slate-400 mb-4">الطلبيات المعلقة والمنفذة حالياً.</p>
                <div className="space-y-3 text-xs">
                  {[
                    { id: '#ORD-9921', customer: 'مؤسسة الرياض التجارية', amount: '$4,200', status: 'قيد الشحن' },
                    { id: '#ORD-9920', customer: 'شركة البصرة للمقاولات', amount: '$8,900', status: 'معلق للدفع' },
                  ].map((o) => (
                    <div key={o.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{o.id} - {o.customer}</span>
                        <p className="text-slate-400 text-[11px]">اليوم، 11:20 ص</p>
                      </div>
                      <div className="text-end">
                        <span className="text-amber-400 font-bold">{o.amount}</span>
                        <span className="block text-green-400 text-[10px] font-semibold">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* عرض تبويب الإعدادات (Settings) */}
            {activeTab === 'settings' && (
              <div className="max-w-xl bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-lg p-6 text-xs space-y-4">
                <h2 className="text-lg font-bold text-white mb-4">إعدادات حساب التاجر</h2>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">اسم المتجر</label>
                  <input
                    type="text"
                    defaultValue={vendorName}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم الهاتف / واتساب</label>
                  <input
                    type="text"
                    defaultValue="+964 770 000 0000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('تم حفظ الإعدادات')}
                  className="bg-[#df6828] hover:bg-[#c95b1e] text-white px-5 py-2 font-bold rounded-lg transition-colors"
                >
                  حفظ التعديلات
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
