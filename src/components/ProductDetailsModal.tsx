import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  ShoppingCart,
  MessageSquare,
  Package,
  Boxes,
  Truck,
  Building2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Product, DepartmentProduct, Language } from '../types';

export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | DepartmentProduct | null;
  onAddToCart?: (product: Product | DepartmentProduct, quantity: number) => void;
  onWhatsAppInquiry?: (product: Product | DepartmentProduct) => void;
  lang?: Language;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onWhatsAppInquiry,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  if (!isOpen || !product) return null;

  // Extract normalized fields regardless of Product vs DepartmentProduct structure
  const productName =
    ('name' in product && product.name)
      ? product.name
      : ('titleAr' in product && isAr && product.titleAr)
      ? product.titleAr
      : ('titleEn' in product && product.titleEn)
      ? product.titleEn
      : ('titleAr' in product ? product.titleAr : 'Atlas Ocean Product');

  const departmentName =
    product.department ||
    ('categoryId' in product ? product.categoryId : 'Commercial Department');

  const vendorName =
    product.vendor ||
    ('brand' in product ? product.brand : 'Atlas Ocean Verified Partner');

  const ratingValue =
    typeof product.rating === 'number' ? product.rating : 4.9;

  const priceUSD =
    typeof product.price === 'number'
      ? product.currency === 'USD'
        ? product.price
        : product.price / 3.75 // approximate or direct USD
      : 110;

  const priceIQD = Math.round(priceUSD * 1500);

  const moqDisplay =
    typeof product.moq === 'number'
      ? `${product.moq} ${'unit' in product && product.unit ? product.unit : 'قطع'}`
      : product.moq || '10 قطع';

  const rawMoqNumber =
    typeof product.moq === 'number'
      ? product.moq
      : parseInt(String(product.moq).replace(/\D/g, '')) || 1;

  const [quantity, setQuantity] = useState<number>(rawMoqNumber);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Gallery of images
  const imagesList =
    'images' in product && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image];

  const productDescription =
    ('descriptionAr' in product && isAr && product.descriptionAr)
      ? product.descriptionAr
      : ('descriptionEn' in product && product.descriptionEn)
      ? product.descriptionEn
      : 'منتج معتمد وعالي الجودة بمواصفات قياسية للتوريد والتجارة بالجملة. يتم فحص كل شحنة عبر منصة أطلس المحيط لضمان مطابقة المواصفات الفنية المعتمدة للشحن الدولي واللوجستي.';

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  const handleWhatsAppClick = () => {
    if (onWhatsAppInquiry) {
      onWhatsAppInquiry(product);
    } else {
      // Default WhatsApp fallback URL
      const text = encodeURIComponent(
        `مرحباً، أود الاستفسار عن منتج: ${productName} (الكمية: ${quantity}) عبر منصة Atlas Ocean.`
      );
      window.open(`https://wa.me/9647700000000?text=${text}`, '_blank');
    }
  };

  return (
    <div
      id="product-details-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card - Bottom sheet on mobile, centered modal on tablet/desktop */}
      <div
        id="product-details-modal-card"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100 max-h-[92vh] flex flex-col transition-all transform animate-slideUp sm:animate-scaleUp"
      >
        {/* 1. زر إغلاق (X) دائري وأنيق في الزاوية العلوية */}
        <button
          id="btn-close-product-details"
          onClick={onClose}
          className="absolute top-4 end-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container for content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 md:p-8">
          
          {/* 2. تخطيط شبكي (Grid) ينقسم إلى قسمين في الشاشات الكبيرة */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* ---------------------------------------------------- */}
            {/* القسم الأول: منطقة عرض صورة المنتج بحجم كبير           */}
            {/* ---------------------------------------------------- */}
            <div className="md:col-span-6 flex flex-col gap-3">
              {/* Main Image Viewport */}
              <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border border-slate-700/70 p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-inner group">
                
                {/* Visual Ambient Glow */}
                <div className="absolute -bottom-10 -end-10 w-44 h-44 bg-[#df6828]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-10 -start-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <img
                  src={imagesList[activeImageIndex] || product.image}
                  alt={productName}
                  referrerPolicy="no-referrer"
                  className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                {/* Micro Badge for Zoom/Verification */}
                <div className="absolute bottom-3 start-3 z-10 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-bold text-slate-300 flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'فحص جودة معتمد' : 'Verified Quality'}</span>
                </div>
              </div>

              {/* Thumbnails if multiple images exist */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-800 p-1 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#df6828] shadow-md shadow-[#df6828]/20 scale-105'
                          : 'border-slate-700/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* القسم الثاني: التفاصيل والمعلومات                     */}
            {/* ---------------------------------------------------- */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-5">
              
              <div className="space-y-3.5">
                {/* أ. شارة (Badge) علوية بلون ذهبي/برتقالي توضح "اسم القسم" */}
                <div className="flex items-center gap-2 flex-wrap pe-10 sm:pe-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#df6828]/20 to-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full shadow-xs">
                    <Package className="w-3.5 h-3.5 text-[#df6828]" />
                    <span>{departmentName}</span>
                  </span>

                  <span className="text-[11px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700 font-mono">
                    ID: #{String(product.id).slice(-6)}
                  </span>
                </div>

                {/* ب. اسم المنتج بخط عريض وفخم */}
                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                  {productName}
                </h1>

                {/* ج. بطاقة معلومات التاجر: اسم التاجر مع أيقونة حساب موثق وتقييم */}
                <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3 flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-[#df6828] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                      {vendorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-white truncate">
                        <span className="truncate">{vendorName}</span>
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 text-[10px] font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          حساب موثق ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isAr ? 'مورّد معتمد في أطلس المحيط' : 'Verified Atlas Partner'}
                      </p>
                    </div>
                  </div>

                  {/* تقييم المنتج */}
                  <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 text-amber-400 text-xs font-extrabold shrink-0 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{ratingValue.toFixed(1)}</span>
                  </div>
                </div>

                {/* د. منطقة السعر: بالدولار USD وبالدينار العراقي IQD */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-lg">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                        {isAr ? 'سعر الجملة التجاري' : 'Wholesale B2B Price'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-[#df6828]">
                          ${priceUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-bold text-slate-400">USD</span>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="text-[11px] text-slate-400 block mb-0.5">
                        {isAr ? 'السعر التقديري بالعراقي' : 'Approx. in IQD'}
                      </span>
                      <div className="text-sm sm:text-base font-black text-amber-400 font-mono">
                        ≈ {priceIQD.toLocaleString()} IQD
                      </div>
                    </div>
                  </div>
                </div>

                {/* هـ. شريط يوضح "الحد الأدنى للطلب (MOQ)" لعملاء B2B */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Boxes className="w-4 h-4 text-sky-400" />
                    <span>{isAr ? 'الحد الأدنى للطلب (MOQ):' : 'Minimum Order (MOQ):'}</span>
                    <span className="text-white bg-slate-700 px-2 py-0.5 rounded font-mono text-xs">
                      {moqDisplay}
                    </span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                    <span className="text-[11px] text-slate-400">{isAr ? 'الكمية:' : 'Qty:'}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(rawMoqNumber, q - 1))}
                      className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-bold text-white text-xs font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* و. فقرة نصية أنيقة لوصف المنتج ومواصفاته الفنية */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isAr ? 'الوصف والمواصفات الفنية:' : 'Specifications & Details:'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                    {productDescription}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* -------------------------------------------------------- */}
        {/* 3. منطقة الإجراءات (Call to Action) في الأسفل                */}
        {/* -------------------------------------------------------- */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md flex flex-col-reverse sm:flex-row items-center gap-3">
          
          {/* زر ثانوي: تواصل مع التاجر (WhatsApp) */}
          <button
            id="btn-modal-whatsapp"
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full sm:w-auto sm:min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/50 hover:border-emerald-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all transform active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'تواصل مع التاجر (WhatsApp)' : 'Contact Vendor (WhatsApp)'}</span>
          </button>

          {/* زر رئيسي عريض وفخم: إضافة إلى السلة (Add to Cart) */}
          <button
            id="btn-modal-add-to-cart"
            type="button"
            onClick={handleAddToCartClick}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl text-sm sm:text-base font-black text-white bg-gradient-to-r from-[#df6828] via-[#e57a3d] to-amber-500 hover:from-[#c95b1e] hover:to-amber-600 shadow-xl shadow-[#df6828]/25 hover:shadow-[#df6828]/40 focus:ring-4 focus:ring-[#df6828]/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span>
              {isAr
                ? `إضافة إلى السلة ($${(priceUSD * quantity).toLocaleString()})`
                : `Add to Cart ($${(priceUSD * quantity).toLocaleString()})`}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
