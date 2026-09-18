import React, { useState } from 'react';
import {
  X,
  Store,
  User,
  Phone,
  Mail,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VendorApplication, Language } from '../types';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => void;
  userVendor?: VendorApplication | null;
  onOpenStoreManager?: () => void;
  lang: Language;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userVendor,
  onOpenStoreManager,
  lang
}) => {
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    email: '',
    businessType: 'تجارة جملة عامة',
    description: '',
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.storeName.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة اسم المتجر' : 'Please enter the store name');
      return;
    }
    if (!formData.ownerName.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة اسم المالك' : 'Please enter the owner name');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال نبذة مختصرة عن نشاط المتجر' : 'Please enter a brief description');
      return;
    }

    onSubmit({
      storeName: formData.storeName.trim(),
      ownerName: formData.ownerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      businessType: formData.businessType,
      description: formData.description.trim(),
    });

    setSubmittedSuccess(true);
  };

  const resetForm = () => {
    setFormData({
      storeName: '',
      ownerName: '',
      phone: '',
      email: '',
      businessType: 'تجارة جملة عامة',
      description: '',
    });
    setSubmittedSuccess(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-[#1f1b19] border border-amber-500/30 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden my-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2c231f] via-[#3d2f28] to-[#251e1a] px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isAr ? 'طلب إنشاء متجر تاجر جديد' : 'Vendor Store Application'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                  Multi-Vendor
                </span>
              </h3>
              <p className="text-xs text-amber-200/70">
                {isAr
                  ? 'انضم كتاجر معتمد في منصة أطلس المحيط واعرض منتجاتك للمستوردين'
                  : 'Join as a verified vendor on Atlas Ocean platform'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Application Status View (if user already submitted and not in new submit mode) */}
        {!submittedSuccess && userVendor && (
          <div className="p-6 bg-slate-900/50 border-b border-slate-800">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/80 border border-slate-700">
              {userVendor.status === 'pending' && (
                <>
                  <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-sm">
                        {isAr ? 'طلبك الحالي قيد المراجعة' : 'Your request is Pending Review'}
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                        {isAr ? 'قيد المراجعة' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      {isAr
                        ? `طلب متجر "${userVendor.storeName}" مسجل وهو قيد التدقيق حالياً من قِبل إدارة منصة أطلس المحيط.`
                        : `Store "${userVendor.storeName}" is currently pending review by Atlas Ocean admins.`}
                    </p>
                  </div>
                </>
              )}

              {userVendor.status === 'approved' && (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-sm">
                        {isAr ? 'متجرك معتمد ونشط!' : 'Your Store is Approved & Active!'}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                        {isAr ? 'معتمد' : 'Approved'}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1">
                      {isAr
                        ? `متجرك "${userVendor.storeName}" مفعّل ولديك صلاحية كاملة لإضافة المنتجات وإدارة المتجر.`
                        : `Your store "${userVendor.storeName}" is active. You can now add products and manage your profile.`}
                    </p>
                    {onOpenStoreManager && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenStoreManager();
                        }}
                        className="mt-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Store className="w-4 h-4" />
                        <span>{isAr ? 'فتح لوحة إدارة متجري' : 'Open Store Manager'}</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {userVendor.status === 'rejected' && (
                <>
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 text-sm">
                        {isAr ? 'تم رفض الطلب السابق' : 'Previous Request Rejected'}
                      </span>
                      <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">
                        {isAr ? 'مرفوض' : 'Rejected'}
                      </span>
                    </div>
                    {userVendor.rejectionReason && (
                      <p className="text-rose-200/90 mt-1">
                        {isAr ? `سبب الرفض: ${userVendor.rejectionReason}` : `Reason: ${userVendor.rejectionReason}`}
                      </p>
                    )}
                    <p className="text-slate-400 mt-1">
                      {isAr ? 'يمكنك تقديم طلب جديد بالبيانات المصححة أدناه.' : 'You can submit a new application below.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Success State */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">
                {isAr ? 'تم إرسال طلبك بنجاح وهو قيد المراجعة من قبل الإدارة' : 'Your request has been submitted successfully and is under review'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                {isAr
                  ? 'شكراً لاهتمامك بالانضمام إلى شبكة تجار أطلس المحيط. سيقوم فريق الإدارة بتدقيق بيانات متجرك والموافقة عليه خلال 24 ساعة. ستتمكن من البدء بإضافة المنتجات بمجرد اعتماد الحساب.'
                  : 'Thank you for applying. The Atlas administration team will review your application within 24 hours.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 max-w-md mx-auto text-right text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isAr ? 'اسم المتجر:' : 'Store Name:'}</span>
                <span className="font-bold text-amber-400">{formData.storeName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isAr ? 'المالك:' : 'Owner:'}</span>
                <span className="font-medium text-white">{formData.ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isAr ? 'الهاتف:' : 'Phone:'}</span>
                <span className="font-mono text-slate-200" dir="ltr">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'الحالة الحالية:' : 'Current Status:'}</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {isAr ? 'قيد المراجعة (Pending)' : 'Pending Review'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs transition-colors shadow-md"
              >
                {isAr ? 'تم، حسناً' : 'Done, Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'اسم المتجر التجاري' : 'Store Name'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder={isAr ? 'مثال: شركة النخبة للتوريدات العامة' : 'e.g. Al-Nukhba Supplies Co.'}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'اسم المالك أو المفوض' : 'Owner Name'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder={isAr ? 'الاسم الثلاثي للمسؤول' : 'Full name'}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0781XXXXXXX / +964..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="store@example.com"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'نوع النشاط التجاري' : 'Business Activity Type'} <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 text-xs text-white focus:outline-hidden focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="تجارة جملة عامة">{isAr ? 'تجارة جملة عامة وتوزيع' : 'General Wholesale & Distribution'}</option>
                  <option value="شحن وقطع غيار ومعدات">{isAr ? 'شحن ومعدات وقطع غيار' : 'Shipping, Equipment & Auto Parts'}</option>
                  <option value="إلكترونيات وأجهزة منزلية">{isAr ? 'إلكترونيات وأجهزة كهربائية' : 'Electronics & Appliances'}</option>
                  <option value="ملابس ومصنوعات جلدية">{isAr ? 'أزياء وحقائب ومصنوعات جلدية' : 'Fashion, Bags & Leather'}</option>
                  <option value="أدوات بناء ومواد صناعية">{isAr ? 'مواد بناء ومستلزمات صناعية' : 'Building Materials & Industrial'}</option>
                  <option value="استيراد وتصدير وخدمات">{isAr ? 'مكتب استيراد وتصدير وتخليص' : 'Import / Export & Clearance'}</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'نبذة مختصرة عن المتجر والمنتجات' : 'Brief Store Description'} <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={isAr ? 'اشرح بإيجاز نوع البضائع التي توردها، مقر نشاطك، وخبرتك في السوق...' : 'Describe the types of goods you supply and your background...'}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Note about review policy */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2.5 text-[11px] text-amber-200/90">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400 block mb-0.5">
                  {isAr ? 'نظام الموافقة وضمان الجودة (Admin Approval Workflow):' : 'Quality Assurance & Admin Review:'}
                </span>
                {isAr
                  ? 'يتم فحص جميع طلبات المتاجر لضمان مطابقتها لمعايير التجارة الموثوقة لمنصة أطلس. ستصلك صلاحية إضافة المواد وفتح صفحة المتجر فور الاعتماد.'
                  : 'All vendor requests are verified by Atlas admins before granting publishing access.'}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>{isAr ? 'إرسال طلب إنشاء المتجر' : 'Submit Application'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
