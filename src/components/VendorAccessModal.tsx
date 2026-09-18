import React from 'react';
import {
  X,
  Store,
  Clock,
  AlertCircle,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { VendorApplication, Language } from '../types';

interface VendorAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: VendorApplication | null;
  onOpenCreateStore: () => void;
  onOpenAdmin?: () => void;
  onContinueAsMasterStore?: () => void;
  lang: Language;
}

export const VendorAccessModal: React.FC<VendorAccessModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onOpenCreateStore,
  onOpenAdmin,
  onContinueAsMasterStore,
  lang
}) => {
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const isPending = vendor?.status === 'pending';
  const isRejected = vendor?.status === 'rejected';
  const hasNoStore = !vendor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div
        className="bg-[#1e1a18] border border-amber-500/30 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2c231f] to-[#241d1a] px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'صلاحيات الدخول إلى نظام المتجر' : 'Store Management Access Control'}
              </h3>
              <p className="text-[11px] text-amber-200/70">
                {isAr ? 'بوابة التجار المعتمدين | Atlas Multi-Vendor' : 'Verified Vendor Access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content depending on status */}
        <div className="p-6 text-center space-y-4">
          {hasNoStore && (
            <>
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isAr ? 'ليس لديك متجر تاجر مسجل بعد' : "You Don't Have a Vendor Store Yet"}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  {isAr
                    ? 'للوصول إلى لوحة إدارة المتجر، وإضافة منتجاتك وتعديل بيانات بروفايل المتجر، يجب أولاً تقديم طلب إنشاء متجر ليتم اعتماده من إدارة أطلس المحيط.'
                    : 'To access the Store Manager and publish products, you need to apply for a vendor store and receive admin approval.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateStore();
                  }}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAr ? 'قدم طلب إنشاء متجر الآن' : 'Apply to Create Store'}</span>
                </button>
                {onContinueAsMasterStore && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContinueAsMasterStore();
                    }}
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'الدخول كمتجر رئيسي (أطلس المحيط)' : 'Open Master Store (Demo)'}</span>
                  </button>
                )}
              </div>
            </>
          )}

          {isPending && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-400">
                  {isAr ? 'عذراً، حسابك كتاجر قيد المراجعة حالياً' : 'Your Vendor Account is Under Review'}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  {isAr
                    ? `طلب متجرك "${vendor.storeName}" تم استلامه وهو قيد المراجعة والتدقيق من قبل الإدارة. لا يمكنك إضافة المنتجات حتى تتم الموافقة على متجرك.`
                    : `Your store application for "${vendor.storeName}" is currently pending administrator approval.`}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 text-right space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'اسم المتجر:' : 'Store:'}</span>
                  <span className="font-bold text-white">{vendor.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'المالك:' : 'Owner:'}</span>
                  <span className="text-slate-200">{vendor.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'تاريخ التقديم:' : 'Applied Date:'}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{vendor.createdAt}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'فتح لوحة الإدارة للموافقة' : 'Admin Approval Panel'}</span>
                  </button>
                )}
                {onContinueAsMasterStore && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContinueAsMasterStore();
                    }}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{isAr ? 'تصفح كمتجر أطلس المحيط' : 'Open Atlas Ocean Store'}</span>
                  </button>
                )}
              </div>
            </>
          )}

          {isRejected && (
            <>
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-rose-400">
                  {isAr ? 'تم رفض طلب تسجيل المتجر' : 'Store Application Rejected'}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  {vendor.rejectionReason
                    ? (isAr ? `سبب الرفض: ${vendor.rejectionReason}` : `Reason: ${vendor.rejectionReason}`)
                    : (isAr ? 'لم يستوفِ الطلب الشروط المطلوبة لشبكة تجار أطلس المحيط.' : 'Application did not meet criteria.')}
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateStore();
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAr ? 'تقديم طلب جديد ببيانات محدثة' : 'Submit New Application'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
