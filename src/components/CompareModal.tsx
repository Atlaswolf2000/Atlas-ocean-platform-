import React from 'react';
import { X, Scale, ShoppingCart, PhoneCall, Check, Minus, Trash2 } from 'lucide-react';
import { Product, Language, Category } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  categories: Category[];
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product) => void;
  onQuickWhatsApp: (product: Product) => void;
  lang: Language;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  categories,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  onQuickWhatsApp,
  lang,
}) => {
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const categoryMap = new Map(categories.map((c) => [c.id, isAr ? c.nameAr : c.nameEn]));

  // Collect all unique specification keys
  const allSpecKeys: string[] = Array.from(
    new Set<string>(
      compareProducts.flatMap((p) => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        id="product-compare-modal-dialog"
        className="bg-white w-full max-w-5xl rounded shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-[#4d4440] text-white px-6 py-4 flex items-center justify-between border-b border-[#3b3430]">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#df6828]" />
            <h3 className="font-bold text-sm sm:text-base">
              {isAr ? "مقارنة المنتجات والمواصفات" : "Product Specifications Comparison"}
            </h3>
            <span className="bg-[#df6828] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              {compareProducts.length} {isAr ? "منتجات" : "items"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {compareProducts.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-gray-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                title={isAr ? "مسح المقارنة" : "Clear All"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? "مسح الكل" : "Clear"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded transition-colors"
              title={isAr ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Scale className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="font-bold text-gray-700 text-sm">
                {isAr ? "لم تقم باختيار أي منتجات للمقارنة بعد" : "No products selected for comparison"}
              </p>
              <p className="text-xs text-gray-500">
                {isAr
                  ? "اضغط على أيقونة المقارنة بجوار بطاقات المنتجات لإضافتها هنا."
                  : "Click the compare icon on product cards to view their differences side-by-side."}
              </p>
            </div>
          ) : (
            <div className="min-w-[600px] bg-white border border-gray-200 rounded shadow-xs overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                {/* Product Card Row (Image, Title, Actions) */}
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 w-40 text-gray-500 font-semibold align-top border-r border-gray-200">
                      {isAr ? "المنتج" : "Product"}
                    </th>
                    {compareProducts.map((prod) => (
                      <th
                        key={prod.id}
                        className="p-3 w-64 text-center align-top relative border-r border-gray-100 last:border-r-0"
                      >
                        <button
                          onClick={() => onRemoveFromCompare(prod.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                          title={isAr ? "إزالة من المقارنة" : "Remove from compare"}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-28 h-28 mx-auto bg-white p-2 border border-gray-200 rounded mb-2 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.titleEn}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h4 className="font-bold text-gray-800 text-xs line-clamp-2 min-h-[32px] mb-1">
                          {isAr ? prod.titleAr : prod.titleEn}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mb-2">{prod.brand}</span>

                        <div className="space-y-1.5">
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="w-full bg-[#df6828] hover:bg-[#c65a1f] text-white py-1.5 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>{isAr ? "أضف للسلة" : "Add to Cart"}</span>
                          </button>
                          <button
                            onClick={() => onQuickWhatsApp(prod)}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-[#25D366]" />
                            <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {/* Price */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50/70">
                      {isAr ? "السعر / الوحدة" : "Price / Unit"}
                    </td>
                    {compareProducts.map((prod) => (
                      <td key={prod.id} className="p-3 text-center border-r border-gray-100 last:border-r-0">
                        <span className="text-[#df6828] font-black text-sm">
                          {prod.currency}{prod.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-500 block">/ {prod.unit}</span>
                      </td>
                    ))}
                  </tr>

                  {/* MOQ */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50/70">
                      {isAr ? "الحد الأدنى للطلب (MOQ)" : "Minimum Order (MOQ)"}
                    </td>
                    {compareProducts.map((prod) => (
                      <td key={prod.id} className="p-3 text-center text-gray-700 border-r border-gray-100 last:border-r-0 font-medium">
                        {prod.moq} {prod.unit}
                      </td>
                    ))}
                  </tr>

                  {/* Stock */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50/70">
                      {isAr ? "المخزون المتاح" : "Stock Available"}
                    </td>
                    {compareProducts.map((prod) => (
                      <td key={prod.id} className="p-3 text-center border-r border-gray-100 last:border-r-0">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          prod.stock < 5 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {prod.stock} {prod.unit} {prod.stock < 5 && (isAr ? "(منخفض!)" : "(Low!)")}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50/70">
                      {isAr ? "العلامة التجارية / الماركة" : "Brand"}
                    </td>
                    {compareProducts.map((prod) => (
                      <td key={prod.id} className="p-3 text-center font-bold text-gray-800 border-r border-gray-100 last:border-r-0">
                        {prod.brand || '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Department */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50/70">
                      {isAr ? "القسم والتصنيف" : "Department"}
                    </td>
                    {compareProducts.map((prod) => (
                      <td key={prod.id} className="p-3 text-center text-gray-600 border-r border-gray-100 last:border-r-0">
                        {categoryMap.get(prod.categoryId) || prod.categoryId}
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Technical Specs */}
                  {allSpecKeys.map((key) => (
                    <tr key={key} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50/70">
                        {key}
                      </td>
                      {compareProducts.map((prod) => {
                        const val = prod.specs ? prod.specs[key] : null;
                        return (
                          <td key={prod.id} className="p-3 text-center text-gray-600 border-r border-gray-100 last:border-r-0">
                            {val ? (
                              <span className="font-medium text-gray-800">{val}</span>
                            ) : (
                              <Minus className="w-3.5 h-3.5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#4d4440] hover:bg-[#38312d] text-white px-5 py-2 rounded text-xs font-bold transition-colors"
          >
            {isAr ? "إغلاق نافذة المقارنة" : "Close Comparison"}
          </button>
        </div>
      </div>
    </div>
  );
};
