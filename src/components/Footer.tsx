import React from 'react';
import { AtlasLogo } from './AtlasLogo';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { Language, Category } from '../types';

interface FooterProps {
  lang: Language;
  categories: Category[];
  onSelectCategory: (id: string | null) => void;
  onOpenUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  categories,
  onSelectCategory,
  onOpenUpload,
}) => {
  const isAr = lang === 'ar';

  return (
    <footer id="platform-footer" className="bg-[#38312d] text-gray-300 pt-12 pb-8 border-t-4 border-[#df6828] select-none text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#4d4440]">
          
          {/* Col 1: Brand & Overview (2 cols on large) */}
          <div className="lg:col-span-2 space-y-4">
            <AtlasLogo />
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mt-3">
              {isAr 
                ? "منصة أطلس أوشين (Atlas Ocean Platform) هي البوابة التجارية الشاملة لربط المصانع والموردين العالميين بتجار الجملة والشركات في شتى مجالات المواد والأقسام والمنتجات." 
                : "Atlas Ocean Platform is a premier global B2B trade marketplace connecting verified manufacturers with importers, wholesalers, and buyers worldwide."}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-[#df6828]" />
                <span>info@atlasoceanplatform.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-[#df6828]" />
                <span dir="ltr">+966 50 123 4567 / +971 4 987 6543</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-[#df6828]" />
                <span>Global Sourcing & Regional Distribution Hubs</span>
              </div>
            </div>
          </div>

          {/* Col 2: Top Departments */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {isAr ? "أهم الأقسام والمواد" : "Departments"}
            </h4>
            <ul className="space-y-2 text-gray-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-[#df6828] transition-colors truncate max-w-[200px] text-left block"
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Trade & Sourcing Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {isAr ? "خدمات التجارة والتوريد" : "Trade Services"}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={onOpenUpload} className="text-[#df6828] font-bold hover:underline">
                  {isAr ? "+ رفع المنتجات والمواد" : "+ Upload New Materials"}
                </button>
              </li>
              <li><span>{isAr ? "فحص ومعاينة البضائع" : "Quality Inspection"}</span></li>
              <li><span>{isAr ? "الشحن البحري والجوي" : "Ocean & Air Logistics"}</span></li>
              <li><span>{isAr ? "حساب الضمان التجاري (Escrow)" : "Trade Assurance Escrow"}</span></li>
              <li><span>{isAr ? "التخليص الجمركي المعتمد" : "Customs Clearance"}</span></li>
            </ul>
          </div>

          {/* Col 4: Buyer Protection */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {isAr ? "حماية المشتري" : "Buyer Protection"}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isAr ? "ضمان استرجاع الأموال 90 يوماً" : "90 Day Money Back"}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? "استبدال فوري للبضائع" : "In-Store Exchange"}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-[#df6828]" />
                <span>{isAr ? "دعم تجاري 24/7" : "24/7 Trade Desk"}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-[11px] gap-3">
          <p>© {new Date().getFullYear()} ATLAS OCEAN PLATFORM. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Trade</span>
            <span>Supplier Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
