import React from 'react';
import { DollarSign, SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Language } from '../types';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest' | 'moq-asc';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
  onReset: () => void;
  lang: Language;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  currentMin,
  currentMax,
  onChange,
  onReset,
  lang,
  sortBy = 'default',
  onSortChange,
}) => {
  const isAr = lang === 'ar';

  const isFiltered = currentMin > minPrice || currentMax < maxPrice;

  // Preset quick chips
  const presets = [
    { label: isAr ? 'الكل' : 'All', min: minPrice, max: maxPrice },
    { label: '< $100', min: minPrice, max: 100 },
    { label: '$100 - $500', min: 100, max: 500 },
    { label: '$500 - $1,500', min: 500, max: 1500 },
    { label: '> $1,500', min: 1500, max: maxPrice },
  ];

  return (
    <div 
      id="platform-price-filter"
      className="bg-white border border-gray-200 rounded p-3 text-xs shadow-2xs mb-4"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-50 text-[#df6828] flex items-center justify-center border border-orange-100 flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-gray-800 block text-xs">
              {isAr ? "تصفية المنتجات والفرز السريع" : "Product Filters & Quick Sort"}
            </span>
            <span className="text-[10px] text-gray-400">
              {isAr ? `نطاق السعر: $${currentMin} - $${currentMax}` : `Price Range: $${currentMin} - $${currentMax}`}
            </span>
          </div>
        </div>

        {/* Filter Controls: Min/Max Price + Quick Sort Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Price Range Inputs */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-2 py-1">
            <span className="text-[11px] text-gray-500 font-medium">
              {isAr ? "السعر:" : "Price:"}
            </span>
            <div className="flex items-center bg-white border border-gray-200 rounded px-1.5 py-0.5 focus-within:ring-1 focus-within:ring-[#df6828] focus-within:border-[#df6828]">
              <span className="text-gray-400 mr-1 text-[10px]">$</span>
              <input
                type="number"
                min={minPrice}
                max={currentMax}
                value={currentMin}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange(val, Math.max(val, currentMax));
                }}
                className="w-14 bg-transparent text-xs font-semibold outline-none text-gray-800"
                placeholder="Min"
                dir="ltr"
              />
            </div>

            <span className="text-gray-400">-</span>

            <div className="flex items-center bg-white border border-gray-200 rounded px-1.5 py-0.5 focus-within:ring-1 focus-within:ring-[#df6828] focus-within:border-[#df6828]">
              <span className="text-gray-400 mr-1 text-[10px]">$</span>
              <input
                type="number"
                min={currentMin}
                max={maxPrice}
                value={currentMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange(Math.min(val, currentMin), val);
                }}
                className="w-14 bg-transparent text-xs font-semibold outline-none text-gray-800"
                placeholder="Max"
                dir="ltr"
              />
            </div>

            {isFiltered && (
              <button
                onClick={onReset}
                className="text-gray-500 hover:text-[#df6828] p-1 text-[11px] flex items-center gap-0.5 transition-colors bg-white rounded border border-gray-200 hover:border-[#df6828]"
                title={isAr ? "إعادة تعيين السعر" : "Reset price filter"}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? "إعادة" : "Reset"}</span>
              </button>
            )}
          </div>

          {/* Quick Sort Dropdown (الفرز السريع للمنتجات) */}
          {onSortChange && (
            <div className="flex items-center gap-1.5 bg-orange-50/50 border border-orange-200/80 rounded px-2.5 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#df6828] flex-shrink-0" />
              <label htmlFor="quick-sort-select" className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                {isAr ? "الفرز السريع:" : "Sort:"}
              </label>
              <select
                id="quick-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-white border border-gray-200 text-gray-800 rounded px-2 py-0.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#df6828] cursor-pointer"
              >
                <option value="default">{isAr ? "الافتراضي (الأكثر تطابقاً)" : "Featured / Default"}</option>
                <option value="price-asc">{isAr ? "الأقل سعراً ↑" : "Price: Low to High"}</option>
                <option value="price-desc">{isAr ? "الأعلى سعراً ↓" : "Price: High to Low"}</option>
                <option value="newest">{isAr ? "الأحدث وصولاً" : "Newest Arrivals"}</option>
                <option value="moq-asc">{isAr ? "الأقل في الحد الأدنى للطلب (MOQ)" : "Lowest Minimum Order (MOQ)"}</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Quick Price Range Chips */}
      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-100 overflow-x-auto pb-0.5">
        <span className="text-[10px] text-gray-400 flex-shrink-0">
          {isAr ? "نطاقات سريعة:" : "Presets:"}
        </span>
        {presets.map((preset, idx) => {
          const isActive = currentMin === preset.min && currentMax === preset.max;
          return (
            <button
              key={idx}
              onClick={() => onChange(preset.min, preset.max)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#df6828] text-white border-[#df6828] font-bold shadow-2xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-[#df6828]'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
