import React from 'react';
import { History, ShoppingCart, PhoneCall, Trash2, ArrowRight } from 'lucide-react';
import { Product, Language, Category, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface RecentlyViewedProps {
  recentProducts: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickWhatsApp: (product: Product) => void;
  onClearHistory: () => void;
  lang: Language;
  currency?: CurrencyCode;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  recentProducts,
  categories,
  onSelectProduct,
  onAddToCart,
  onQuickWhatsApp,
  onClearHistory,
  lang,
  currency = 'USD',
}) => {
  const isAr = lang === 'ar';

  if (!recentProducts || recentProducts.length === 0) {
    return null;
  }

  const categoryMap = new Map(categories.map((c) => [c.id, isAr ? c.nameAr : c.nameEn]));

  return (
    <section 
      id="recently-viewed-section" 
      className="w-full mt-4 mb-10"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-950/80 text-[#df6828] flex items-center justify-center border border-orange-200 dark:border-orange-800/60">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-sm sm:text-base">
                {isAr ? "شوهد مؤخراً" : "Recently Viewed Products"}
              </h3>
              <span className="text-[11px] font-bold text-[#df6828] bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/60">
                {recentProducts.length}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400">
              {isAr 
                ? "منتجات ومواد قمت باستعراضها مؤخراً لتسهيل المقارنة وسرعة اتخاذ قرار الشراء" 
                : "Products and materials you recently inspected for quick re-ordering and comparison"}
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-gray-400 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 text-xs flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
          title={isAr ? "مسح سجل المشاهدات" : "Clear recent history"}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">{isAr ? "مسح السجل" : "Clear"}</span>
        </button>
      </div>

      {/* Grid of Recently Viewed Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {recentProducts.map((product) => {
          const displayTitle = isAr ? product.titleAr : product.titleEn;
          const categoryName = categoryMap.get(product.categoryId) || 'General';

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Product Image */}
              <div 
                onClick={() => onSelectProduct(product)}
                className="relative aspect-square bg-[#f9f9f9] dark:bg-neutral-800/70 p-3 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {product.brand && (
                  <span className="absolute top-2 left-2 z-10 bg-[#38312d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {product.brand}
                  </span>
                )}

                {(product.badge || product.badgeAr) && (
                  <span className="absolute bottom-2 left-2 z-10 bg-[#df6828] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    {isAr ? (product.badgeAr || product.badge) : (product.badge || product.badgeAr)}
                  </span>
                )}

                <img
                  src={product.image}
                  alt={displayTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-neutral-500 block truncate mb-1">
                    {categoryName}
                  </span>
                  <h4 
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-gray-800 dark:text-neutral-200 text-xs line-clamp-2 min-h-[32px] cursor-pointer hover:text-[#df6828] transition-colors"
                  >
                    {displayTitle}
                  </h4>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-neutral-800">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-black text-[#df6828]">
                      {formatPrice(product.price, currency, lang)}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-neutral-400">
                      MOQ: {product.moq} {product.unit}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-[#df6828] hover:bg-[#c65a1f] text-white py-1 px-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      title={isAr ? "إضافة للسلة" : "Add to Cart"}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span className="truncate">{isAr ? "أضف" : "Add"}</span>
                    </button>
                    <button
                      onClick={() => onQuickWhatsApp(product)}
                      className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 py-1 px-1.5 rounded text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title={isAr ? "واتساب" : "WhatsApp"}
                    >
                      <PhoneCall className="w-3 h-3 text-[#25D366]" />
                      <span>{isAr ? "طلب" : "Ask"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
