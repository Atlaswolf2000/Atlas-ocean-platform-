import React, { useState } from 'react';
import { X, PhoneCall, Send } from 'lucide-react';
import { Language, Product } from '../types';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  lang: Language;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  product,
  lang,
}) => {
  const isAr = lang === 'ar';
  const defaultMsg = product 
    ? (isAr 
      ? `مرحباً، أود الاستفسار عن تفاصيل وأسعار الجملة لمنتج: ${product.titleAr} (الماركة: ${product.brand}، الحد الأدنى: ${product.moq} ${product.unit}).` 
      : `Hello Atlas Ocean team, I would like to inquire about wholesale pricing and export details for: ${product.titleEn} (Brand: ${product.brand}, MOQ: ${product.moq} ${product.unit}).`)
    : (isAr
      ? `مرحباً فريق منصة أطلس أوشين (Atlas Ocean Platform)، أود الاستفسار عن المواد والمنتجات المتاحة للتوريد والجملة.`
      : `Hello Atlas Ocean Platform, I am looking to source wholesale materials and products from your platform.`);

  const [message, setMessage] = useState(defaultMsg);
  const [phoneNumber, setPhoneNumber] = useState('+966501234567'); // Default regional wholesale desk

  if (!isOpen) return null;

  const handleSend = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="whatsapp-dialog"
        className="bg-white w-full max-w-md rounded shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="bg-[#25D366] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 fill-white text-white" />
            <h3 className="font-bold text-sm sm:text-base">
              {isAr ? "محادثة مباشرة عبر واتساب" : "Direct WhatsApp Trade Desk"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-xs sm:text-sm space-y-4">
          <p className="text-gray-600">
            {isAr 
              ? "تواصل مباشرة مع مكتب المبيعات والتوريد لتحديد الكميات، الأسعار المخفضة، وتفاصيل الشحن الجمركي." 
              : "Chat directly with Atlas Ocean trade specialists for quotation, custom packaging, and freight terms."}
          </p>

          {product && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded">
              <img
                src={product.image}
                alt={product.titleEn}
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-contain bg-white rounded border border-gray-200"
              />
              <div className="truncate">
                <span className="font-bold text-gray-800 block truncate text-xs">
                  {isAr ? product.titleAr : product.titleEn}
                </span>
                <span className="text-xs text-[#df6828] font-bold">
                  ${product.price.toFixed(2)} / {product.unit}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              {isAr ? "رقم هاتف المبيعات المعتمد:" : "Verified Trade Desk WhatsApp:"}
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs bg-gray-50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              {isAr ? "نص رسالة الاستفسار:" : "Message Preview:"}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#25D366] text-xs"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>{isAr ? "فتح محادثة واتساب الآن" : "Open WhatsApp Chat Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
