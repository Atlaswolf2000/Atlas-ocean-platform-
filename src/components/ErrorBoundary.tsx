import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Atlas Ocean Platform Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetCacheAndReload = () => {
    try {
      // Clear potentially corrupt localStorage keys
      const keysToRemove = [
        'ao_cart',
        'ao_orders',
        'ao_wishlist',
        'ao_categories',
        'ao_products',
        'atlas_products',
        'ao_recent_views',
        'atlas_vendors',
        'atlas_current_vendor_id',
        'ao_theme',
        'ao_currency',
        'ao_lang',
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
    window.location.reload();
  };

  private handleSimpleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'حدث خطأ غير متوقع أثناء تشغيل واجهة النظام';

      return (
        <div 
          dir="rtl"
          className="min-h-screen bg-[#1f1d1a] text-[#ebebeb] flex items-center justify-center p-4 font-sans select-none"
        >
          <div className="max-w-md w-full bg-[#2a2623] border border-amber-500/30 rounded-xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-[#df6828]/20 border border-[#df6828]/40 text-[#df6828] mx-auto flex items-center justify-center mb-4 shadow-inner">
              <AlertTriangle className="w-8 h-8 text-[#df6828]" />
            </div>

            <h2 className="text-xl font-black text-white mb-2">
              منصة أطلس المحيط التجارية
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              تم اكتشاف استثناء أثناء تحميل الواجهة، يمكنك استعادة واستئناف النظام بنقرة واحدة أدناه.
            </p>

            <div className="bg-[#1a1715] p-3 rounded-lg border border-gray-700/60 text-right mb-6 font-mono text-[11px] text-amber-300 break-words max-h-28 overflow-y-auto">
              {errorMessage}
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleResetCacheAndReload}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#df6828] to-amber-600 hover:from-[#c65a1f] hover:to-amber-700 text-white font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إصلاح تلقائي واستئناف النظام</span>
              </button>

              <button
                type="button"
                onClick={this.handleSimpleReload}
                className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs rounded-lg border border-gray-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>إعادة تحميل الصفحة فقط</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-500 mt-4">
              نظام أطلس التجاري المعتمد • Atlas Ocean Verified System
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
