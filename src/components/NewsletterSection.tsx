import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface NewsletterSectionProps {
  lang: Language;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    try {
      const existingRaw = localStorage.getItem('ao_newsletter_subscribers');
      const subscribers: string[] = existingRaw ? JSON.parse(existingRaw) : [];
      if (!subscribers.includes(email.trim().toLowerCase())) {
        subscribers.push(email.trim().toLowerCase());
        localStorage.setItem('ao_newsletter_subscribers', JSON.stringify(subscribers));
      }
    } catch (err) {
      console.warn('Newsletter storage error:', err);
    }

    setError('');
    setIsSubmitted(true);
  };

  return (
    <section 
      id="platform-newsletter-section"
      className="w-full px-4 sm:px-6 my-6 max-w-7xl mx-auto"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-[#26211e] text-white rounded-lg p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-md border border-[#3e3835]">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#df6828]/15 via-transparent to-transparent pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-radial from-[#df6828]/10 via-transparent to-transparent pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text & Marketing Copy */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#df6828]/20 text-[#f58245] text-xs font-bold mb-3 border border-[#df6828]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#f58245]" />
              <span>{isAr ? "نشرة العروض والتصدير المباشر" : "Factory-Direct Wholesale Alerts"}</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
              {isAr 
                ? "اشترك في النشرة البريدية لعروض الجملة وقوائم الأسعار"
                : "Subscribe to Exclusive Wholesale Offers & Direct Price Lists"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed">
              {isAr
                ? "انضم إلى أكثر من 8,500+ تاجر ومستورد يتلقون أسبوعياً عروض الحاويات الفورية، تنبيهات المواد الواصلة حديثاً، وتخفيضات المصانع المباشرة بدون وسيط."
                : "Join over 8,500+ commercial buyers receiving weekly alerts on newly landed containers, verified manufacturer discounts, and bulk export clearance deals."}
            </p>

            {/* Quick Benefits Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4 text-[11px] text-gray-300">
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#df6828]" />
                {isAr ? "تحديثات أسبوعية" : "Weekly updates"}
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#df6828]" />
                {isAr ? "أسعار المصانع المباشرة" : "Factory direct pricing"}
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#df6828]" />
                {isAr ? "إلغاء الاشتراك بأي وقت" : "No spam, unsubscribe anytime"}
              </span>
            </div>
          </div>

          {/* Right Input Form or Success State */}
          <div className="w-full lg:max-w-md">
            {isSubmitted ? (
              <div 
                id="newsletter-success-box"
                className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-5 text-center animate-in fade-in"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {isAr ? "تم تسجيل اشتراكك بنجاح!" : "Subscription Confirmed!"}
                </h3>
                <p className="text-xs text-gray-300">
                  {isAr
                    ? `شكراً لك! ستصلك أحدث عروض الجملة وقوائم أسعار المصانع على: ${email}`
                    : `Thank you! You'll now receive wholesale deal digests at: ${email}`}
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="mt-3 text-[11px] text-[#f58245] hover:underline"
                >
                  {isAr ? "تسجيل بريد إلكتروني آخر" : "Register another email"}
                </button>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                id="newsletter-signup-form" 
                className="space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} text-gray-400`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="newsletter-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={isAr ? "أدخل بريدك التجاري (مثال: buyer@company.com)" : "Enter business email (e.g. buyer@company.com)"}
                      className={`w-full bg-[#1b1715] border text-white rounded px-3 py-3 text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#df6828] focus:border-[#df6828] transition-colors ${
                        isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                      } ${error ? 'border-red-500' : 'border-[#4a423e]'}`}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    id="newsletter-subscribe-btn"
                    className="bg-[#df6828] hover:bg-[#b8531c] text-white font-bold text-xs px-6 py-3 rounded transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>{isAr ? "اشترك الآن" : "Subscribe"}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {error && (
                  <p className="text-[11px] text-rose-400 font-medium px-1">
                    {error}
                  </p>
                )}

                <p className="text-[10px] text-gray-400 text-center lg:text-left px-1">
                  {isAr 
                    ? "نحترم خصوصيتك بالكامل. لن يتم إرسال أي رسائل غير مرغوب فيها أو مشاركة بياناتك."
                    : "We respect your privacy. No spam ever; only verified wholesale trade opportunities."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
