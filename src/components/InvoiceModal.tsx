import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Order, Language } from '../types';
import { AtlasLogo } from './AtlasLogo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  lang: Language;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  lang,
}) => {
  const isAr = lang === 'ar';

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div
        id="printable-invoice-dialog"
        className="bg-white w-full max-w-3xl rounded shadow-2xl overflow-hidden border border-gray-200 flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Screen Header (hidden in print) */}
        <div className="bg-[#4d4440] text-white px-6 py-3.5 flex items-center justify-between border-b border-[#3b3430] print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#df6828]" />
            <span className="font-bold text-sm">
              {isAr ? `معاينة الفاتورة الضريبية | ${order.orderNumber}` : `Invoice Preview | ${order.orderNumber}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#df6828] hover:bg-[#c65a1f] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAr ? "طباعة الفاتورة" : "Print Invoice"}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 sm:p-10 space-y-6 text-gray-800 bg-white font-sans text-xs">
          
          {/* Top Brand & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-gray-100">
            <div>
              <AtlasLogo />
              <p className="text-[11px] text-gray-500 mt-2">
                Atlas Ocean Global Trade Platform
              </p>
              <p className="text-[10px] text-gray-400">
                CR & License: AO-TR-9948201-GLOBAL
              </p>
            </div>

            <div className="text-right sm:text-right" dir="ltr">
              <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider uppercase block">
                INVOICE / فاتورة
              </span>
              <p className="text-xs font-bold text-[#df6828] mt-1">
                {order.orderNumber}
              </p>
              <p className="text-gray-500 text-[11px]">
                Date: {order.date}
              </p>
              <div className="inline-block mt-1">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  Status: {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Parties: Billed To / Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-sm border border-gray-100">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                {isAr ? "بيانات المشتري / Billed To:" : "Billed To (Customer):"}
              </span>
              <h4 className="font-bold text-gray-900 text-sm">{order.customerName}</h4>
              <p className="text-gray-600 mt-0.5">{order.customerPhone}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                {isAr ? "عنوان التسليم والشحن / Shipping Address:" : "Shipping Destination:"}
              </span>
              <p className="text-gray-800 font-medium">{order.shippingAddress}</p>
              <p className="text-gray-500 text-[11px] mt-1">
                <span className="font-semibold">{isAr ? "طريقة الدفع: " : "Payment: "}</span>
                {order.paymentMethod}
              </p>
              {order.notes && (
                <p className="text-gray-500 text-[11px] italic mt-0.5">
                  "{order.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[11px] border-b border-gray-200">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">{isAr ? "بيان الصنف والمادة" : "Item Description"}</th>
                  <th className="p-3 text-center">{isAr ? "الكمية" : "Qty"}</th>
                  <th className="p-3 text-right">{isAr ? "سعر الوحدة" : "Unit Price"}</th>
                  <th className="p-3 text-right">{isAr ? "المجموع" : "Total"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {item.productTitle}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-bold">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right text-gray-700 font-mono">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-bold text-gray-900 font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="space-y-1.5 text-[11px] text-gray-500 max-w-sm">
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? "مشمول بحماية المشتري وضمان الجودة" : "Covered by Atlas Ocean Trade Assurance"}</span>
              </div>
              <p>
                {isAr
                  ? "شكراً لتعاملكم مع منصة أطلس أوشين التجارية. هذه الفاتورة رسمية ومعتمدة للجمارك والتسليم."
                  : "Thank you for trading with Atlas Ocean Platform. Valid official invoice for export and customs."}
              </p>
            </div>

            <div className="w-full sm:w-64 bg-gray-50 p-4 border border-gray-200 rounded-sm space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{isAr ? "المجموع الفرعي:" : "Subtotal:"}</span>
                <span className="font-mono">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{isAr ? "مصاريف الشحن والتأمين:" : "Logistics & Insurance:"}</span>
                <span className="font-mono text-emerald-600 font-bold">{isAr ? "مشمول (Free)" : "Included"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{isAr ? "ضريبة القيمة المضافة (0% تصدير):" : "Tax (0% Export):"}</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between font-black text-sm text-[#df6828]">
                <span>{isAr ? "المبلغ الإجمالي:" : "Grand Total:"}</span>
                <span className="font-mono">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note & signature line */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400 gap-2">
            <p>Atlas Ocean Platform • www.atlasoceanplatform.com • info@atlasoceanplatform.com</p>
            <div className="flex items-center gap-2">
              <span>Authorized Signature:</span>
              <span className="font-serif italic font-bold text-gray-700">Atlas Ocean Trade Desk</span>
            </div>
          </div>

        </div>

        {/* Screen Action Footer (hidden in print) */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between print:hidden text-xs">
          <span className="text-gray-500">
            {isAr ? "جاهزة للطباعة بصيغة قياسية A4" : "Ready for standard A4 printing"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#df6828] hover:bg-[#c65a1f] text-white px-5 py-2 rounded font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? "طباعة الآن" : "Print Now"}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold transition-colors"
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
