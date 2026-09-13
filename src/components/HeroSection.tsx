import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  lang: Language;
  onExploreClick: () => void;
  onBannerClick?: (theme: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExploreClick,
  onBannerClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isAr = lang === 'ar';

  const slides = [
    {
      titleEn: 'Global Factory Direct Wholesale',
      titleAr: 'توريد وتجارة جملة مباشرة من المصانع العالمية',
      subtitleEn: 'Access thousands of verified materials, equipment, and consumer goods at manufacturer prices.',
      subtitleAr: 'آلاف المواد الخام والمعدات والمنتجات الاستهلاكية الموثقة بأفضل أسعار المصنع مع ضمان التجارة.',
      badgeEn: 'VERIFIED SUPPLIERS 2025',
      badgeAr: 'موردين معتمدين 2025',
      bgGradient: 'from-[#3a332f] via-[#4d4440] to-[#2b2522]',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      tag: 'Trade & Logistics'
    },
    {
      titleEn: 'Heavy Equipment & Commercial Vehicles',
      titleAr: 'المعدات الثقيلة والمركبات التجارية والشحن',
      subtitleEn: 'Tricycles, electric UTVs, agricultural vehicles, and specialized auto parts with bulk discounts.',
      subtitleAr: 'تروسيكلات، مركبات خدمات كهربائية، قطع غيار سيارات أصلية مع خصومات خاصة للشراء بالجملة.',
      badgeEn: 'FAST EXPORT & SHIPPING',
      badgeAr: 'شحن وتصدير بحري وسريع',
      bgGradient: 'from-[#2e3740] via-[#3a4752] to-[#1f262d]',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
      tag: 'Automotive & Machinery'
    },
    {
      titleEn: 'Industrial & Architectural Materials',
      titleAr: 'المواد الصناعية والديكور ومستلزمات البناء',
      subtitleEn: 'Laminated safety glass, chemical raw solvents, porcelain tiles, and electrical supplies.',
      subtitleAr: 'زجاج أمان مصفح، مذيبات كيميائية، ألواح بورسلين، كابلات كهربائية نحاسية نقية.',
      badgeEn: 'TOP CERTIFIED QUALITY',
      badgeAr: 'جودة معتمدة ومطابقة للمواصفات',
      bgGradient: 'from-[#3e2e28] via-[#523d35] to-[#261c18]',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      tag: 'Raw Materials'
    }
  ];

  // Auto slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
      {/* Center Slider Banner (Takes ~8 cols on desktop) */}
      <div 
        id="hero-main-slider"
        className="lg:col-span-8 relative bg-gray-900 overflow-hidden shadow-sm min-h-[340px] md:min-h-[410px] flex flex-col justify-between group"
      >
        {/* Background Image with darken overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url(${activeSlide.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${activeSlide.bgGradient} opacity-85`} />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between h-full max-w-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#df6828] text-white text-[11px] font-bold tracking-widest uppercase rounded-sm mb-4 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? activeSlide.badgeAr : activeSlide.badgeEn}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
              {isAr ? activeSlide.titleAr : activeSlide.titleEn}
            </h1>

            <p className="text-gray-200 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
              {isAr ? activeSlide.subtitleAr : activeSlide.subtitleEn}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreClick}
              className="bg-[#df6828] hover:bg-[#c65a1f] text-white px-5 py-2.5 rounded-sm text-xs md:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>{isAr ? "استكشف المنتجات والمواد" : "Explore Materials"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <span className="text-[11px] text-gray-300 hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
              <span>{isAr ? "ضمان تجاري معتمد" : "Trade Protected"}</span>
            </span>
          </div>
        </div>

        {/* Navigation Arrows (< and > matching the screenshot translucent squares) */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all z-20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all rounded-full ${
                idx === currentSlide ? 'w-6 bg-[#df6828]' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right 3 Stacked Promotional Banners (Exact match to `banner1`, `banner1`, `banner1` in screenshot) */}
      <div className="lg:col-span-4 flex flex-col gap-2.5 justify-between">
        
        {/* Banner 1 */}
        <div 
          onClick={() => onBannerClick?.('bags')}
          className="relative bg-[#3e3835] text-white p-4 h-[126px] overflow-hidden flex items-center justify-between cursor-pointer group shadow-sm"
        >
          <div className="relative z-10 max-w-[65%]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#e5935f]">
              {isAr ? "عروض حصرية" : "FACTORY SPECIALS"}
            </span>
            <h3 className="text-sm font-bold text-white group-hover:text-[#f3c8a3] transition-colors leading-snug mt-0.5">
              {isAr ? "حقائب وأحذية جلدية بالجملة" : "Premium Leather Goods & Bags"}
            </h3>
            <span className="inline-block mt-2 text-[11px] font-semibold text-[#df6828] group-hover:underline">
              {isAr ? "اطلب الآن ←" : "Source Now →"}
            </span>
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-2/5 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3e3835] via-[#3e3835]/90 to-transparent" />
        </div>

        {/* Banner 2 */}
        <div 
          onClick={() => onBannerClick?.('machinery')}
          className="relative bg-[#353b3e] text-white p-4 h-[126px] overflow-hidden flex items-center justify-between cursor-pointer group shadow-sm"
        >
          <div className="relative z-10 max-w-[65%]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#98c1d9]">
              {isAr ? "معدات الشحن" : "COMMERCIAL VEHICLES"}
            </span>
            <h3 className="text-sm font-bold text-white group-hover:text-[#98c1d9] transition-colors leading-snug mt-0.5">
              {isAr ? "تروسيكلات ومركبات كهربائية" : "Tricycles & Electric Utility UTVs"}
            </h3>
            <span className="inline-block mt-2 text-[11px] font-semibold text-[#df6828] group-hover:underline">
              {isAr ? "استكشف الموديلات ←" : "View Fleet →"}
            </span>
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-2/5 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#353b3e] via-[#353b3e]/90 to-transparent" />
        </div>

        {/* Banner 3 */}
        <div 
          onClick={() => onBannerClick?.('electrical')}
          className="relative bg-[#3e3535] text-white p-4 h-[126px] overflow-hidden flex items-center justify-between cursor-pointer group shadow-sm"
        >
          <div className="relative z-10 max-w-[65%]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#ee9b00]">
              {isAr ? "مواد صناعية" : "INDUSTRIAL MATERIALS"}
            </span>
            <h3 className="text-sm font-bold text-white group-hover:text-[#ee9b00] transition-colors leading-snug mt-0.5">
              {isAr ? "كابلات ومواد كيميائية وألواح" : "Glass, Cables & Chemicals"}
            </h3>
            <span className="inline-block mt-2 text-[11px] font-semibold text-[#df6828] group-hover:underline">
              {isAr ? "تصفح المواد الخام ←" : "View Materials →"}
            </span>
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-2/5 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3e3535] via-[#3e3535]/90 to-transparent" />
        </div>

      </div>
    </div>
  );
};
