import React, { useState } from 'react';
import {
  Package,
  Layers,
  DollarSign,
  Coins,
  Boxes,
  Image as ImageIcon,
  FileText,
  UploadCloud,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Star,
  Store,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';

export const ATLAS_DEPARTMENTS = [
  { en: 'Arts & Crafts Department', ar: 'قسم الفنون والحرف اليدوية' },
  { en: 'Baby supplies department', ar: 'قسم مستلزمات الأطفال' },
  { en: 'Bags and shoes department', ar: 'قسم الحقائب والأحذية' },
  { en: 'Beauty and personal care department', ar: 'قسم الجمال والعناية الشخصية' },
  { en: 'Bicycles and motorcycles Department', ar: 'قسم الدراجات الهوائية والنارية' },
  { en: 'Chemistry department', ar: 'قسم الكيماويات والمواد المعملية' },
  { en: 'Clothing Department', ar: 'قسم الملابس والأزياء' },
  { en: 'Daily Use Department', ar: 'قسم المستلزمات اليومية' },
  { en: 'Decoration Materials Department', ar: 'قسم مواد الديكور والتصميم' },
  { en: 'Electrical Materials Department', ar: 'قسم المواد والكابلات الكهربائية' },
  { en: 'Electronics Department', ar: 'قسم الإلكترونيات والتكنولوجيا' },
  { en: 'Food Department', ar: 'قسم المواد الغذائية والمحاصيل' },
  { en: 'Furniture Department', ar: 'قسم الأثاث والمفروشات' },
  { en: 'Heavy machinery department', ar: 'قسم الآليات والمعدات الثقيلة' },
  { en: 'Home Building Supplies Department', ar: 'قسم مواد ومستلزمات البناء' },
  { en: 'Household electrical appliances Department', ar: 'قسم الأجهزة الكهربائية المنزلية' },
  { en: 'Industrial Equipment & Components Department', ar: 'قسم المعدات والمكونات الصناعية' },
  { en: 'Manufacturing & Processing Machinery Department', ar: 'قسم ماكينات التصنيع والتعبئة' },
  { en: 'Medical devices and equipment Department', ar: 'قسم الأجهزة والمستلزمات الطبية' },
  { en: 'Minerals and Mining Department', ar: 'قسم المعادن والتعدين' },
  { en: 'Musical Instruments Department', ar: 'قسم الآلات الموسيقية' },
  { en: 'Office supplies department', ar: 'قسم المستلزمات المكتبية' },
  { en: 'Packaging & Printing department', ar: 'قسم التغليف والطباعة الصناعية' },
  { en: 'Pet Supplies Department', ar: 'قسم مستلزمات الحيوانات الأليفة' },
];

interface UploadProductFormProps {
  lang?: Language;
  vendorName?: string;
  onPublishSuccess?: (productData: any) => void;
  onCancel?: () => void;
}

export const UploadProductForm: React.FC<UploadProductFormProps> = ({
  lang = 'ar',
  vendorName = 'VIP Partner Store',
  onPublishSuccess,
  onCancel,
}) => {
  const isAr = lang === 'ar';

  // Form states
  const [name, setName] = useState('Acoustic Architectural Slat Wood Wall Panels');
  const [department, setDepartment] = useState('Decoration Materials Department');
  const [priceUSD, setPriceUSD] = useState('110');
  const [priceIQD, setPriceIQD] = useState('165000');
  const [moq, setMoq] = useState('20 Panels');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  );
  const [description, setDescription] = useState(
    'ألواح خشبية عازلة للصوت للديكور الداخلي الفاخر بتصميم هندسي معاصر وسهلة التركيب للمشاريع السكنية والتجارية.'
  );

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Synchronize exchange rate automatically if user changes USD
  const handleUsdChange = (val: string) => {
    setPriceUSD(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setPriceIQD((num * 1500).toFixed(0));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceUSD) return;

    setIsPublishing(true);
    const newProduct = {
      id: `prod-user-${Date.now()}`,
      name,
      department,
      priceUSD: parseFloat(priceUSD) || 0,
      priceIQD: parseFloat(priceIQD) || 0,
      moq,
      imageUrl,
      description,
      vendor: vendorName,
      rating: 5.0,
      status: 'نشط',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsPublishing(false);
      setPublishedSuccess(true);
      if (onPublishSuccess) {
        onPublishSuccess(newProduct);
      }
      setTimeout(() => {
        setPublishedSuccess(false);
      }, 2500);
    }, 800);
  };

  return (
    <div
      id="upload-product-container"
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-[#0f172a] text-slate-100 font-sans"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top Header Banner */}
      <div className="mb-8 border-b border-slate-700/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded bg-gradient-to-r from-[#df6828] to-amber-500 text-white shadow-md">
              <UploadCloud className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAr ? 'إدراج منتج جديد للتاجر' : 'Upload New Product'}
            </h1>
            <span className="text-[11px] font-bold bg-[#df6828]/20 text-[#df6828] border border-[#df6828]/40 px-2 py-0.5 rounded-full">
              ATLAS OCEAN B2B
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {isAr
              ? 'أضف منتجاتك ومواصفات التوريد بالجملة مع معاينة فورية لشكل البطاقة في المنصة'
              : 'Add commercial wholesale products with instant live card preview.'}
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="self-start sm:self-auto text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isAr ? 'إلغاء والعودة' : 'Cancel & Return'}
          </button>
        )}
      </div>

      {/* Success Notification Alert */}
      {publishedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 text-emerald-300 flex items-center gap-3 shadow-lg shadow-emerald-900/20 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-emerald-200">
              {isAr ? 'تم نشر المنتج بنجاح في كتالوج أطلس المحيط!' : 'Product successfully published to Atlas Ocean!'}
            </p>
            <p className="text-emerald-400/90 text-xs">
              {isAr ? 'المنتج متاح الآن للطلب والمعاينة لجميع المشترين المعتمدين.' : 'Now available for verified buyers.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout: Form Grid on left/right, Live Preview on the other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* LEFT/RIGHT FORM SECTION (7 COLS)                          */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-[#1e293b] rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-700/50">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'بيانات ومواصفات المنتج' : 'Product Specifications'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. اسم المنتج (نص) */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                <Package className="w-4 h-4 text-[#df6828]" />
                <span>{isAr ? 'اسم المنتج الكامل' : 'Product Full Title'}</span>
                <span className="text-[#df6828]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'مثال: ألواح خشبية عازلة للصوت للديكور الداخلي' : 'e.g. Acoustic Wood Panels'}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner"
              />
            </div>

            {/* 2. القسم (قائمة منسدلة الـ 24 قسماً) */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'القسم التجاري المعتمد' : 'Atlas Ocean Department'}</span>
                <span className="text-[#df6828]">*</span>
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full appearance-none bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner cursor-pointer"
                >
                  {ATLAS_DEPARTMENTS.map((dept, idx) => (
                    <option key={idx} value={dept.en} className="bg-[#0f172a] text-slate-200">
                      {isAr ? `${dept.ar} — (${dept.en})` : dept.en}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* السعر المزدوج: بالدولار USD وبالدينار العراقي IQD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 3. السعر بالدولار USD */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'السعر بالدولار (USD)' : 'Price in USD ($)'}</span>
                  <span className="text-[#df6828]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={priceUSD}
                    onChange={(e) => handleUsdChange(e.target.value)}
                    placeholder="110"
                    className="w-full ps-8 pe-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 4. السعر بالدينار العراقي IQD */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'السعر بالدينار العراقي (IQD)' : 'Price in IQD'}</span>
                  <span className="text-[#df6828]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    IQD
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={priceIQD}
                    onChange={(e) => setPriceIQD(e.target.value)}
                    placeholder="165000"
                    className="w-full ps-12 pe-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. الحد الأدنى للطلب MOQ (نص) ورابط الصورة (رابط) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 5. الحد الأدنى للطلب */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  <Boxes className="w-4 h-4 text-sky-400" />
                  <span>{isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order (MOQ)'}</span>
                </label>
                <input
                  type="text"
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  placeholder={isAr ? 'مثال: 10 قطع / 20 كرتون' : 'e.g. 10 Pieces / 2 Units'}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner"
                />
              </div>

              {/* 6. رابط صورة المنتج */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>{isAr ? 'رابط صورة المنتج (URL)' : 'Product Image URL'}</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner font-mono text-xs"
                />
              </div>
            </div>

            {/* 7. وصف مختصر للمنتج (Textarea) */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                <FileText className="w-4 h-4 text-[#df6828]" />
                <span>{isAr ? 'وصف مختصر للمنتج' : 'Brief Product Description'}</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isAr ? 'اكتب مواصفات الجودة، خامة التصنيع، بلد المنشأ، والضمان...' : 'Write material quality, origin, warranty...'}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#df6828] focus:ring-2 focus:ring-[#df6828]/30 transition-all shadow-inner resize-none"
              />
            </div>

            {/* زر كبير في الأسفل باسم نشر المنتج بتدرج لوني */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-4 px-6 rounded-xl font-black text-white text-base tracking-wide bg-gradient-to-r from-[#df6828] via-[#e57a3d] to-amber-500 hover:from-[#c95b1e] hover:to-amber-600 focus:ring-4 focus:ring-[#df6828]/40 shadow-xl shadow-[#df6828]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isAr ? 'جاري التحقق ونشر المنتج...' : 'Publishing to Catalog...'}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>{isAr ? 'نشر المنتج (Publish Product)' : 'Publish Product'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* ======================================================== */}
        {/* RIGHT/LEFT PREVIEW SECTION (5 COLS)                       */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700/60 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Eye className="w-4 h-4 text-[#df6828]" />
                <span>{isAr ? 'معاينة حية وفورية (Real-time Preview)' : 'Live Product Preview'}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Live Rendering
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {isAr
                ? 'هكذا ستظهر بطاقة منتجك للمشترين والمستوردين في متجر أطلس المحيط:'
                : 'This is exactly how buyers will view your item on Atlas Ocean:'}
            </p>

            {/* The Actual Rendered Atlas Ocean Product Card */}
            <div className="bg-[#0f172a] rounded-xl border border-slate-700 hover:border-amber-500/40 overflow-hidden shadow-xl transition-all duration-300">
              
              {/* Card Image with Badges */}
              <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden group">
                <img
                  src={imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                  alt={name || 'Product Preview'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                
                {/* Department Tag Overlay */}
                <div className="absolute top-2.5 start-2.5">
                  <span className="text-[10.5px] font-bold text-amber-400 bg-[#0f172a]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/30 shadow-md">
                    {department}
                  </span>
                </div>

                {/* Rating Badge Overlay */}
                <div className="absolute top-2.5 end-2.5 flex items-center gap-1 text-[11px] font-bold bg-[#0f172a]/90 backdrop-blur-md px-2 py-1 rounded-md border border-slate-700 text-amber-400 shadow-md">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>5.0</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Vendor Header */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-semibold truncate max-w-[170px]">
                    <Store className="w-3.5 h-3.5 text-[#df6828]" />
                    {vendorName}
                  </span>
                  <span className="flex items-center gap-0.5 text-emerald-400 text-[10px] font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    <ShieldCheck className="w-3 h-3" />
                    موثق
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                  {name || (isAr ? 'عنوان المنتج هنا' : 'Product Name Goes Here')}
                </h3>

                {/* Description Preview */}
                {description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                )}

                {/* Price Matrix */}
                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#df6828]">
                      ${parseFloat(priceUSD || '0').toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ms-1 font-semibold">USD</span>
                  </div>
                  <div className="text-end font-mono text-xs text-amber-500/90 font-bold">
                    ≈ {parseFloat(priceIQD || '0').toLocaleString()} IQD
                  </div>
                </div>

                {/* MOQ & Action Buttons Simulation */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {isAr ? 'الحد الأدنى:' : 'MOQ:'} <strong className="text-slate-200">{moq || '1 Piece'}</strong>
                  </span>
                </div>

                {/* Simulated Card Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="py-2 px-2 text-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    💬 Chat
                  </div>
                  <div className="py-2 px-2 text-center rounded-lg bg-[#df6828] text-white text-xs font-bold shadow-md shadow-[#df6828]/20">
                    🛒 Order
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11.5px] text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'معايير جودة منتجات منصة أطلس:' : 'Atlas Ocean Quality Guidelines:'}</span>
              </div>
              <p>
                {isAr
                  ? '• يفضل استخدام صور عالية الدقة ذات خلفية واضحة أو بيضاء.'
                  : '• High resolution images on clean or white backgrounds perform best.'}
              </p>
              <p>
                {isAr
                  ? '• تحديد الـ MOQ المناسب يسهل إبرام صفقات التوريد بالجملة مع المشترين.'
                  : '• An optimal MOQ speeds up bulk B2B agreements.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
