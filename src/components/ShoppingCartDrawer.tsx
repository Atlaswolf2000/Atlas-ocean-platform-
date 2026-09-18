import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Package,
  Boxes,
  Truck,
  Sparkles,
} from 'lucide-react';
import { CartItem, Language, CurrencyCode, Order } from '../types';

export interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart?: () => void;
  onCheckout?: (orderData?: any) => void;
  lang?: Language;
  currency?: CurrencyCode;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  lang = 'ar',
  currency = 'USD',
}) => {
  const isAr = lang === 'ar';

  // Coupon state
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Simple checkout state inside drawer if user proceeds
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalUSD = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Discount calculation
  const discountAmountUSD = (subtotalUSD * discountPercent) / 100;
  const taxableAmountUSD = Math.max(0, subtotalUSD - discountAmountUSD);
  
  // Commercial B2B Tax / Logistics Platform Fee (e.g., 2% or 0% for B2B)
  const taxUSD = taxableAmountUSD > 0 ? taxableAmountUSD * 0.03 : 0;
  
  const finalTotalUSD = taxableAmountUSD + taxUSD;
  const finalTotalIQD = Math.round(finalTotalUSD * 1500);
  const subtotalIQD = Math.round(subtotalUSD * 1500);

  // Promo Code Validation Handler
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const cleanCode = promoCode.trim().toUpperCase();

    if (!cleanCode) return;

    if (cleanCode === 'ATLAS10' || cleanCode === 'B2B10') {
      setDiscountPercent(10);
      setCouponSuccess(isAr ? 'تم تطبيق خصم الشركاء 10% بنجاح!' : '10% Partner discount applied!');
    } else if (cleanCode === 'ATLAS20' || cleanCode === 'VIP20') {
      setDiscountPercent(20);
      setCouponSuccess(isAr ? 'تم تطبيق كود كبار العملاء 20%!' : '20% VIP Partner coupon applied!');
    } else {
      setCouponError(
        isAr ? 'الكود غير صالح أو منتهي الصلاحية (جرب ATLAS10)' : 'Invalid or expired code (try ATLAS10)'
      );
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    if (onCheckout) {
      onCheckout({
        items: cartItems,
        subtotalUSD,
        finalTotalUSD,
        finalTotalIQD,
        discountPercent,
      });
    } else {
      setIsCheckingOut(true);
    }
  };

  return (
    <div
      id="shopping-cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-y-0 end-0 flex max-w-full">
        {/* The Drawer Panel with Slide-in Animation */}
        <div
          id="shopping-cart-drawer-panel"
          className="relative w-screen max-w-md md:max-w-lg bg-slate-900 border-s border-slate-700/80 text-slate-100 shadow-2xl flex flex-col h-full transform transition-transform ease-out duration-300 animate-slideInRight"
        >
          {/* ======================================================== */}
          {/* 1. HEADER (الرأس)                                        */}
          {/* ======================================================== */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-[#df6828] flex items-center justify-center text-white shadow-lg shadow-[#df6828]/25">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{isAr ? 'سلة المشتريات' : 'Shopping Cart'}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#df6828]/20 text-[#df6828] border border-[#df6828]/30">
                    {totalItemsCount} {isAr ? 'منتجات' : 'items'}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  {isAr ? 'منصة أطلس المحيط للتوريد والتجارة الدولية' : 'Atlas Ocean Commercial B2B Cart'}
                </p>
              </div>
            </div>

            {/* زر دائري أنيق للإغلاق (X) */}
            <button
              id="btn-close-cart-drawer"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* 2. CART ITEMS LIST (منطقة عرض المنتجات)                   */}
          {/* ======================================================== */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-slate-800/60">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4 text-slate-500 shadow-inner">
                  <ShoppingCart className="w-10 h-10 text-slate-500/70" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {isAr ? 'سلة المشتريات فارغة حالياً' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
                  {isAr
                    ? 'تصفح تشكيلة المواد والمنتجات في الأقسام الـ 24 وأضف ما يناسب احتياجاتك التجارية.'
                    : 'Explore products across the 24 departments and add items to your cart.'}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#df6828] to-amber-500 text-white font-bold text-xs shadow-lg shadow-[#df6828]/25 hover:from-[#c95b1e] hover:to-amber-600 transition-all cursor-pointer"
                >
                  {isAr ? 'تصفح المنتجات الآن' : 'Browse Catalog'}
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const prod = item.product;
                const prodTitle =
                  isAr && prod.titleAr ? prod.titleAr : prod.titleEn || prod.titleAr || 'Atlas Product';
                const itemTotalUSD = prod.price * item.quantity;
                const itemTotalIQD = Math.round(itemTotalUSD * 1500);

                return (
                  <div
                    key={prod.id}
                    className="pt-3.5 first:pt-0 flex gap-3.5 items-start group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-inner">
                      <img
                        src={prod.image}
                        alt={prodTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded inline-block mb-1">
                            {prod.department || prod.categoryId || 'General'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                            {prodTitle}
                          </h4>
                        </div>

                        {/* Remove Item Button */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(prod.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                          title={isAr ? 'حذف من السلة' : 'Remove item'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Pricing and Quantity Bar */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                prod.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-7 text-center font-bold text-white text-xs font-mono">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(prod.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-end">
                          <div className="text-xs sm:text-sm font-black text-amber-400">
                            ${itemTotalUSD.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ≈ {itemTotalIQD.toLocaleString()} IQD
                          </div>
                          <div className="text-[9.5px] text-slate-500">
                            (${prod.price.toLocaleString()} / {prod.unit || (isAr ? 'وحدة' : 'unit')})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ======================================================== */}
          {/* 3. ORDER SUMMARY & PROMO (منطقة الملخص)                  */}
          {/* ======================================================== */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-md p-4 sm:p-5 space-y-4 shrink-0 shadow-2xl">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Tag className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={isAr ? 'كود الخصم (مثال: ATLAS10)' : 'Promo code (e.g. ATLAS10)'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl ps-9 pe-3 py-2 text-xs text-white placeholder-slate-500 uppercase tracking-wider font-mono focus:outline-none focus:border-[#df6828] focus:ring-1 focus:ring-[#df6828]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                </div>

                {couponSuccess && (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{couponSuccess}</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-800/80">
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="text-slate-200 font-semibold font-mono">
                    ${subtotalUSD.toLocaleString()} USD
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>{isAr ? `خصم الكود (${discountPercent}%):` : `Discount (${discountPercent}%):`}</span>
                    <span className="font-mono">-${discountAmountUSD.toLocaleString()} USD</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>{isAr ? 'رسوم التوثيق واللوجستيات:' : 'Platform & Verification Fee:'}</span>
                    <span className="text-[10px] text-slate-500">(3%)</span>
                  </span>
                  <span className="text-slate-200 font-semibold font-mono">
                    ${taxUSD.toFixed(1)} USD
                  </span>
                </div>

                {/* Grand Total Bar */}
                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-black text-white block">
                      {isAr ? 'الإجمالي الكلي:' : 'Total Amount:'}
                    </span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      {isAr ? 'شامل فحص الجودة المعتمد' : 'Verified B2B Guaranteed'}
                    </span>
                  </div>

                  <div className="text-end">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-[#df6828]">
                      ${finalTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} USD
                    </div>
                    <div className="text-xs font-bold text-amber-500/90 font-mono">
                      ≈ {finalTotalIQD.toLocaleString()} IQD
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* 4. PROCEED TO CHECKOUT BUTTON                             */}
              {/* ======================================================== */}
              <button
                id="btn-drawer-checkout"
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-xl font-black text-white text-sm sm:text-base tracking-wide bg-gradient-to-r from-[#df6828] via-[#e57a3d] to-amber-500 hover:from-[#c95b1e] hover:to-amber-600 focus:ring-4 focus:ring-[#df6828]/40 shadow-xl shadow-[#df6828]/25 hover:shadow-[#df6828]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{isAr ? 'الاستمرار للدفع وإتمام الطلب' : 'Proceed to Checkout'}</span>
                {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              {/* Secure Transaction Note */}
              <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 text-center pt-0.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isAr
                    ? 'دعم الشحن المباشر والمستودعات المركزية في العراق والخليج'
                    : 'Direct shipping & warehousing in Iraq & the GCC'}
                </span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
