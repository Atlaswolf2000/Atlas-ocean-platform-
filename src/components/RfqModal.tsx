import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Send, 
  CheckCircle2, 
  Anchor, 
  Building, 
  Package, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  User, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Product, Language, CurrencyCode, RFQSubmission } from '../types';
import { formatPrice } from '../utils/currency';

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  lang: Language;
  currency?: CurrencyCode;
}

const COMMON_PORTS = [
  { id: 'jeddah', ar: 'ميناء جدة الإسلامي - السعودية (Jeddah Islamic Port)', en: 'Jeddah Islamic Port, Saudi Arabia' },
  { id: 'dammam', ar: 'ميناء الملك عبد العزيز - الدمام (King Abdulaziz Port Dammam)', en: 'King Abdulaziz Port, Dammam' },
  { id: 'jebel_ali', ar: 'ميناء جبل علي - دبي (Jebel Ali Port, UAE)', en: 'Jebel Ali Port, Dubai UAE' },
  { id: 'khalifa', ar: 'ميناء خليفة - أبوظبي (Khalifa Port, Abu Dhabi)', en: 'Khalifa Port, Abu Dhabi' },
  { id: 'hamad', ar: 'ميناء حمد - قطر (Hamad Port, Qatar)', en: 'Hamad Port, Qatar' },
  { id: 'sokhna', ar: 'ميناء العين السخنة - مصر (Sokhna Port, Egypt)', en: 'Sokhna Port, Egypt' },
  { id: 'aqaba', ar: 'ميناء العقبة - الأردن (Aqaba Port, Jordan)', en: 'Aqaba Port, Jordan' },
  { id: 'other', ar: 'ميناء آخر (تحديد مخصص)...', en: 'Other Custom Port...' },
];

