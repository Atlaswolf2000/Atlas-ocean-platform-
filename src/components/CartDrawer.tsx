import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import { CartItem, Language, Order, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => void;
  lang: Language;
  currency?: CurrencyCode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  lang,
  currency = 'USD',
}) => {
  const isAr = lang === 'ar';
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  // Checkout Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire Transfer (T/T)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const generatedNumber = `AO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderNumber(generatedNumber);

    onPlaceOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || 'buyer@atlasoceanplatform.com',
      shippingAddress: address,
      paymentMethod,
      notes,
      totalAmount: subtotal,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productTitle: isAr ? item.product.titleAr : item.product.titleEn,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
    });

    setStep('success');
    onClearCart();
  };

  const handleWhatsAppShare = () => {
    const text = `Atlas Ocean Platform Order ${lastOrderNumber}: Total $${subtotal.toFixed(2)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="cart-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Top Drawer Header */}
        <div className="bg-[#4d4440] text-white px-5 py-4 flex items-center justify-between border-b border-[#3b3430]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#df6828]" />
            <h3 className="font-bold text-sm sm:text-base">
              {isAr ? "سلة المشتريات والطلبيات" : "Shopping Cart & Quotation"}
            </h3>
            <span className="bg-[#df6828] text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-3 text-gray-300" />
                  <p className="font-semibold text-gray-700 text-sm">
                    {isAr ? "سلة المشتريات فارغة" : "Your cart is empty"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr ? "تصفح الأقسام والمواد وأضف ما يناسبك" : "Browse categories and materials to add items"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const itemTitle = isAr ? item.product.titleAr : item.product.titleEn;
                    return (
                      <div 
                        key={item.product.id}
                        className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-sm"
                      >
                        <img
                          src={item.product.image}
                          alt={itemTitle}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-contain bg-white border border-gray-200 rounded-sm flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 truncate" title={itemTitle}>
                              {itemTitle}
                            </h4>
                            <span className="text-[11px] text-gray-500">
                              {formatPrice(item.product.price, currency, lang)} / {item.product.unit}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-gray-300 rounded bg-white">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, Math.max(item.product.moq, item.quantity - 1))}
                                className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-xs font-bold text-[#df6828]">
                              {formatPrice(item.product.price * item.quantity, currency, lang)}
                            </span>

                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title={isAr ? "حذف" : "Remove"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleSubmitOrder} id="checkout-order-form" className="space-y-4 text-xs">
              <h4 className="font-bold text-gray-800 text-sm border-b border-gray-200 pb-2">
                {isAr ? "بيانات إتمام طلب الشراء والتوريد" : "Commercial Order Details"}
              </h4>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "الاسم الكامل / اسم الشركة *" : "Full Name / Company Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "مثال: شركة النور للتجارة العامة" : "e.g. Atlas Global Trading Co."}
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "رقم الهاتف / الواتساب *" : "Phone / WhatsApp Number *"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "عنوان التسليم / الميناء المطلوب *" : "Delivery Address / Port of Destination *"}
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isAr ? "المدينة، المستودع، أو أقرب ميناء بحري/جوي..." : "City, warehouse address or destination port..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "طريقة الدفع والتسوية" : "Payment & Settlement Method"}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white outline-none focus:ring-2 focus:ring-[#df6828]"
                >
                  <option value="Bank Wire Transfer (T/T)">Bank Wire Transfer (T/T)</option>
                  <option value="Letter of Credit (L/C)">Letter of Credit (L/C)</option>
                  <option value="Trade Assurance Escrow">Atlas Ocean Trade Escrow</option>
                  <option value="Cash on Delivery / Inspection">Payment upon Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {isAr ? "ملاحظات إضافية للتعبئة أو الشحن" : "Shipping & Packaging Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? "أي متطلبات خاصة للفحص أو التغليف..." : "Special packaging or inspection requests..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#df6828]"
                />
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900">
                {isAr ? "تم تسجيل طلب المبيعات بنجاح!" : "Order Successfully Placed!"}
              </h3>
              <p className="text-xs text-gray-600">
                {isAr 
                  ? `رقم الطلب الخاص بك: ${lastOrderNumber}. تم حفظ الطلب في لوحة المبيعات وسيتم التواصل معك لتجهيز الشحنة.` 
                  : `Your order ${lastOrderNumber} has been logged in the platform management system. Our trade logistics agent will contact you shortly.`}
              </p>
              <div className="pt-4 flex flex-col gap-2 w-full">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isAr ? "متابعة الطلب عبر واتساب" : "Follow Up on WhatsApp"}</span>
                </button>
                <button
                  onClick={() => {
                    setStep('cart');
                    onClose();
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded font-semibold text-xs"
                >
                  {isAr ? "العودة للمتجر" : "Back to Catalog"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {step !== 'success' && cartItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                {isAr ? "المجموع الإجمالي:" : "Total Subtotal:"}
              </span>
              <span className="font-extrabold text-lg text-[#df6828]">
                {formatPrice(subtotal, currency, lang)}
              </span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full bg-[#df6828] hover:bg-[#c65a1f] text-white py-3 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>{isAr ? "متابعة إتمام الطلب والتسجيل" : "Proceed to Checkout"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="py-2.5 px-3 border border-gray-300 text-gray-700 rounded font-semibold text-xs hover:bg-gray-100"
                >
                  {isAr ? "رجوع للسلة" : "Back"}
                </button>
                <button
                  form="checkout-order-form"
                  type="submit"
                  className="py-2.5 px-3 bg-[#df6828] hover:bg-[#c65a1f] text-white rounded font-bold text-xs shadow-md"
                >
                  {isAr ? "تأكيد الطلب الآن" : "Confirm Order"}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
