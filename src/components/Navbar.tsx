import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  ChevronDown, 
  Home, 
  LogIn, 
  UserPlus, 
  ShoppingCart, 
  PlusCircle, 
  SlidersHorizontal,
  Globe,
  PhoneCall,
  Heart,
  Sun,
  Moon,
  Coins,
  ArrowRight,
  Sparkles,
  PackageOpen,
  Store
} from 'lucide-react';
import { AtlasLogo } from './AtlasLogo';
import { Product, Language, CurrencyCode } from '../types';
import { CURRENCIES, formatPrice } from '../utils/currency';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  onOpenUpload: () => void;
  onOpenAdmin: () => void;
  onOpenMaterialCards?: () => void;
  onOpenStoreManagement?: (tab?: 'main-catalog' | 'store-products' | 'add-product' | 'store-profile' | 'store-contact') => void;
  onOpenVendorDashboard?: () => void;
  onOpenCreateStore?: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenWhatsApp: () => void;
  onToggleCategoriesDropdown: () => void;
  onGoHome: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  currency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  theme = 'light',
  onToggleTheme,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenUpload,
  onOpenAdmin,
  onOpenMaterialCards,
  onOpenStoreManagement,
  onOpenVendorDashboard,
  onOpenCreateStore,
  onOpenAuth,
  onOpenWhatsApp,
  onToggleCategoriesDropdown,
  onGoHome,
  products = [],
  onSelectProduct,
  currency = 'USD',
  onCurrencyChange,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  // Handle clicking outside search dropdown or menus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
  };

  // Smart Search Matching and Highlighting Logic
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingProducts = (trimmedQuery.length >= 2 && products)
    ? products.filter((p) => {
        return (
          p.titleAr?.toLowerCase().includes(trimmedQuery) ||
          p.titleEn?.toLowerCase().includes(trimmedQuery) ||
          p.brand?.toLowerCase().includes(trimmedQuery) ||
          p.descriptionAr?.toLowerCase().includes(trimmedQuery) ||
          p.descriptionEn?.toLowerCase().includes(trimmedQuery)
        );
      }).slice(0, 5)
    : [];

  // Helper to highlight matching characters/words in text
  const renderHighlighted = (text: string, query: string) => {
    if (!text || !query || query.trim().length === 0) return text;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark 
              key={index} 
              className="bg-amber-200 dark:bg-amber-500/40 text-amber-950 dark:text-amber-100 font-black px-0.5 rounded"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <header className="w-full select-none shadow-md z-30 sticky top-0">
      {/* Top Header Bar */}
      <div className="bg-[#4d4440] text-white py-3.5 px-3 sm:px-5 border-b border-[#3b3430]">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <AtlasLogo onClick={onGoHome} />

          {/* Search Input Bar with Instant Smart Search Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl w-full relative">
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full flex items-stretch shadow-inner"
            >
              <input
                id="platform-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={isAr ? "ابحث عن المنتجات، الأقسام، الكلمات المفتاحية..." : "Search"}
                className="w-full bg-white text-gray-800 px-4 py-2.5 text-sm rounded-l-none outline-none focus:ring-2 focus:ring-[#e26928] placeholder-gray-400"
                dir={isAr ? "rtl" : "ltr"}
                autoComplete="off"
              />
              <button
                id="platform-search-button"
                type="submit"
                className="bg-[#df6828] hover:bg-[#c95b1e] text-white px-5 py-2.5 flex items-center justify-center transition-colors font-medium flex-shrink-0"
                title={isAr ? "بحث" : "Search"}
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Smart Search Dropdown (البحث الذكي الفوري مع التمييز) */}
            {isSearchFocused && trimmedQuery.length >= 2 && (
              <div 
                id="smart-search-results-dropdown"
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-b-md shadow-2xl z-50 overflow-hidden text-gray-800 animate-in fade-in duration-150"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                {/* Header info */}
                <div className="bg-gray-50 px-3.5 py-2 border-b border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#df6828]" />
                    <span>{isAr ? "نتائج البحث الذكي الفوري:" : "Instant Smart Search Results:"}</span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {matchingProducts.length > 0 
                      ? (isAr ? `${matchingProducts.length} منتجات مطابقة` : `${matchingProducts.length} matches`) 
                      : (isAr ? "لا توجد نتائج" : "No matches")}
                  </span>
                </div>

                {/* Results list */}
                {matchingProducts.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {matchingProducts.map((prod) => {
                      const prodTitle = isAr ? prod.titleAr : prod.titleEn;
                      return (
                        <div
                          key={prod.id}
                          id={`smart-search-item-${prod.id}`}
                          onClick={() => {
                            setIsSearchFocused(false);
                            if (onSelectProduct) {
                              onSelectProduct(prod);
                            }
                          }}
                          className="p-3 hover:bg-orange-50/70 transition-colors cursor-pointer flex items-center gap-3 group"
                        >
                          <img
                            src={prod.image}
                            alt={prodTitle}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain bg-white rounded border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              {prod.brand && (
                                <span className="text-[9px] font-black uppercase tracking-wider bg-gray-800 text-white px-1.5 py-0.2 rounded">
                                  {renderHighlighted(prod.brand, searchQuery)}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400">
                                {isAr ? `أدنى كمية: ${prod.moq} ${prod.unit}` : `MOQ: ${prod.moq} ${prod.unit}`}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#df6828] transition-colors truncate">
                              {renderHighlighted(prodTitle, searchQuery)}
                            </h4>
                          </div>

                          <div className="text-end flex-shrink-0">
                            <span className="text-xs font-black text-[#df6828] block">
                              {formatPrice(prod.price, currency, lang)}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              / {prod.unit || (isAr ? 'قطعة' : 'Piece')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500">
                    {isAr 
                      ? `لم يتم العثور على أي منتج يطابق "${searchQuery}"` 
                      : `No products matching "${searchQuery}"`}
                  </div>
                )}

                {/* Dropdown footer: View full search */}
                <button
                  type="button"
                  onClick={() => setIsSearchFocused(false)}
                  className="w-full bg-gray-50 hover:bg-gray-100 p-2 text-center text-xs font-bold text-[#df6828] border-t border-gray-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{isAr ? `تصفح كل النتائج لكلمة "${searchQuery}"` : `View all results for "${searchQuery}"`}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Top Quick Actions (Upload material & Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Vendor: Open Store / فتح متجر جديد */}
            {onOpenCreateStore && (
              <button
                id="top-create-store-btn"
                onClick={onOpenCreateStore}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:border-amber-400 font-bold px-2.5 sm:px-3 py-2 text-xs rounded flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
                title={isAr ? "تقديم طلب فتح متجر جديد على منصة أطلس" : "Apply for a Vendor Store"}
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">{isAr ? "طلب فتح متجر" : "Open Store"}</span>
                <span className="md:hidden">{isAr ? "تاجر" : "Vendor"}</span>
              </button>
            )}

            {/* Store Management / متجري */}
            {onOpenStoreManagement && (
              <button
                id="top-my-store-btn"
                onClick={() => onOpenStoreManagement('store-products')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-2 text-xs rounded flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
                title={isAr ? "نظام إدارة المتجر والمنتجات" : "Store & Products Management"}
              >
                <Store className="w-4 h-4" />
                <span>{isAr ? "متجري" : "My Store"}</span>
              </button>
            )}

            {/* Primary Action: Upload Products / المواد والمنتجات */}
            <button
              id="quick-upload-product-btn"
              onClick={onOpenUpload}
              className="bg-[#df6828] hover:bg-[#c95b1e] text-white px-3.5 py-2 text-xs font-semibold rounded flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAr ? "رفع منتج / مادة" : "Upload Product"}</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="navbar-wishlist-button"
              onClick={onOpenWishlist}
              className="relative bg-[#38312d] hover:bg-[#2b2522] border border-[#5d544f] text-white p-2.5 rounded transition-all flex items-center justify-center group"
              title={isAr ? "قائمة الأمنيات والمفضلة" : "Wishlist"}
            >
              <Heart className={`w-4 h-4 transition-colors ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-300 group-hover:text-white'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#4d4440]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="navbar-cart-button"
              onClick={onOpenCart}
              className="relative bg-[#38312d] hover:bg-[#2b2522] border border-[#5d544f] text-white p-2.5 rounded transition-all flex items-center gap-2"
              title={isAr ? "سلة المشتريات" : "Cart"}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#df6828] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#4d4440] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Nav Bar (Dark charcoal bar) */}
      <div className="bg-[#38312d] text-[#e0dedc] text-xs sm:text-sm font-medium border-b border-[#2b2522]">
        <div className="w-full px-3 sm:px-5 flex items-center justify-between h-10">
          
          {/* Left Side: All Categories & Home */}
          <div className="flex items-center h-full">
            {/* "All Categories" button with dropdown */}
            <button
              id="all-categories-toggle-btn"
              onClick={onToggleCategoriesDropdown}
              className="h-full bg-[#2a2422] hover:bg-[#221c1a] px-4 flex items-center gap-3 text-white font-semibold transition-colors border-r border-[#433b37]"
            >
              <Menu className="w-4 h-4" />
              <span>{isAr ? "جميع الأقسام" : "All Categories"}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Home Link */}
            <button
              id="nav-home-link"
              onClick={onGoHome}
              className="h-full px-4 flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 text-[#d97539]" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </button>

            {/* Admin Management Dashboard Link */}
            <button
              id="nav-admin-dashboard-btn"
              onClick={onOpenAdmin}
              className="hidden md:flex h-full px-4 items-center gap-1.5 text-[#e5935f] hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAr ? "إدارة المنصة والمبيعات" : "Platform Management"}</span>
            </button>

            {/* Material Cards System (نظام إدارة بطاقات المواد) */}
            {onOpenMaterialCards && (
              <button
                id="nav-material-cards-btn"
                onClick={onOpenMaterialCards}
                className="hidden sm:flex h-full px-3.5 items-center gap-1.5 text-amber-300 hover:text-white transition-colors bg-amber-500/10 hover:bg-amber-500/20 border-x border-amber-500/20 font-bold"
                title={isAr ? "نظام إدارة وتعديل بطاقات المواد والمواصفات الفنية ومعرض الصور" : "Material Cards System & Specs"}
              >
                <PackageOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? "بطاقات المواد" : "Material Cards"}</span>
              </button>
            )}

            {/* My Store (لوحة تحكم التاجر - متجري) */}
            {onOpenVendorDashboard && (
              <button
                id="nav-my-store-btn"
                onClick={onOpenVendorDashboard}
                className="flex h-full px-3 sm:px-3.5 items-center gap-1.5 text-[#df6828] hover:text-white transition-colors bg-[#df6828]/10 hover:bg-[#df6828] border-x border-[#df6828]/30 font-bold cursor-pointer"
                title={isAr ? "لوحة تحكم التاجر - متجري (Atlas Ocean Vendor Dashboard)" : "My Store - Vendor Dashboard"}
              >
                <Store className="w-3.5 h-3.5 text-[#df6828]" />
                <span>{isAr ? "متجري" : "My Store"}</span>
              </button>
            )}

            {/* Store Management System (نظام إدارة المتجر) */}
            {onOpenStoreManagement && (
              <button
                id="nav-store-management-btn"
                onClick={() => onOpenStoreManagement('main-catalog')}
                className="hidden sm:flex h-full px-3.5 items-center gap-1.5 text-amber-400 hover:text-white transition-colors bg-amber-500/10 hover:bg-amber-500/20 border-x border-amber-500/20 font-bold"
                title={isAr ? "أطلس المحيط - نظام إدارة المتجر والمنتجات" : "Atlas Store Management"}
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? "إدارة المتجر" : "Store Manager"}</span>
              </button>
            )}

            {/* Apply as Vendor / انضم كتاجر */}
            {onOpenCreateStore && (
              <button
                id="nav-apply-vendor-btn"
                onClick={onOpenCreateStore}
                className="hidden md:flex h-full px-3 items-center gap-1.5 text-gray-300 hover:text-amber-300 transition-colors"
                title={isAr ? "انضم كتاجر شريك على منصة أطلس" : "Join as a Partner Vendor"}
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? "انضم كتاجر" : "Join as Vendor"}</span>
              </button>
            )}
          </div>

          {/* Right Side: Login, Register, WhatsApp, Theme, Currency, Language */}
          <div className="flex items-center gap-2 sm:gap-4 h-full">
            {/* Login */}
            <button
              id="nav-login-btn"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{isAr ? "تسجيل الدخول" : "Login"}</span>
            </button>

            {/* Register */}
            <button
              id="nav-register-btn"
              onClick={() => onOpenAuth('register')}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{isAr ? "تسجيل حساب" : "Register"}</span>
            </button>

            {/* WhatsApp */}
            <button
              id="nav-whatsapp-btn"
              onClick={onOpenWhatsApp}
              className="flex items-center gap-1 text-[#25D366] hover:text-[#42f082] font-semibold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Whatsapp</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              id="nav-theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#2b2522] text-amber-300 hover:text-amber-200 cursor-pointer"
              title={theme === 'dark' ? (isAr ? "التحويل إلى الوضع النهاري" : "Switch to Light Mode") : (isAr ? "التحويل إلى الوضع الليلي" : "Switch to Dark Mode")}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-blue-200" />
              )}
              <span className="hidden md:inline text-xs font-semibold text-gray-200">
                {theme === 'dark' ? (isAr ? "نهاري" : "Light") : (isAr ? "ليلي" : "Dark")}
              </span>
            </button>

            {/* Multi-Currency Selector (محول العملات المتعددة) */}
            <div className="relative">
              <button
                id="nav-currency-selector-btn"
                type="button"
                onClick={() => {
                  setCurrencyMenuOpen(!currencyMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-1 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#2b2522] text-amber-300 hover:text-amber-200"
                title={isAr ? "اختيار عملة عرض الأسعار (USD / SAR / EUR)" : "Change display currency (USD / SAR / EUR)"}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-xs">{currency}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {currencyMenuOpen && (
                <div 
                  id="currency-selection-menu"
                  className="absolute right-0 mt-1 w-40 bg-[#2d2724] border border-[#483f3b] rounded shadow-2xl py-1 z-50 text-xs"
                >
                  <div className="px-3 py-1 text-[10px] text-gray-400 border-b border-[#433b37] uppercase font-bold">
                    {isAr ? "عملة العرض" : "Display Currency"}
                  </div>
                  {(['USD', 'SAR', 'EUR'] as CurrencyCode[]).map((code) => {
                    const info = CURRENCIES[code];
                    const isSelected = currency === code;
                    return (
                      <button
                        key={code}
                        id={`currency-option-${code}`}
                        onClick={() => {
                          if (onCurrencyChange) onCurrencyChange(code);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-[#3f3733] flex items-center justify-between transition-colors ${
                          isSelected ? 'text-[#df6828] font-bold bg-[#38312d]' : 'text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{info.flag}</span>
                          <span>{code}</span>
                          <span className="text-[11px] text-gray-400 font-normal">
                            ({isAr ? info.symbolAr : info.symbol})
                          </span>
                        </div>
                        {isSelected && <span className="text-xs text-[#df6828]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                id="nav-lang-dropdown-btn"
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setCurrencyMenuOpen(false);
                }}
                className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#2b2522]"
              >
                <Globe className="w-3.5 h-3.5 text-[#df6828]" />
                <span className="font-semibold">{lang === 'en' ? 'English' : 'العربية'}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {langMenuOpen && (
                <div 
                  id="lang-selection-menu"
                  className="absolute right-0 mt-1 w-32 bg-[#2d2724] border border-[#483f3b] rounded shadow-xl py-1 z-50 text-xs"
                >
                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#3f3733] flex items-center justify-between ${lang === 'en' ? 'text-[#df6828] font-bold' : 'text-gray-200'}`}
                  >
                    <span>English</span>
                    {lang === 'en' && <span className="text-xs">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('ar');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#3f3733] flex items-center justify-between ${lang === 'ar' ? 'text-[#df6828] font-bold' : 'text-gray-200'}`}
                  >
                    <span>العربية</span>
                    {lang === 'ar' && <span className="text-xs">✓</span>}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
