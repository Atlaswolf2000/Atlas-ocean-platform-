import React from 'react';
import { ShoppingCart, PhoneCall, Star, Eye, Tag, Heart, Scale, X, ArrowRightLeft } from 'lucide-react';
import { Product, Language, Category, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickWhatsApp: (product: Product) => void;
  lang: Language;
  currency?: CurrencyCode;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  compareIds?: string[];
  onToggleCompare?: (product: Product) => void;
  onOpenCompareModal?: () => void;
  onClearCompare?: () => void;
  priceFilterComponent?: React.ReactNode;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  categories,
  selectedCategoryId,
  onSelectProduct,
  onAddToCart,
  onQuickWhatsApp,
  lang,
  currency = 'USD',
  wishlistIds = [],
  onToggleWishlist,
  compareIds = [],
  onToggleCompare,
  onOpenCompareModal,
  onClearCompare,
  priceFilterComponent,
}) => {
  const isAr = lang === 'ar';

  const categoryMap = new Map(categories.map(c => [c.id, isAr ? c.nameAr : c.nameEn]));
  const currentCategory = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) : null;

  return (
    <section id="featured-products-section" className="w-full mt-8 mb-12 relative">
      {/* Section Header with orange underline (Exact screenshot styling) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-gray-800 font-bold text-base md:text-lg tracking-wider uppercase inline-block relative pb-2.5">
            {currentCategory 
              ? (isAr ? currentCategory.nameAr : currentCategory.nameEn)
              : (isAr ? "المنتجات والمواد المميزة" : "FEATURED PRODUCTS")}
            {/* Orange accent line */}
            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#df6828]" />
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isAr 
              ? `عرض ${products.length} من المواد والمنتجات الموثقة والمتاحة للطلب الفوري` 
              : `Showing ${products.length} verified products available for wholesale & direct purchase`}
          </p>
        </div>

        {selectedCategoryId && (
          <span className="text-xs text-[#df6828] font-semibold bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
            {isAr ? "فلترة حسب القسم" : "Filtered by department"}
          </span>
        )}
      </div>

      {/* Price Filter Component Insertion */}
      {priceFilterComponent && (
        <div className="mb-4">
          {priceFilterComponent}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white p-12 text-center border border-gray-200 shadow-sm rounded-sm">
          <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-sm">
            {isAr ? "لا توجد منتجات مطابقة لهذا القسم حالياً." : "No products found in this category yet."}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isAr ? "يمكنك استخدام زر 'رفع منتج / مادة' لإضافة أصناف جديدة فوراً." : "Use the 'Upload Product' button above to add new materials or products."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {products.map((product) => {
            const displayTitle = isAr ? product.titleAr : product.titleEn;
            const categoryName = categoryMap.get(product.categoryId) || 'General';
            const isWishlisted = wishlistIds.includes(product.id);
            const isCompared = compareIds.includes(product.id);

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Brand Badge (like SETO, JINGTOP from screenshot) */}
                {product.brand && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs ${
                      product.brand === 'SETO' 
                        ? 'bg-emerald-600 text-white' 
                        : product.brand === 'JINGTOP'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#3e3835] text-white'
                    }`}>
                      {product.brand}
                    </span>
                  </div>
                )}

                {/* Top Action Icons: Wishlist Heart & Compare Scale */}
                <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5">
                  {/* Heart / Wishlist Icon */}
                  {onToggleWishlist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
                        isWishlisted
                          ? 'bg-white text-rose-500 ring-1 ring-rose-300'
                          : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500'
                      }`}
                      title={isWishlisted ? (isAr ? "إزالة من المفضلة" : "Remove from Wishlist") : (isAr ? "إضافة للمفضلة" : "Add to Wishlist")}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  )}

                  {/* Compare Button */}
                  {onToggleCompare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(product);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
                        isCompared
                          ? 'bg-[#df6828] text-white'
                          : 'bg-white/80 hover:bg-white text-gray-400 hover:text-[#df6828]'
                      }`}
                      title={isCompared ? (isAr ? "إزالة من المقارنة" : "Remove from Compare") : (isAr ? "مقارنة المنتج" : "Compare Product")}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Product Image Container */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="relative w-full aspect-square bg-[#f9f9f9] overflow-hidden cursor-pointer flex items-center justify-center p-2 border-b border-gray-100"
                >
                  <img
                    src={product.image}
                    alt={displayTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Multi-image count indicator badge */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-900 shadow-xs">
                        {product.images.length} {isAr ? "صور" : "images"}
                      </span>
                    </div>
                  )}

                  {/* Product Label Badge Overlay */}
                  {(product.badge || product.badgeAr) && (
                    <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide ${
                        product.badge === 'Best Seller'
                          ? 'bg-amber-500 text-white'
                          : product.badge === 'Ready to Ship'
                          ? 'bg-emerald-600 text-white'
                          : product.badge === 'Hot Deal'
                          ? 'bg-rose-600 text-white'
                          : product.badge === 'New' || product.badge === 'New Arrival'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#df6828] text-white'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
                        <span>{isAr ? (product.badgeAr || product.badge) : (product.badge || product.badgeAr)}</span>
                      </span>
                    </div>
                  )}

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="bg-white/95 text-gray-900 text-xs font-semibold px-2.5 py-1.5 rounded shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-[#df6828]" />
                      <span>{isAr ? "معاينة" : "Preview"}</span>
                    </span>
                  </div>
                </div>

                {/* Product Information */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category subtle label */}
                    <span className="text-[10px] text-gray-400 block truncate mb-1">
                      {categoryName}
                    </span>

                    {/* Product Title */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-[#df6828] cursor-pointer transition-colors leading-snug min-h-[32px]"
                      title={displayTitle}
                    >
                      {displayTitle}
                    </h3>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-100">
                    {/* Price & MOQ */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-[#df6828] font-extrabold text-sm md:text-base">
                        {formatPrice(product.price, currency, lang)}
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">
                        / {product.unit || (isAr ? 'قطعة' : 'Piece')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                      <span>{isAr ? `أدنى طلب: ${product.moq}` : `MOQ: ${product.moq} ${product.unit}`}</span>
                      <span className="flex items-center text-amber-500 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" />
                        {product.rating}
                      </span>
                    </div>

                    {/* Quick Card Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                      {/* WhatsApp Inquiry Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickWhatsApp(product);
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1.5 px-1 rounded-sm text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        title={isAr ? "استفسار عبر واتساب" : "Inquire via WhatsApp"}
                      >
                        <PhoneCall className="w-3 h-3 text-[#25D366]" />
                        <span className="text-[10px]">{isAr ? "واتساب" : "Chat"}</span>
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="bg-[#df6828] hover:bg-[#c65a1f] text-white py-1.5 px-1 rounded-sm text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors active:scale-95"
                        title={isAr ? "أضف للسلة" : "Add to Cart"}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span className="text-[10px]">{isAr ? "طلب" : "Order"}</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Comparison Bar (Docked when items selected) */}
      {compareIds.length > 0 && (
        <div 
          id="floating-compare-dock"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#38312d] text-white px-5 py-3 rounded-full shadow-2xl border border-[#4d4440] flex items-center gap-4 max-w-lg w-[90%]"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#df6828] flex items-center justify-center text-white flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold block truncate">
                {isAr ? `مقارنة المنتجات (${compareIds.length})` : `Comparing ${compareIds.length} Products`}
              </span>
              <span className="text-[10px] text-gray-300">
                {isAr ? "اضغط للمقارنة جنباً إلى جنب" : "Click to view side-by-side specs"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompareModal}
              className="bg-[#df6828] hover:bg-[#c65a1f] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{isAr ? "مقارنة الآن" : "Compare Now"}</span>
            </button>
            {onClearCompare && (
              <button
                onClick={onClearCompare}
                className="text-gray-400 hover:text-white p-1 transition-colors"
                title={isAr ? "إلغاء المقارنة" : "Clear Compare"}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

