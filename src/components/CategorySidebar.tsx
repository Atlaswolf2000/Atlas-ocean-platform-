import React, { useState } from 'react';
import { ChevronRight, Plus, FolderPlus, Layers } from 'lucide-react';
import { Category, Language } from '../types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  lang: Language;
  onOpenManageCategories?: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  lang,
  onOpenManageCategories,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isAr = lang === 'ar';

  // Default display is the first 10 categories as shown in the screenshot
  const visibleCategories = expanded ? categories : categories.slice(0, 10);

  return (
    <aside 
      id="platform-category-sidebar" 
      className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm flex flex-col transition-colors"
    >
      {/* Categories Header with orange underline (Exact screenshot styling) */}
      <div className="pt-4 pb-2 px-5 border-b border-gray-100 dark:border-neutral-800">
        <h2 className="text-gray-800 dark:text-neutral-200 font-bold text-sm tracking-wider uppercase inline-block relative pb-2.5">
          {isAr ? "الأقسام والمواد" : "CATEGORIES"}
          {/* Orange accent line underneath */}
          <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#df6828]" />
        </h2>
      </div>

      {/* Category List */}
      <ul className="divide-y divide-gray-100 dark:divide-neutral-800 text-xs">
        {/* All Products Option */}
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors group ${
              selectedCategoryId === null 
                ? 'bg-orange-50/80 dark:bg-orange-950/40 text-[#df6828] font-bold' 
                : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/60 hover:text-[#df6828]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
              <div className="w-5 h-5 rounded-xs bg-[#df6828]/15 text-[#df6828] flex items-center justify-center flex-shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{isAr ? "جميع الأقسام والمنتجات" : "All Products & Materials"}</span>
            </div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ml-2 transition-colors ${
              selectedCategoryId === null ? 'border-[#df6828] bg-[#df6828] text-white' : 'border-gray-200 dark:border-neutral-700 group-hover:border-[#df6828]'
            }`}>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        </li>

        {visibleCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const displayName = isAr ? cat.nameAr : cat.nameEn;

          return (
            <li key={cat.id}>
              <button
                id={`category-item-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full px-4 py-2 flex items-center justify-between text-left transition-colors group ${
                  isSelected 
                    ? 'bg-orange-50/80 dark:bg-orange-950/40 text-[#df6828] font-bold' 
                    : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/60 hover:text-[#df6828]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={displayName} 
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-xs object-cover border border-gray-200 dark:border-neutral-700 flex-shrink-0"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-xs bg-orange-100 dark:bg-orange-950/50 text-[#df6828] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {displayName.charAt(0)}
                    </span>
                  )}
                  <span className="truncate text-xs" title={displayName}>
                    {displayName}
                  </span>
                </div>

                {/* Styled square chevron matching screenshot [>] */}
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ml-2 transition-colors ${
                  isSelected 
                    ? 'border-[#df6828] bg-[#df6828] text-white' 
                    : 'border-gray-200 dark:border-neutral-700 group-hover:border-[#df6828] text-gray-400 group-hover:text-[#df6828]'
                }`}>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer: View More & Add Category */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs">
        {categories.length > 10 && (
          <button
            id="view-more-categories-btn"
            onClick={() => setExpanded(!expanded)}
            className="text-[#df6828] hover:text-[#b8531c] font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {expanded 
                ? (isAr ? "عرض أقل" : "View Less") 
                : (isAr ? "عرض المزيد" : "View More")}
            </span>
          </button>
        )}

        {onOpenManageCategories && (
          <button
            onClick={onOpenManageCategories}
            className="text-gray-500 hover:text-gray-800 text-[11px] flex items-center gap-1 ml-auto"
            title={isAr ? "إدارة وتعديل الأقسام" : "Manage Categories"}
          >
            <FolderPlus className="w-3.5 h-3.5 text-gray-400" />
            <span>{isAr ? "تعديل" : "Manage"}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
