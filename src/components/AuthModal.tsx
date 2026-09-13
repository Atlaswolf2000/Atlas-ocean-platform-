import React, { useState } from 'react';
import { X, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  lang,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="auth-modal-dialog"
        className="bg-white w-full max-w-md rounded shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="bg-[#4d4440] text-white px-5 py-4 flex items-center justify-between border-b border-[#3b3430]">
          <div className="flex items-center gap-2">
            {mode === 'login' ? <LogIn className="w-5 h-5 text-[#df6828]" /> : <UserPlus className="w-5 h-5 text-[#df6828]" />}
            <h3 className="font-bold text-sm sm:text-base">
              {mode === 'login' 
                ? (isAr ? "تسجيل دخول إلى المنصة" : "Sign In to Atlas Ocean") 
                : (isAr ? "تسجيل حساب تاجر / مشتري جديد" : "Create Trade Account")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs sm:text-sm">
          {isSuccess ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="font-bold text-gray-800 text-sm">
                {mode === 'login' ? (isAr ? "تم تسجيل الدخول بنجاح!" : "Welcome back!") : (isAr ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {isAr ? "اسم الشركة / التاجر" : "Company or Trader Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={isAr ? "مثال: مؤسسة الأطلس للاستيراد والتصدير" : "e.g. Atlas Import & Export Co."}
                    className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "البريد الإلكتروني" : "Business Email"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@atlasoceanplatform.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "كلمة المرور" : "Password"}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#df6828] hover:bg-[#c65a1f] text-white py-2.5 rounded font-bold transition-colors shadow-sm"
              >
                {mode === 'login' ? (isAr ? "دخول" : "Sign In") : (isAr ? "إنشاء حساب الآن" : "Register Account")}
              </button>

              <div className="text-center pt-2 text-xs text-gray-500">
                {mode === 'login' ? (
                  <p>
                    {isAr ? "ليس لديك حساب؟ " : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-[#df6828] font-bold hover:underline"
                    >
                      {isAr ? "تسجيل حساب جديد" : "Register here"}
                    </button>
                  </p>
                ) : (
                  <p>
                    {isAr ? "لديك حساب بالفعل؟ " : "Already registered? "}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#df6828] font-bold hover:underline"
                    >
                      {isAr ? "تسجيل الدخول" : "Sign in"}
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
