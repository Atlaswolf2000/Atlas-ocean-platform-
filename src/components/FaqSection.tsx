import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Ship, CreditCard, FileCheck, MessageSquare } from 'lucide-react';
import { Language } from '../types';

interface FaqSectionProps {
  lang: Language;
  onOpenWhatsAppSupport?: () => void;
}

interface FaqItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  categoryEn: string;
  categoryAr: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang, onOpenWhatsAppSupport }) => {
  const isAr = lang === 'ar';
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      icon: Ship,
      questionEn: 'How does international shipping and container booking work on the platform?',
      questionAr: 'كيف تتم آلية الشحن الدولي وحجز الحاويات (FCL / LCL) عبر المنصة؟',
      answerEn: 'We offer full logistical support including Full Container Load (FCL 20ft/40ft/40HQ) and Less than Container Load (LCL consolidation) via ocean freight, as well as door-to-door express air cargo. Once you place an order, our freight forwarding partners arrange factory pickup, port handling, bill of lading issuance, and vessel tracking until arrival at your designated port.',
      answerAr: 'نوفر دعماً لوجستياً متكاملاً يشمل شحن الحاويات الكاملة (FCL 20ft / 40ft / 40HQ) والشحن الجزئي المجمّع (LCL) بحراً، بالإضافة إلى الشحن الجوي السريع. بعد اعتماد الطلب، يقوم وكلاؤنا اللوجستيون المعتمدون باستلام البضاعة من المصنع، وتجهيز بوليصة الشحن، ومتابعة مسار الباخرة حتى وصول الشحنة إلى الميناء المحدد.',
      categoryEn: 'Logistics & Shipping',
      categoryAr: 'الشحن واللوجستيات',
    },
    {
      id: 'faq-2',
      icon: ShieldCheck,
      questionEn: 'What guarantees does the platform provide for goods quality and factory verification?',
      questionAr: 'ما هي ضمانات المنصة لجودة البضائع وموثوقية المصانع والموردين؟',
      answerEn: 'Every registered supplier undergoes mandatory commercial registration, export license, and factory audit checks. Before shipment dispatch, our on-site inspection teams (or certified partners like SGS and TÜV) perform comprehensive quality control (QC), verifying dimensions, materials, packaging, and quantity according to your exact purchase specifications.',
      answerAr: 'تخضع جميع المصانع والموردين في المنصة لتدقيق ميداني وفحص التراخيص التجارية وسجلات التصدير المعتمدة. كما توفر المنصة خدمة الفحص الميداني قبل الشحن (QC) عبر فرق تفتيش متخصصة أو شركاء دوليين مثل SGS، للتأكد التام من مطابقة المواد، الكميات، والمواصفات المتفق عليها في عقد التوريد.',
      categoryEn: 'Trade Assurance',
      categoryAr: 'ضمان الجودة والتوريد',
    },
    {
      id: 'faq-3',
      icon: CreditCard,
      questionEn: 'What payment methods are supported, and how does Trade Assurance protect my funds?',
      questionAr: 'ما هي طرق الدفع المعتمدة، وكيف يحمي نظام ضمان التجارة أموالي؟',
      answerEn: 'We support secure B2B transactions via Irrevocable Letters of Credit (L/C), Wire Transfers (T/T), and Platform Escrow. Your payment is held securely in escrow and is only released to the manufacturer after you receive the pre-shipment inspection report and approve the shipping documentation (Bill of Lading / Packing List).',
      answerAr: 'ندعم الدفع الآمن للمعاملات التجارية الكبرى عبر الاعتمادات المستندية البنكية غير القابلة للإلغاء (L/C)، التحويلات البنكية المباشرة (T/T)، وحسابات الضمان التجاري (Escrow). لا يتم تحويل الدفعة النهائية للمصنع إلا بعد إصدار تقرير فحص الجودة وموافقتك الرسمية على وثائق الشحن وبوليصة الاستلام.',
      categoryEn: 'Payments & Escrow',
      categoryAr: 'المدفوعات والضمان المالي',
    },
    {
      id: 'faq-4',
      icon: FileCheck,
      questionEn: 'Do you provide customs clearance assistance and certificates of conformity (Saber, SASO, CE)?',
      questionAr: 'هل توفر المنصة المساعدة في التخليص الجمركي وإصدار شهادات المطابقة (سابر / SASO / CE)؟',
      answerEn: 'Yes. For every export shipment, our customs documentation specialists issue authentic Certificates of Origin, commercial invoices, legalized packing lists, and laboratory conformity certificates required by regional customs authorities, including Saber / SASO conformity for Saudi Arabia, CE markings for European standards, and GCC standardization requirements.',
      answerAr: 'نعم بالتأكيد. يقدم فريق التخليص الجمركي كافة الوثائق الرسمية المطلوبة: شهادات المنشأ الأصلية، الفواتير التجارية المصدقة، قوائم التعبئة، وتسهيل إصدار شهادات المطابقة الإلزامية مثل منصة "سابر" وهيئة المواصفات السعودية (SASO) وشارة المطابقة الخليجية (GCC) والمواصفات الأوروبية (CE).',
      categoryEn: 'Customs & Compliance',
      categoryAr: 'الجمارك والمطابقة',
    },
    {
      id: 'faq-5',
      icon: HelpCircle,
      questionEn: 'Can I request pre-production samples and negotiate Minimum Order Quantities (MOQ)?',
      questionAr: 'هل يمكنني طلب عينات فحص قبل الإنتاج والتفاوض على الحد الأدنى للطلب (MOQ)؟',
      answerEn: 'Absolutely. Buyers can request express sample dispatch via DHL/FedEx prior to bulk orders. Additionally, while each listing indicates a baseline MOQ, our trade coordinators can directly negotiate smaller trial quantities or consolidate items across multiple factories into a single shipping container.',
      answerAr: 'نعم بكل تأكيد. يمكنك طلب عينات تجارية تُرسل مباشرة عبر الشحن السريع (DHL/FedEx) لمعاينتها والتأكد من مطابقتها قبل اعتماد الإنتاج التجاري. كما يمكن لفريق الوساطة التجارية لدينا التفاوض مع المصانع لتخفيض الحد الأدنى للطلب (MOQ) للطلبات التجريبية الأولى أو دمج منتجات متعددة في حاوية واحدة.',
      categoryEn: 'Samples & Ordering',
      categoryAr: 'العينات وتخصيص الطلبات',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section 
      id="platform-faq-section"
      className="w-full bg-white border-t border-b border-gray-200 py-10 px-4 sm:px-6 my-6"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#df6828] text-xs font-bold mb-2.5 border border-orange-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? "دليل التجارة والاستيراد" : "B2B Trade & Import Guide"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {isAr ? "الأسئلة الشائعة حول الشحن والضمانات" : "Frequently Asked Questions"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
            {isAr 
              ? "إجابات شاملة وموثقة حول آلية الشحن الدولي، فحص الجودة بالمصانع، وطرق الدفع والاعتمادات المستندية الآمنة."
              : "Everything you need to know about international freight, factory inspection, escrow payments, and customs documentation."}
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;
            const question = isAr ? faq.questionAr : faq.questionEn;
            const answer = isAr ? faq.answerAr : faq.answerEn;
            const category = isAr ? faq.categoryAr : faq.categoryEn;

            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`border rounded transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'border-[#df6828] bg-orange-50/20 shadow-xs' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 px-4 sm:px-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-[#df6828] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#df6828] tracking-wider uppercase block mb-0.5">
                        {category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        {question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                    isOpen 
                      ? 'border-[#df6828] bg-[#df6828] text-white rotate-180' 
                      : 'border-gray-300 bg-gray-50 text-gray-500'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-orange-100/60 animate-in fade-in duration-150">
                    <p className="max-w-4xl">{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Footer Bar */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-gray-700">
            <MessageSquare className="w-4 h-4 text-[#df6828]" />
            <span className="font-medium">
              {isAr ? "هل لديك استفسار تجاري خاص أو ترغب بعقد صفقة مخصصة؟" : "Have specific import requirements or custom cargo inquiries?"}
            </span>
          </div>

          <a
            href="https://wa.me/8615967999818?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20wholesale%20import%20and%20shipping"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#df6828] hover:bg-[#b8531c] text-white font-bold px-4 py-2 rounded transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shadow-2xs"
          >
            <span>{isAr ? "تحدث مع مستشار التصدير عبر واتساب" : "Chat with Trade Specialist"}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
