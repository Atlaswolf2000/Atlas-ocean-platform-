import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product, Language } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts?: Product[];
  wishlistItems?: Product[];
  onRemoveFromWishlist?: (productId: string) => void;
  onRemoveItem?: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onQuickWhatsApp?: (product: Product) => void;
  onClearWishlist: () => void;
  lang: Language;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  wishlistItems,
  onRemoveFromWishlist,
  onRemoveItem,
  onAddToCart,
  onSelectProduct,
  onClearWishlist,
  lang,
}) => {
  const isAr = lang === 'ar';
  const items = wishlistProducts || wishlistItems || [];

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    if (onRemoveFromWishlist) onRemoveFromWishlist(id);
    else if (onRemoveItem) onRemoveItem(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="wishlist-drawer-dialog"
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Drawer Header */}
        <div className="bg-[#4d4440] text-white px-5 py-4 flex items-center justify-between border-b border-[#3b3430]">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h3 className="font-bold text-sm sm:text-base">
              {isAr ? "قائمة الأمنيات والمفضلة" : "My Wishlist"}
            </h3>
            <span className="bg-[#df6828] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded transition-colors"
            title={isAr ? "إغلاق" : "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-800 text-sm">
                {isAr ? "قائمة الأمنيات فارغة" : "Your Wishlist is empty"}
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                {isAr
                  ? "اضغط على أيقونة القلب على أي منتج لحفظه والرجوع إليه بسهولة لاحقاً."
                  : "Click the heart icon on any product card to save it for later review."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((prod) => (
                <div
                  key={prod.id}
                  id={`wishlist-item-${prod.id}`}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-sm hover:shadow-xs transition-shadow"
                >
                  <img
                    src={prod.image}
                    alt={isAr ? prod.titleAr : prod.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain bg-gray-50 rounded border border-gray-100 cursor-pointer flex-shrink-0"
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(prod);
                      onClose();
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(prod);
                        onClose();
                      }}
                      className="text-xs font-bold text-gray-800 truncate cursor-pointer hover:text-[#df6828]"
                      title={isAr ? prod.titleAr : prod.titleEn}
                    >
                      {isAr ? prod.titleAr : prod.titleEn}
                    </h4>
                    <span className="text-[10px] text-gray-400 block mb-1">
                      {prod.brand} • {isAr ? `أدنى طلب: ${prod.moq} ${prod.unit}` : `MOQ: ${prod.moq} ${prod.unit}`}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-black text-[#df6828]">
                        {prod.currency}{prod.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-500">/ {prod.unit}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="bg-[#df6828] hover:bg-[#c65a1f] text-white text-[11px] font-semibold px-2.5 py-1 rounded-xs flex items-center gap-1 transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>{isAr ? "أضف للسلة" : "Add to Cart"}</span>
                      </button>

                      <button
                        onClick={() => handleRemove(prod.id)}
                        className="text-gray-400 hover:text-red-600 p-1 text-[11px] flex items-center gap-1 transition-colors"
                        title={isAr ? "إزالة من المفضلة" : "Remove"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isAr ? "حذف" : "Remove"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
            <button
              onClick={onClearWishlist}
              className="w-full text-center text-xs text-gray-500 hover:text-red-600 py-1.5 transition-colors font-medium"
            >
              {isAr ? "تفريغ قائمة المفضلة" : "Clear All Wishlist"}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-[#4d4440] hover:bg-[#38312d] text-white py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isAr ? "متابعة التسوق" : "Continue Shopping"}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
