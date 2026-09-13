import React from 'react';
import { Truck, Calendar, Umbrella, DollarSign } from 'lucide-react';
import { Language } from '../types';

interface TrustBadgesProps {
  lang: Language;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const badges = [
    {
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center text-gray-500">
          {/* Money Bag representation */}
          <div className="w-7 h-7 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      ),
      titleEn: '90 DAY MONEY BACK',
      titleAr: 'استرجاع الأموال خلال 90 يوماً',
      descEn: 'Full trade refund protection',
      descAr: 'حماية كاملة للمدفوعات التجارية',
    },
    {
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-gray-500">
          <Truck className="w-7 h-7 stroke-[1.8]" />
        </div>
      ),
      titleEn: 'IN-STORE EXCHANGE',
      titleAr: 'استبدال مباشر ومعاينة',
      descEn: 'Hassle-free material exchange',
      descAr: 'فحص واستبدال فوري للبضائع',
    },
    {
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-gray-500">
          <Calendar className="w-7 h-7 stroke-[1.8]" />
        </div>
      ),
      titleEn: 'LOWEST PRICE GUARANTEE',
      titleAr: 'ضمان أقل سعر مصنع',
      descEn: 'Direct factory pricing match',
      descAr: 'أسعار توريد مباشرة من المصنع',
    },
    {
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-gray-500">
          <Umbrella className="w-7 h-7 stroke-[1.8]" />
        </div>
      ),
      titleEn: 'SHOPPING GUARANTEE',
      titleAr: 'ضمان التجارة وحماية الشحن',
      descEn: 'Safe escrow and sea cargo insurance',
      descAr: 'تأمين شحن بحري وحساب ضمان تجاري',
    },
  ];

  return (
    <div 
      id="platform-trust-badges-bar"
      className="w-full bg-white border border-gray-200/90 shadow-sm py-5 px-6 my-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-gray-200">
        {badges.map((badge, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-3.5 pt-4 md:pt-0 ${
              idx === 0 ? '' : 'md:pl-6'
            }`}
          >
            <div className="flex-shrink-0 text-gray-600">
              {badge.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800 tracking-wider uppercase leading-tight">
                {isAr ? badge.titleAr : badge.titleEn}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isAr ? badge.descAr : badge.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
