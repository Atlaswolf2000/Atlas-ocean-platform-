import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Star, 
  Truck, 
  Building2, 
  ZoomIn, 
  MessageSquare, 
  ThumbsUp, 
  UserCheck, 
  Send,
  Tag,
  FileText
} from 'lucide-react';
import { Product, Language, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { RfqModal } from './RfqModal';

interface Review {
  id: string;
  author: string;
  company?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onWhatsAppInquiry: (product: Product, quantity: number) => void;
  categoryName: string;
  lang: Language;
  currency?: CurrencyCode;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onWhatsAppInquiry,
  categoryName,
  lang,
  currency = 'USD',
}) => {
  const isAr = lang === 'ar';
  const [quantity, setQuantity] = useState<number>(product?.moq || 1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const allImages = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : []);
  const currentDisplayImage = allImages[activeImageIndex] || product?.image || '';

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (!product) return [];
    const saved = localStorage.getItem(`ao_reviews_${product.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial reviews for B2B realism
    return [
      {
        id: 'rev-1',
        author: isAr ? 'م. خالد الشهري' : 'Eng. Khaled Al-Shehri',
        company: isAr ? 'مؤسسة الخليج للمقاولات والتوريدات' : 'Gulf Contracting & Supplies',
        rating: 5,
        date: '2026-08-14',
        comment: isAr 
          ? 'المواد مطابقة تماماً للمواصفات الفنية المعتمدة. سرعة استجابة فائقة من قسم المبيعات والتسليم في الموعد المحدد.'
          : 'High precision materials fully matching certified specs. Exceptional response time and on-schedule freight delivery.',
        verified: true,
      },
      {
        id: 'rev-2',
        author: isAr ? 'أحمد باوزير' : 'Ahmed Bawazeer',
        company: isAr ? 'شركة الأفق للاستيراد والتصدير' : 'Horizon Global Trading LLC',
        rating: 4.8,
        date: '2026-07-28',
        comment: isAr
          ? 'أسعار الجملة منافسة مقارنة بالسوق الخارجي وجودة التغليف الصناعي ممتازة للتحميل والتفريغ.'
          : 'Highly competitive bulk unit prices and resilient industrial packaging for sea containers.',
        verified: true,
      },
    ];
  });

  // New review form
  const [newAuthor, setNewAuthor] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Reset quantity and load reviews when product changes
  useEffect(() => {
    if (!product) return;
    setQuantity(product.moq || 1);
    setActiveImageIndex(0);
    const saved = localStorage.getItem(`ao_reviews_${product.id}`);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback default demo reviews
    setReviews([
      {
        id: 'rev-1',
        author: isAr ? 'م. خالد الشهري' : 'Eng. Khaled Al-Shehri',
        company: isAr ? 'مؤسسة الخليج للمقاولات والتوريدات' : 'Gulf Contracting & Supplies',
        rating: 5,
        date: '2026-08-14',
        comment: isAr 
          ? 'المواد مطابقة تماماً للمواصفات الفنية المعتمدة. سرعة استجابة فائقة من قسم المبيعات والتسليم في الموعد المحدد.'
          : 'High precision materials fully matching certified specs. Exceptional response time and on-schedule freight delivery.',
        verified: true,
      },
      {
        id: 'rev-2',
        author: isAr ? 'أحمد باوزير' : 'Ahmed Bawazeer',
        company: isAr ? 'شركة الأفق للاستيراد والتصدير' : 'Horizon Global Trading LLC',
        rating: 4.8,
        date: '2026-07-28',
        comment: isAr
          ? 'أسعار الجملة منافسة مقارنة بالسوق الخارجي وجودة التغليف الصناعي ممتازة للتحميل والتفريغ.'
          : 'Highly competitive bulk unit prices and resilient industrial packaging for sea containers.',
        verified: true,
      },
    ]);
  }, [product?.id, product?.moq, isAr]);

  useEffect(() => {
    if (!product) return;
    localStorage.setItem(`ao_reviews_${product.id}`, JSON.stringify(reviews));
  }, [reviews, product?.id]);

  if (!product) return null;

  const displayTitle = isAr ? product.titleAr : product.titleEn;
  const displayDesc = isAr ? product.descriptionAr : product.descriptionEn;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      company: newCompany.trim() || (isAr ? 'مشترٍ معتمد' : 'Verified Trade Buyer'),
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newComment.trim(),
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewCompany('');
    setNewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // Bulk discount rules
  const discountTiers = [
    { minQty: product.moq, label: `${product.moq} - 49`, discountPercent: 0 },
    { minQty: 50, label: '50 - 99', discountPercent: 5 },
    { minQty: 100, label: '100 - 249', discountPercent: 10 },
    { minQty: 250, label: '250+', discountPercent: 15 },
  ];

  const activeDiscount = quantity >= 250 ? 15 : quantity >= 100 ? 10 : quantity >= 50 ? 5 : 0;
  const unitPriceAfterDiscount = product.price * (1 - activeDiscount / 100);
  const totalPrice = unitPriceAfterDiscount * quantity;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="quick-view-product-modal-dialog"
        className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 w-full max-w-4xl rounded shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 flex flex-col max-h-[92vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="bg-[#4d4440] text-white px-5 py-3 flex items-center justify-between border-b border-[#3b3430] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#df6828] font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded">
              {categoryName}
            </span>
            <span className="text-xs text-gray-300">
              {product.brand}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
              {isAr ? "عرض سريع وتفاصيل" : "Quick View & Specs"}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Product Image & Enlargement (5 cols) */}
          <div className="md:col-span-5 flex flex-col">
            <div className="relative aspect-square bg-[#f8f8f8] dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded overflow-hidden p-4 flex items-center justify-center group">
              {product.brand && (
                <span className="absolute top-3 left-3 bg-[#3e3835] text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">
                  {product.brand}
                </span>
              )}

              {/* Zoom Trigger Button */}
              <button
                type="button"
                onClick={() => setIsImageZoomed(true)}
                className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-neutral-800/90 hover:bg-white text-gray-700 dark:text-neutral-200 p-1.5 rounded-full shadow-md transition-all flex items-center gap-1 text-[11px] font-semibold opacity-90 hover:opacity-100"
                title={isAr ? "تكبير الصورة" : "Zoom Image"}
              >
                <ZoomIn className="w-4 h-4 text-[#df6828]" />
                <span className="text-[10px] hidden sm:inline">{isAr ? "تكبير" : "Zoom"}</span>
              </button>

              <img
                src={currentDisplayImage}
                alt={displayTitle}
                referrerPolicy="no-referrer"
                onClick={() => setIsImageZoomed(true)}
                className="w-full h-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail gallery for multiple images */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto p-1 bg-gray-50 dark:bg-neutral-800/40 rounded border border-gray-100 dark:border-neutral-800">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-12 h-12 rounded border-2 overflow-hidden flex-shrink-0 transition-all bg-white dark:bg-neutral-800 ${
                      activeImageIndex === idx 
                        ? 'border-[#df6828] ring-1 ring-[#df6828] scale-105 shadow-xs' 
                        : 'border-gray-200 dark:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                    title={`${isAr ? 'صورة' : 'Image'} ${idx + 1}`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${displayTitle} - ${idx + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-0 right-0 left-0 bg-black/60 text-white text-[8px] text-center font-bold">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="mt-4 bg-gray-50 dark:bg-neutral-800/60 p-3 rounded border border-gray-200 dark:border-neutral-700 text-xs space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isAr ? "ضمان تجارة أصلي ومعتمد 100%" : "100% Genuine Factory Trade Assurance"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                <Truck className="w-4 h-4 text-[#df6828] flex-shrink-0" />
                <span>{isAr ? "شحن بحري وجوي مع التخليص الجمركي" : "Global Freight & Sea Cargo Available"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>{isAr ? "أسعار جملة مباشرة من المصنع" : "Direct Manufacturer Wholesale Pricing"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Tabs & Actions (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-neutral-100 leading-snug">
                {displayTitle}
              </h1>

              {/* Rating & Orders */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-neutral-400 border-b border-gray-100 dark:border-neutral-800 pb-3">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center text-amber-500 font-semibold hover:underline"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline mr-1" />
                  <span>{avgRating} / 5.0 ({reviews.length} {isAr ? "تقييم" : "reviews"})</span>
                </button>
                <span>•</span>
                <span>{isAr ? `${product.ordersCount} طلب مكتمل` : `${product.ordersCount} Orders verified`}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {isAr ? `متوفر في المخزن: ${product.stock}` : `In Stock: ${product.stock} ${product.unit}`}
                </span>
              </div>

              {/* Wholesale Price Box */}
              <div className="bg-orange-50/70 dark:bg-orange-950/30 p-3.5 rounded border border-orange-200/80 dark:border-orange-900/60 my-3.5 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 dark:text-neutral-400 block">
                    {isAr ? "سعر الجملة للوحدة" : "Wholesale Unit Price"}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-[#df6828]">
                      {formatPrice(unitPriceAfterDiscount, currency, lang)}
                    </span>
                    {activeDiscount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.price, currency, lang)}
                      </span>
                    )}
                    <span className="text-xs text-gray-600 dark:text-neutral-400">
                      / {product.unit || (isAr ? "قطعة" : "Piece")}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-500 dark:text-neutral-400 block">
                    {isAr ? "الحد الأدنى للطلب (MOQ)" : "Minimum Order"}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-neutral-200">
                    {product.moq} {product.unit}
                  </span>
                </div>
              </div>

              {/* 2. قواعد خصم الكميات للجملة (Bulk Discount Rules) */}
              <div className="mb-3.5 bg-gray-50/90 dark:bg-neutral-800/80 p-2.5 rounded border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-neutral-200">
                    <Tag className="w-3.5 h-3.5 text-[#df6828]" />
                    <span>{isAr ? "قواعد خصم الكميات للجملة (Bulk Discounts)" : "Bulk Quantity Discount Tiers"}</span>
                  </div>
                  {activeDiscount > 0 ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 animate-pulse">
                      {isAr ? `تم تطبيق خصم ${activeDiscount}%` : `${activeDiscount}% Bulk Discount Applied`}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 dark:text-neutral-400">
                      {isAr ? "اضغط على أي كمية للتطبيق السريع" : "Click tier to auto-select quantity"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {discountTiers.map((tier) => {
                    const isCurrentTier =
                      (tier.minQty === 250 && quantity >= 250) ||
                      (tier.minQty === 100 && quantity >= 100 && quantity < 250) ||
                      (tier.minQty === 50 && quantity >= 50 && quantity < 100) ||
                      (tier.minQty === product.moq && quantity < 50);
                    const tierPrice = product.price * (1 - tier.discountPercent / 100);

                    return (
                      <button
                        key={tier.minQty}
                        type="button"
                        onClick={() => setQuantity(tier.minQty)}
                        className={`p-1.5 rounded border transition-all text-xs cursor-pointer ${
                          isCurrentTier
                            ? 'bg-orange-50 dark:bg-orange-950/60 border-[#df6828] text-[#df6828] font-bold shadow-2xs ring-1 ring-[#df6828]'
                            : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-[10px] text-gray-500 dark:text-neutral-400 truncate">
                          {tier.label} {product.unit || (isAr ? 'قطعة' : 'pcs')}
                        </div>
                        <div className="font-bold text-xs mt-0.5 text-gray-900 dark:text-neutral-100">
                          ${tierPrice.toFixed(2)}
                        </div>
                        <div className="text-[9px] mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                          {tier.discountPercent > 0 ? `-${tier.discountPercent}%` : (isAr ? 'الأساسي' : 'Standard')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300 leading-relaxed mb-4">
                {displayDesc}
              </p>

              {/* Tabs Switcher: Specs vs Reviews */}
              <div className="flex items-center border-b border-gray-200 dark:border-neutral-700 mb-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'specs'
                      ? 'border-[#df6828] text-[#df6828]'
                      : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {isAr ? "المواصفات الفنية" : "Technical Specs"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'border-[#df6828] text-[#df6828]'
                      : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isAr ? `التقييمات والمراجعات (${reviews.length})` : `Customer Reviews (${reviews.length})`}</span>
                </button>
              </div>

              {/* TAB 1: SPECS */}
              {activeTab === 'specs' && (
                <div className="mb-4">
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    <div className="bg-gray-50 dark:bg-neutral-800/80 rounded border border-gray-200 dark:border-neutral-700 divide-y divide-gray-200 dark:divide-neutral-700 text-xs">
                      {Object.entries(product.specs).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-3 p-2">
                          <span className="font-semibold text-gray-600 dark:text-neutral-400">{k}</span>
                          <span className="col-span-2 text-gray-800 dark:text-neutral-200">{v}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-neutral-400 italic">
                      {isAr ? "المواصفات القياسية متاحة حسب طلب العميل." : "Standard factory specifications upon request."}
                    </p>
                  )}
                </div>
              )}

              {/* TAB 2: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="mb-4 space-y-4">
                  {/* Reviews Summary */}
                  <div className="bg-gray-50 dark:bg-neutral-800/80 p-3 rounded border border-gray-200 dark:border-neutral-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-black text-[#df6828]">
                        {avgRating}
                      </div>
                      <div>
                        <div className="flex items-center text-amber-400 text-xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-gray-300 dark:text-neutral-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-neutral-400">
                          {isAr ? `بناءً على ${reviews.length} تقييم مشترٍ معتمد` : `Based on ${reviews.length} verified buyer reviews`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Existing Reviews List */}
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                      <div 
                        key={rev.id} 
                        className="bg-white dark:bg-neutral-800/60 p-3 rounded border border-gray-100 dark:border-neutral-700/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-neutral-200">
                            <span>{rev.author}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                                <UserCheck className="w-2.5 h-2.5" />
                                {isAr ? "مشترٍ موثق" : "Verified"}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-amber-400 text-[10px]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-gray-300 dark:text-neutral-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        {rev.company && (
                          <div className="text-[10px] text-gray-400 dark:text-neutral-500">
                            {rev.company} • {rev.date}
                          </div>
                        )}
                        <p className="text-gray-600 dark:text-neutral-300 text-xs leading-relaxed pt-1">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="bg-gray-50 dark:bg-neutral-800/90 p-3 rounded border border-gray-200 dark:border-neutral-700 space-y-2.5">
                    <span className="font-bold text-gray-800 dark:text-neutral-200 block text-xs">
                      {isAr ? "أضف تقييمك ومراجعتك للمنتج:" : "Write a Customer Review:"}
                    </span>

                    {/* Star Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-600 dark:text-neutral-400">
                        {isAr ? "تقييمك:" : "Rating:"}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-0.5 text-amber-400 focus:outline-none"
                          >
                            <Star 
                              className={`w-4 h-4 ${
                                star <= (hoverRating || newRating) 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-gray-300 dark:text-neutral-600'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder={isAr ? "اسمك أو صفتك *" : "Your Name *"}
                        className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-1 focus:ring-[#df6828]"
                      />
                      <input
                        type="text"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        placeholder={isAr ? "اسم المؤسسة / الشركة (اختياري)" : "Company / Enterprise (optional)"}
                        className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-1 focus:ring-[#df6828]"
                      />
                    </div>

                    <textarea
                      required
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={isAr ? "اكتب رأيك وتجربتك مع المادة وجودتها..." : "Describe product quality, delivery, specifications..."}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-1 focus:ring-[#df6828]"
                    />

                    <div className="flex items-center justify-between">
                      {reviewSuccess && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          {isAr ? "شكراً لك! تم تسجيل تقييمك بنجاح." : "Thank you! Review published successfully."}
                        </span>
                      )}
                      <button
                        type="submit"
                        className="ml-auto bg-[#df6828] hover:bg-[#c65a1f] text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isAr ? "إرسال التقييم" : "Submit Review"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Order Quantity Selector */}
              <div className="flex items-center gap-3 mb-4 bg-gray-50 dark:bg-neutral-800/80 p-2.5 rounded border border-gray-200 dark:border-neutral-700">
                <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                  {isAr ? "الكمية المطلوبة:" : "Order Quantity:"}
                </span>
                <div className="flex items-center border border-gray-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(product.moq, quantity - 1))}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.moq}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="w-16 text-center py-1.5 text-xs font-bold outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200 font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="mr-auto text-end">
                  <span className="text-xs text-gray-700 dark:text-neutral-300 font-bold font-mono block">
                    {isAr ? `الإجمالي: ${formatPrice(totalPrice, currency, lang)}` : `Subtotal: ${formatPrice(totalPrice, currency, lang)}`}
                  </span>
                  {activeDiscount > 0 && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      {isAr 
                        ? `(وفرت ${formatPrice((product.price - unitPriceAfterDiscount) * quantity, currency, lang)})` 
                        : `(Saved ${formatPrice((product.price - unitPriceAfterDiscount) * quantity, currency, lang)})`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-200 dark:border-neutral-700 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* WhatsApp Direct Inquire */}
                <button
                  id="product-whatsapp-inquiry-btn"
                  type="button"
                  onClick={() => onWhatsAppInquiry(product, quantity)}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isAr ? "استفسار وطلب عبر واتساب" : "Inquire on WhatsApp"}</span>
                </button>

                {/* Add to Cart */}
                <button
                  id="product-add-to-cart-btn"
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-2.5 px-4 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all text-white ${
                    addedAnimation ? 'bg-emerald-600' : 'bg-[#df6828] hover:bg-[#c65a1f]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isAr ? "تمت الإضافة للسلة!" : "Added to Cart!"}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isAr ? "إضافة لسلة المشتريات" : "Add to Cart"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Request Custom Quote - RFQ for Bulk Orders */}
              <button
                id="product-rfq-request-btn"
                type="button"
                onClick={() => setIsRfqOpen(true)}
                className="w-full bg-amber-50 hover:bg-amber-100/90 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 py-2.5 px-4 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs group"
                title={isAr ? "طلب تسعيرة مخصصة للكميات الضخمة والحاويات" : "Request Custom Wholesale Quote for Bulk & Containers"}
              >
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{isAr ? "طلب تسعيرة للكميات الضخمة (Request a Quote - RFQ)" : "Request Custom Quote for Bulk (RFQ)"}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* RFQ Modal */}
      <RfqModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        product={product}
        lang={lang}
        currency={currency}
      />

      {/* Lightbox / Zoom Overlay */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors z-20"
              title={isAr ? "إغلاق المعاينة المكبرة" : "Close zoom"}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={currentDisplayImage}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] max-w-full object-contain rounded"
            />
            <p className="mt-2 text-xs font-bold text-gray-700 dark:text-neutral-300">
              {displayTitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
