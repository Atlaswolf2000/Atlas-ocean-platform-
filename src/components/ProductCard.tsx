import React from 'react';
import { Star, MessageSquare, ShoppingCart, CheckCircle2, ShieldCheck, Heart, Eye } from 'lucide-react';
import { DepartmentProduct, Product } from '../types';

interface ProductCardProps {
  product: DepartmentProduct | Product;
  onChat?: (product: DepartmentProduct | Product) => void;
  onOrder?: (product: DepartmentProduct | Product) => void;
  onPreview?: (product: DepartmentProduct | Product) => void;
  onToggleWishlist?: (product: DepartmentProduct | Product) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onChat,
  onOrder,
  onPreview,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  // Extract values consistently whether passing DepartmentProduct or full Product
  const productName = ('name' in product && product.name)
    ? product.name
    : ('titleAr' in product && product.titleAr)
    ? product.titleAr
    : ('titleEn' in product ? product.titleEn : 'Product Item');

  const departmentName = product.department || ('categoryId' in product ? product.categoryId : 'Department');
  const vendorName = product.vendor || ('brand' in product ? product.brand : 'Atlas Ocean');
  const moqDisplay = typeof product.moq === 'number'
    ? `${product.moq} ${'unit' in product && product.unit ? product.unit : 'Pieces'}`
    : product.moq || '10 Pieces';

  const currencyDisplay = product.currency || 'SAR';
  const ratingValue = typeof product.rating === 'number' ? product.rating : 4.8;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onPreview && onPreview(product)}
      className="group relative bg-white dark:bg-[#201e1c] border border-gray-200/90 dark:border-[#38332f] rounded-sm overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Container: Image & Badges */}
      <div className="relative w-full aspect-square bg-[#f8f8f8] dark:bg-[#161514] overflow-hidden flex items-center justify-center p-3 border-b border-gray-100 dark:border-[#2d2825]">
        {/* Vendor Badge (شارة توضح اسم البائع) */}
        <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-[#1f1d1a]/90 dark:bg-black/90 backdrop-blur-xs text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-sm border border-amber-500/30 shadow-xs tracking-wide">
            <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[130px]">{vendorName}</span>
          </span>
        </div>

        {/* Top-Right Quick Actions: Wishlist */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute top-2.5 end-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 ring-1 ring-rose-300'
                : 'bg-white/90 dark:bg-[#262320]/90 text-gray-400 hover:text-rose-500 hover:bg-white'
            }`}
            title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}

        {/* Product Image (صورة المنتج في الأعلى) */}
        <img
          src={product.image}
          alt={productName}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Quick Preview Trigger */}
        <div
          onClick={() => onPreview && onPreview(product)}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none group-hover:pointer-events-auto"
        >
          <span className="bg-white dark:bg-[#1f1d1a] text-gray-900 dark:text-gray-100 text-xs font-semibold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#df6828]" />
            <span>معاينة المنتج</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Department Name Badge (اسم القسم أسفل الصورة أو فوق الاسم) */}
          <div className="flex items-center gap-1 mb-1.5">
            <span className="inline-block text-[10.5px] font-semibold text-[#df6828] bg-orange-50 dark:bg-[#341d13] px-2 py-0.5 rounded-xs border border-orange-200/60 dark:border-orange-800/40 truncate max-w-full">
              {departmentName}
            </span>
          </div>

          {/* Product Name (اسم المنتج) */}
          <h3
            onClick={() => onPreview && onPreview(product)}
            className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-[#df6828] dark:hover:text-amber-400 cursor-pointer transition-colors leading-snug min-h-[36px]"
            title={productName}
          >
            {productName}
          </h3>
        </div>

        {/* Pricing, MOQ & Rating */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-[#2d2825]">
          {/* Price & Currency (السعر والعملة) */}
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-lg font-black text-[#df6828] dark:text-amber-400">
                {typeof product?.price === 'number' && !isNaN(product.price) ? product.price.toLocaleString() : '0'}
              </span>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {currencyDisplay}
              </span>
            </div>

            {/* Verified supplier micro-badge */}
            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>موثق</span>
            </span>
          </div>

          {/* MOQ and Rating (الحد الأدنى للطلب والتقييم) */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              MOQ: <strong className="text-gray-800 dark:text-gray-200">{moqDisplay}</strong>
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{(typeof ratingValue === 'number' && !isNaN(ratingValue) ? ratingValue : 4.8).toFixed(1)}</span>
            </span>
          </div>

          {/* Action Buttons: Chat & Order (أزرار Chat و Order) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Chat / WhatsApp Button */}
            <button
              type="button"
              id={`btn-chat-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onChat) onChat(product);
              }}
              className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 py-1.5 px-2 rounded-xs text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
              title="محادثة واستفسار فوري مع التاجر"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Chat</span>
            </button>

            {/* Order / Purchase Button */}
            <button
              type="button"
              id={`btn-order-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onOrder) onOrder(product);
              }}
              className="w-full bg-[#df6828] hover:bg-[#c95b1e] text-white py-1.5 px-2 rounded-xs text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
              title="طلب المنتج وإضافته لسلة المشتريات"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