export const RfqModal: React.FC<RfqModalProps> = ({
  isOpen,
  onClose,
  product,
  lang,
  currency = 'USD',
}) => {
  const isAr = lang === 'ar';

  const [quantity, setQuantity] = useState<number>(Math.max(product.moq * 2, 50));
  const [selectedPort, setSelectedPort] = useState<string>(COMMON_PORTS[0].id);
  const [customPort, setCustomPort] = useState<string>('');
  const [incoterm, setIncoterm] = useState<'CIF' | 'FOB' | 'CNF' | 'EXW'>('CIF');
  const [customerName, setCustomerName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState<RFQSubmission | null>(null);

  if (!isOpen) return null;

  const displayTitle = isAr ? product.titleAr : product.titleEn;
  const destinationPortText = selectedPort === 'other' && customPort.trim()
    ? customPort.trim()
    : COMMON_PORTS.find(p => p.id === selectedPort)?.[isAr ? 'ar' : 'en'] || selectedPort;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newRfq: RFQSubmission = {
      id: `RFQ-${Date.now().toString().slice(-6)}`,
      productId: product.id,
      productTitle: displayTitle,
      targetQuantity: quantity,
      destinationPort: destinationPortText,
      customerName,
      customerEmail,
      customerPhone,
      companyName: companyName.trim() || undefined,
      incoterm,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    // Save to local storage
    try {
      const existing = localStorage.getItem('ao_rfq_requests');
      const list: RFQSubmission[] = existing ? JSON.parse(existing) : [];
      list.unshift(newRfq);
      localStorage.setItem('ao_rfq_requests', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save RFQ', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRfq(newRfq);
    }, 400);
  };

  const handleSendWhatsAppDirect = () => {
    const text = isAr
      ? `السلام عليكم، أود طلب تسعيرة مخصصة للكميات الضخمة (RFQ):\n` +
        `• المنتج: ${displayTitle}\n` +
        `• الكمية المستهدفة: ${quantity} ${product.unit}\n` +
        `• ميناء الوصول: ${destinationPortText}\n` +
        `• شرط الشحن (Incoterm): ${incoterm}\n` +
        `• الاسم/الشركة: ${customerName} ${companyName ? `(${companyName})` : ''}\n` +
        `• ملاحظات ومواصفات خاصة: ${notes || 'يرجى تزويدنا بأفضل سعر وتفاصيل التوريد'}`
      : `Hello Atlas Ocean team, I want to request a custom bulk quote (RFQ):\n` +
        `• Product: ${displayTitle}\n` +
        `• Target Quantity: ${quantity} ${product.unit}\n` +
        `• Destination Port: ${destinationPortText}\n` +
        `• Incoterm: ${incoterm}\n` +
        `• Name/Company: ${customerName} ${companyName ? `(${companyName})` : ''}\n` +
        `• Notes: ${notes || 'Please provide best wholesale CIF/FOB pricing.'}`;

    const url = `https://wa.me/966500000000?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        id="rfq-modal-dialog"
        className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden text-gray-800 dark:text-neutral-100 my-6 animate-in fade-in zoom-in-95 duration-200"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="bg-[#4d4440] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#3b3430]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#df6828] flex items-center justify-center text-white shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>{isAr ? "طلب تسعيرة للكميات الضخمة (Request a Quote - RFQ)" : "Request Bulk Custom Quote (RFQ)"}</span>
              </h2>
              <p className="text-[11px] text-gray-300">
                {isAr ? "احصل على عروض أسعار تنافسية مباشرة من المصانع والموردين مع الشحن والتخليص" : "Direct manufacturer bulk quote with global freight & customs support"}
              </p>
            </div>
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
        {submittedRfq ? (
          /* Confirmation State */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 mb-2">
                {submittedRfq.id}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
                {isAr ? "تم استلام طلب التسعيرة بنجاح!" : "RFQ Received Successfully!"}
              </h3>
              <p className="text-xs text-gray-600 dark:text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
                {isAr 
                  ? "سيقوم فريق التجارة الدولية والمشتريات في Atlas Ocean بدراسة الكمية وميناء الوصول وإرسال عرض السعر المخصص لك خلال 24 ساعة عمل."
                  : "Our global trade specialists will analyze your target volume and destination port, then send a tailored quotation within 24 business hours."
                }
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gray-50 dark:bg-neutral-800/60 p-4 rounded border border-gray-200 dark:border-neutral-700 text-xs text-start max-w-lg mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? "المنتج:" : "Product:"}</span>
                <span className="font-bold text-gray-800 dark:text-neutral-200 truncate max-w-[260px]">{displayTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? "الكمية المطلوبة:" : "Quantity:"}</span>
                <span className="font-bold text-[#df6828]">{submittedRfq.targetQuantity.toLocaleString()} {product.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? "ميناء الوصول:" : "Port of Destination:"}</span>
                <span className="font-semibold text-gray-700 dark:text-neutral-300">{submittedRfq.destinationPort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? "جهة الاتصال:" : "Contact:"}</span>
                <span className="font-semibold text-gray-700 dark:text-neutral-300">{submittedRfq.customerName} ({submittedRfq.customerPhone})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendWhatsAppDirect}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isAr ? "متابعة الطلب فوراً عبر واتساب" : "Track / Expedite via WhatsApp"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-[#4d4440] hover:bg-[#38312d] text-white px-6 py-2.5 rounded font-bold text-xs transition-colors"
              >
                {isAr ? "تم، العودة للمنتج" : "Done, Back to Product"}
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Selected Product Snapshot */}
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800/70 p-3 rounded border border-gray-200 dark:border-neutral-700">
              <img
                src={product.image}
                alt={displayTitle}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain bg-white rounded border border-gray-200 dark:border-neutral-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#df6828] uppercase">{product.brand || 'Atlas Ocean'}</span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-neutral-100 truncate">{displayTitle}</h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
                  <span>{isAr ? "السعر الاسترشادي:" : "Ref Price:"} <strong className="text-gray-900 dark:text-neutral-200">{formatPrice(product.price, currency, lang)}</strong></span>
                  <span>•</span>
                  <span>{isAr ? `أدنى كمية (MOQ): ${product.moq} ${product.unit}` : `MOQ: ${product.moq} ${product.unit}`}</span>
                </div>
              </div>
            </div>

            {/* Core B2B Inputs: Target Quantity & Incoterm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Target Quantity (الكمية المستهدفة) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#df6828]" />
                  <span>{isAr ? "الكمية المستهدفة المطلوبة *" : "Target Quantity Required *"}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={product.moq}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  />
                  <span className="absolute end-3 top-2 text-xs font-medium text-gray-400">
                    {product.unit || (isAr ? 'قطعة' : 'Piece')}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {isAr ? `الحد الأدنى للطلب هو ${product.moq} ${product.unit}` : `Min. MOQ is ${product.moq} ${product.unit}`}
                </span>
              </div>

              {/* Incoterm / Shipping Term */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isAr ? "شرط الشحن التجاري (Incoterm)" : "Shipping Term (Incoterm)"}</span>
                </label>
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                >
                  <option value="CIF">CIF - Cost, Insurance & Freight (شامل الشحن والتأمين حتى الميناء)</option>
                  <option value="FOB">FOB - Free on Board (تسليم ظهر السفينة بميناء الشحن)</option>
                  <option value="CNF">CNF / CFR - Cost & Freight (شامل تكلفة الشحن)</option>
                  <option value="EXW">EXW - Ex Works (استلام من باب المصنع)</option>
                </select>
              </div>
            </div>

            {/* Destination Port (ميناء الوصول) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-[#df6828]" />
                <span>{isAr ? "ميناء الوصول المستهدف (Destination Port) *" : "Destination Port *"}</span>
              </label>
              <select
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828] mb-2"
              >
                {COMMON_PORTS.map((port) => (
                  <option key={port.id} value={port.id}>
                    {isAr ? port.ar : port.en}
                  </option>
                ))}
              </select>

              {selectedPort === 'other' && (
                <input
                  type="text"
                  required
                  value={customPort}
                  onChange={(e) => setCustomPort(e.target.value)}
                  placeholder={isAr ? "أدخل اسم ميناء الوصول والبلد المستهدف..." : "Enter port name and country..."}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              )}
            </div>

            {/* Client Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isAr ? "اسم المسؤول / المشتري *" : "Contact Name *"}</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? "مثال: م. عبد الله الشمري" : "e.g. John Doe"}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isAr ? "اسم الشركة / المؤسسة (اختياري)" : "Company / Enterprise (optional)"}</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isAr ? "شركة أطلس للمقاولات والتجارة" : "Acme Global Trading LLC"}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isAr ? "رقم الهاتف / الواتساب *" : "Phone / WhatsApp *"}</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+966 5X XXX XXXX"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isAr ? "البريد الإلكتروني المهني *" : "Business Email *"}</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Custom Notes & Specs */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#df6828]" />
                <span>{isAr ? "ملاحظات ومواصفات خاصة (Custom Specifications & Notes)" : "Custom Specifications & Notes"}</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isAr 
                    ? "أدخل تفاصيل التعبئة المطلوبة (مثال: براميل، بالتات، حاويات 40 قدم)، شروط الفحص والتفتيش (SGS / BV)، أو موعد الشحن المفضل..." 
                    : "Specify packaging requirements, container sizes, testing certificates (SASO, CE), delivery schedules..."
                }
                className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
              />
            </div>

            {/* Bottom Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                {isAr 
                  ? "تسعيرات الجملة المخصصة تشمل حسومات تصاعدية على الكميات الكبيرة، وتعتمد على أسعار شحن الحاويات الفورية في تاريخ الطلب." 
                  : "Bulk quotation includes tiered manufacturer volume discounts and is calibrated based on real-time freight rates."}
              </span>
            </div>

            {/* Form Footer Buttons */}
            <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#df6828] hover:bg-[#c65a1f] text-white px-6 py-2.5 rounded font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (isAr ? "جارٍ الإرسال..." : "Sending...") : (isAr ? "إرسال طلب التسعيرة (Submit RFQ)" : "Submit RFQ Quote")}</span>
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
