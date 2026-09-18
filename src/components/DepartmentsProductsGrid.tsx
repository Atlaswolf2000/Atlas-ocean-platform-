import React, { useState, useMemo } from 'react';
import { Layers, Sparkles, Filter, CheckCircle, Search, ArrowUpDown } from 'lucide-react';
import { DepartmentProduct, Product, Language } from '../types';
import { DEPARTMENT_DUMMY_PRODUCTS } from '../data/departmentProducts';
import { ProductCard } from './ProductCard';

interface DepartmentsProductsGridProps {
  onChat: (product: DepartmentProduct | Product) => void;
  onOrder: (product: DepartmentProduct | Product) => void;
  onPreview: (product: DepartmentProduct | Product) => void;
  onToggleWishlist?: (product: DepartmentProduct | Product) => void;
  wishlistIds?: string[];
  lang: Language;
}

export const DepartmentsProductsGrid: React.FC<DepartmentsProductsGridProps> = ({
  onChat,
  onOrder,
  onPreview,
  onToggleWishlist,
  wishlistIds = [],
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // List of all unique 24 departments
  const allDepartments = useMemo(() => {
    return Array.from(new Set(DEPARTMENT_DUMMY_PRODUCTS.map((p) => p.department)));
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = DEPARTMENT_DUMMY_PRODUCTS.filter((item) => {
      const matchDept = selectedDept === 'all' || item.department === selectedDept;
      const matchSearch = searchFilter.trim() === '' ||
        item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchFilter.toLowerCase());
      return matchDept && matchSearch;
    });

    if (sortOrder === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedDept, searchFilter, sortOrder]);

  return (
    <section
      id="all-departments-grid-section"
      className="w-full mt-10 mb-14 bg-[#fcfbf9] dark:bg-[#1c1a18] border border-amber-500/20 rounded-md p-4 sm:p-6 shadow-xs relative overflow-hidden"
    >
      {/* Decorative accent top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#df6828] to-amber-600" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/80 dark:border-[#2f2b27]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? 'بيانات الأقسام المكتملة' : 'Verified Department Catalog'}</span>
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {isAr ? '24 قسماً تجارياً مفعلاً بالكامل' : 'All 24 Departments Active'}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#df6828]" />
            <span>
              {isAr
                ? 'منتجات الأقسام التجارية المعتمدة (Atlas Ocean)'
                : 'All Department Verified Products Grid'}
            </span>
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            {isAr
              ? 'تصفح منتجاً معتمداً لكل قسم من الأقسام الـ 24 المتاحة للتوريد بالجملة والمبيعات المباشرة مع إمكانية التواصل والطلب الفوري.'
              : 'Explore verified commercial products across all 24 departments with direct WhatsApp chat and instant ordering.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search inside departments */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={isAr ? 'بحث في المنتجات...' : 'Search in catalog...'}
              className="w-full ps-8 pe-3 py-1.5 text-xs bg-white dark:bg-[#141312] border border-gray-200 dark:border-[#38332f] rounded-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#141312] border border-gray-200 dark:border-[#38332f] rounded-xs px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3 h-3 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-transparent border-none text-xs text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="default">{isAr ? 'الترتيب الافتراضي' : 'Default'}</option>
              <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{isAr ? 'التقييم الأعلى' : 'Highest Rating'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Department Pills for fast filtering */}
      <div className="mb-5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/20">
        <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
          <button
            type="button"
            onClick={() => setSelectedDept('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-[#df6828] text-white shadow-xs font-bold'
                : 'bg-white dark:bg-[#25221f] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#3a3530] hover:border-amber-500/50'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{isAr ? 'جميع الأقسام (24)' : 'All Departments (24)'}</span>
          </button>

          {allDepartments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-[#25221f] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#38332f] hover:bg-gray-50 dark:hover:bg-[#2d2824]'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid mapping the array */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#161514] p-8 text-center border border-gray-200 dark:border-[#332e2a] rounded-sm">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {isAr ? 'لم يتم العثور على منتجات مطابقة لخيارات البحث.' : 'No products found matching your search.'}
          </p>
          <button
            onClick={() => {
              setSelectedDept('all');
              setSearchFilter('');
            }}
            className="mt-3 text-xs text-[#df6828] font-bold underline cursor-pointer"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onChat={onChat}
              onOrder={onOrder}
              onPreview={onPreview}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      )}

      {/* Grid Footer Statistics */}
      <div className="mt-5 pt-3 border-t border-gray-200/80 dark:border-[#2f2b27] flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {isAr
              ? `يتم عرض ${filteredProducts.length} من أصل ${DEPARTMENT_DUMMY_PRODUCTS.length} منتجاً لـ 24 قسماً تجارياً`
              : `Showing ${filteredProducts.length} of ${DEPARTMENT_DUMMY_PRODUCTS.length} products across 24 departments`}
          </span>
        </div>
        <div className="text-[11px] text-gray-400 dark:text-gray-500">
          Atlas Ocean Platform • Multi-Vendor B2B Engine
        </div>
      </div>
    </section>
  );
};
