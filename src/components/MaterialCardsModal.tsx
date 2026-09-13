import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  PackageOpen, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowLeft,
  Link,
  UploadCloud
} from 'lucide-react';
import { Product, Category, Language } from '../types';

interface MaterialCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product, isNew: boolean) => void;
  onDeleteProduct?: (id: string) => void;
  lang: Language;
}

export const MaterialCardsModal: React.FC<MaterialCardsModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  lang,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search filter
  const [searchInput, setSearchInput] = useState('');

  // Edit / Add Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | -1>(-1); // -1 for new product

  // Form Fields
  const [editId, setEditId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');
  const [editMinOrder, setEditMinOrder] = useState<string>('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editBrand, setEditBrand] = useState('');
  
  // Multi-image list (1, 2, 3+ images)
  const [currentActiveImages, setCurrentActiveImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Dynamic Specs
  const [specsRows, setSpecsRows] = useState<{ key: string; value: string }[]>([]);

  if (!isOpen) return null;

  // Filter products by search query
  const query = searchInput.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    if (!query) return true;
    return (
      p.titleAr?.toLowerCase().includes(query) ||
      p.titleEn?.toLowerCase().includes(query) ||
      p.id?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      (p.descriptionAr && p.descriptionAr.toLowerCase().includes(query)) ||
      (p.descriptionEn && p.descriptionEn.toLowerCase().includes(query))
    );
  });

  // Open Edit Modal for existing product
  const handleOpenEdit = (product: Product) => {
    const idx = products.findIndex((p) => p.id === product.id);
    setEditingIndex(idx);
    setEditId(product.id);
    setEditTitle(isAr ? (product.titleAr || product.titleEn) : (product.titleEn || product.titleAr));
    setEditPrice(product.price.toString());
    setEditStock(product.stock ? `${product.stock} قطع` : '100 قطع');
    setEditMinOrder(product.moq ? `${product.moq} قطع` : '5 قطع');
    setEditDescription(isAr ? (product.descriptionAr || product.descriptionEn) : (product.descriptionEn || product.descriptionAr));
    setEditCategoryId(product.categoryId || (categories[0]?.id ?? ''));
    setEditBrand(product.brand || 'ATLAS');

    // Populate images (supports 1, 2, 3+ images)
    const existingImgs = product.images && product.images.length > 0 
      ? [...product.images] 
      : (product.image ? [product.image] : []);
    setCurrentActiveImages(existingImgs);

    // Populate Specs
    const specsList: { key: string; value: string }[] = [];
    if (product.specs && typeof product.specs === 'object') {
      Object.entries(product.specs).forEach(([k, v]) => {
        specsList.push({ key: k, value: String(v) });
      });
    }
    if (specsList.length === 0) {
      specsList.push({ key: isAr ? 'المواصفات الرئيسية' : 'Key Spec', value: isAr ? 'مطابق للمعايير' : 'Standard' });
    }
    setSpecsRows(specsList);
    setIsEditModalOpen(true);
  };

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setEditingIndex(-1);
    setEditId(`prod-${Date.now()}`);
    setEditTitle('');
    setEditPrice('138.00');
    setEditStock('420 قطع');
    setEditMinOrder('5 قطع');
    setEditDescription('');
    setEditCategoryId(categories[0]?.id ?? 'cat-vehicles');
    setEditBrand('ATLAS');
    setCurrentActiveImages([]);
    setSpecsRows([
      { key: isAr ? 'المواصفات الرئيسية' : 'Specification', value: isAr ? 'القيمة المطلوبة' : 'Value' }
    ]);
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setShowUrlInput(false);
    setImageUrlInput('');
  };

  // Image Upload handler (supports 1, 2, or 3+ images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentActiveImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(files[i]);
    }
    // reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setCurrentActiveImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (index: number) => {
    setCurrentActiveImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Specs Row management
  const handleAddSpecRow = () => {
    setSpecsRows((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecsRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    setSpecsRows((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  // Save product changes
  const handleSaveProduct = () => {
    if (!editTitle.trim()) {
      alert(isAr ? 'يرجى كتابة اسم المادة' : 'Please enter material title');
      return;
    }

    const numericPrice = parseFloat(editPrice) || 0;
    const numericStock = parseInt(editStock.replace(/\D/g, '')) || 100;
    const numericMoq = parseInt(editMinOrder.replace(/\D/g, '')) || 1;

    // Convert specs array to object
    const specsObj: { [key: string]: string } = {};
    specsRows.forEach((row) => {
      if (row.key.trim()) {
        specsObj[row.key.trim()] = row.value.trim();
      }
    });

    const finalImages = currentActiveImages.length > 0 
      ? currentActiveImages 
      : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'];

    const isNew = editingIndex === -1;
    const targetProduct: Product = {
      id: isNew ? editId || `prod-${Date.now()}` : products[editingIndex]?.id || editId,
      titleEn: editTitle,
      titleAr: editTitle,
      categoryId: editCategoryId || categories[0]?.id || 'cat-vehicles',
      brand: editBrand || 'ATLAS',
      price: numericPrice,
      currency: '$',
      moq: numericMoq,
      unit: isAr ? 'قطع' : 'Pieces',
      stock: numericStock,
      image: finalImages[0],
      images: finalImages,
      descriptionEn: editDescription,
      descriptionAr: editDescription,
      specs: specsObj,
      isFeatured: true,
      rating: isNew ? 5.0 : (products[editingIndex]?.rating || 5.0),
      ordersCount: isNew ? 12 : (products[editingIndex]?.ordersCount || 50),
      createdAt: isNew ? new Date().toISOString() : (products[editingIndex]?.createdAt || new Date().toISOString()),
      badge: 'Hot Deal',
      badgeAr: 'عرض مميز',
    };

    onSaveProduct(targetProduct, isNew);
    handleCloseEdit();
  };

  return (
    <div 
      id="atlas-material-cards-system"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex flex-col justify-start min-h-screen"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-slate-900 font-black p-2 rounded-lg text-xl shadow-xs">
              أطلس
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white leading-tight">
                {isAr ? "هيئة المحيط للتجارة العامة والشحن الجوي" : "Atlas Ocean General Trading & Air Freight"}
              </h1>
              <span className="block text-xs text-amber-400 font-medium">
                {isAr ? "نظام إدارة وتعديل بطاقات المواد" : "Material Cards Management & Editor System"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleOpenAdd} 
              id="btn-add-new-material"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? "إضافة مادة جديدة" : "Add New Material"}</span>
            </button>

            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title={isAr ? "إغلاق النافذة" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center border border-gray-200">
          <div className="w-full md:w-1/3 relative">
            <Search className={`w-4 h-4 absolute top-3.5 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
            <input 
              type="text" 
              id="searchInput" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isAr ? "ابحث باسم المادة أو الكود..." : "Search by material name or code..."} 
              className={`w-full py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
          </div>
          <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
            <span>{isAr ? "إجمالي المواد المسجلة:" : "Total Registered Materials:"}</span>
            <span id="totalProductsCount" className="font-bold text-slate-900 bg-amber-100 text-slate-900 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div id="productsGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const displayTitle = isAr ? (product.titleAr || product.titleEn) : (product.titleEn || product.titleAr);
            const displayDesc = isAr ? (product.descriptionAr || product.descriptionEn) : (product.descriptionEn || product.descriptionAr);
            const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
            const mainImg = imagesList[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';

            return (
              <div 
                key={product.id}
                id={`material-card-${product.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* Image Container with Badge */}
                <div className="relative h-48 bg-gray-100 overflow-hidden group">
                  <img 
                    src={mainImg} 
                    alt={displayTitle} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <span className={`absolute top-2 ${isAr ? 'right-2' : 'left-2'} bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-xs flex items-center gap-1`}>
                    <ImageIcon className="w-3 h-3" />
                    <span>{imagesList.length} {isAr ? "صور" : "images"}</span>
                  </span>
                  {product.brand && (
                    <span className={`absolute bottom-2 ${isAr ? 'right-2' : 'left-2'} bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded`}>
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 mb-2 line-clamp-2 leading-snug">
                      {displayTitle}
                    </h4>
                    <p className="text-amber-600 font-extrabold text-lg mb-2">
                      ${product.price.toFixed(2)} 
                      <span className="text-xs font-normal text-gray-500 mx-1">
                        / {isAr ? 'قطعة' : 'piece'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-semibold border border-emerald-200/60">
                      {isAr ? "متوفر:" : "Stock:"} {product.stock || 100} {isAr ? "قطع" : "pcs"}
                    </span>
                    <button 
                      onClick={() => handleOpenEdit(product)} 
                      className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? "بطاقة المادة" : "Material Card"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm mt-4">
            <PackageOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              {isAr ? "لم يتم العثور على أي مواد مطابقة" : "No matching materials found"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isAr ? "جرب البحث بكلمات أخرى أو قم بإضافة مادة جديدة" : "Try searching other terms or add a new material card"}
            </p>
            <button
              onClick={handleOpenAdd}
              className="bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs"
            >
              {isAr ? "+ إضافة مادة جديدة الآن" : "+ Add New Material Now"}
            </button>
          </div>
        )}
      </main>

      {/* Product Details & Edit Modal ("بطاقة المادة") */}
      {isEditModalOpen && (
        <div 
          id="productModal" 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-2xs"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-amber-400" /> 
                <span>{isAr ? "بطاقة المادة التفصيلية" : "Detailed Material Card & Editor"}</span>
              </h3>
              <button 
                onClick={handleCloseEdit} 
                className="text-gray-400 hover:text-white text-xl font-bold p-1 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Image Gallery Section (Supports 1, 2, or 3+ images) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-sm text-gray-700">
                    {isAr ? "صور المادة (يمكن رفع عدة صور - 1، 2، 3 صور وأكثر):" : "Material Images (Upload multiple images - 1, 2, 3+ images):"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>{showUrlInput ? (isAr ? "إلغاء الرابط" : "Hide URL") : (isAr ? "إضافة رابط صورة" : "Add Image URL")}</span>
                  </button>
                </div>

                {/* Direct Image URL input if desired */}
                {showUrlInput && (
                  <div className="flex gap-2 mb-3 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder={isAr ? "ضع رابط الصورة هنا (https://...)" : "Paste image URL here (https://...)"}
                      className="flex-1 p-2 text-xs border rounded bg-white"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-3 py-1.5 rounded"
                    >
                      {isAr ? "إضافة" : "Add"}
                    </button>
                  </div>
                )}

                {/* Thumbnail Gallery (معرض الصور المصغرة) */}
                <div 
                  id="modalImageGallery"
                  className="flex gap-2 mb-3 overflow-x-auto p-2 bg-gray-50 rounded-lg border min-h-[110px] items-center"
                >
                  {currentActiveImages.length === 0 ? (
                    <div className="text-xs text-gray-400 p-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      <span>
                        {isAr 
                          ? "لم يتم رفع صور بعد. قم باختيار صور من الأسفل (يمكنك اختيار 1، 2، أو 3 صور وأكثر)." 
                          : "No images uploaded yet. Select files below (supports 1, 2, 3+ images)."}
                      </span>
                    </div>
                  ) : (
                    currentActiveImages.map((imgSrc, i) => (
                      <div 
                        key={i} 
                        className="relative w-20 h-20 shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs group"
                      >
                        <img 
                          src={imgSrc} 
                          alt={`Uploaded ${i + 1}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(i)} 
                          className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer"
                          title={isAr ? "حذف الصورة" : "Remove Image"}
                        >
                          &times;
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center">
                          #{i + 1}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* File Upload Input */}
                <input 
                  type="file" 
                  id="imageUploadInput" 
                  ref={fileInputRef}
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer" 
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {isAr 
                    ? "يمكنك تحديد عدة صور في وقت واحد من جهازك ليتم حفظها وعرضها كألبوم صور في بطاقة المادة." 
                    : "You can select multiple photos simultaneously to create an image gallery for this material."}
                </span>
              </div>

              {/* Product Form Fields for Editing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {isAr ? "اسم المادة / العنوان:" : "Material Name / Title:"}
                  </label>
                  <input 
                    type="text" 
                    id="editTitle" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder={isAr ? "مثال: 35L Portable Compressor Car Refrigerator" : "Title..."}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {isAr ? "السعر بالجملة ($):" : "Wholesale Price ($):"}
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    id="editPrice" 
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="138.00"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {isAr ? "الكمية المتوفرة في المخزن:" : "Available Stock in Warehouse:"}
                  </label>
                  <input 
                    type="text" 
                    id="editStock" 
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    placeholder={isAr ? "420 قطع" : "420 pieces"}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {isAr ? "الاقل طلباً (Minimum Order):" : "Minimum Order (MOQ):"}
                  </label>
                  <input 
                    type="text" 
                    id="editMinOrder" 
                    value={editMinOrder}
                    onChange={(e) => setEditMinOrder(e.target.value)}
                    placeholder={isAr ? "5 قطع" : "5 pieces"}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {isAr ? "القسم التجاري للمادة:" : "Category / Department:"}
                  </label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {isAr ? "العلامة التجارية / الماركة:" : "Brand Name:"}
                  </label>
                  <input 
                    type="text" 
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    placeholder="ATLAS"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  {isAr ? "الوصف التفصيلي للمادة:" : "Detailed Description:"}
                </label>
                <textarea 
                  id="editDescription" 
                  rows={3} 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder={isAr ? "الوصف الفني والتجاري للمادة..." : "Detailed product description..."}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                />
              </div>

              {/* Technical Specs Section */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center justify-between text-sm">
                  <span>{isAr ? "المواصفات الفنية (Technical Specs):" : "Technical Specifications:"}</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {isAr ? `إجمالي: ${specsRows.length} خاصية` : `${specsRows.length} properties`}
                  </span>
                </h4>

                <div id="specsContainer" className="space-y-2">
                  {specsRows.map((spec, sIdx) => (
                    <div key={sIdx} className="flex gap-2 items-center spec-row">
                      <input 
                        type="text" 
                        placeholder={isAr ? "اسم الخاصية (مثال: الحجم)" : "Spec Name (e.g. Capacity)"} 
                        value={spec.key} 
                        onChange={(e) => handleSpecChange(sIdx, 'key', e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs sm:text-sm spec-key focus:ring-1 focus:ring-amber-500 outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder={isAr ? "القيمة (مثال: 35 لتر)" : "Spec Value (e.g. 35 Liters)"} 
                        value={spec.value} 
                        onChange={(e) => handleSpecChange(sIdx, 'value', e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs sm:text-sm spec-val focus:ring-1 focus:ring-amber-500 outline-none" 
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSpecRow(sIdx)} 
                        className="text-red-500 hover:text-red-700 font-bold p-2 transition-colors cursor-pointer"
                        title={isAr ? "حذف الخاصية" : "Delete spec"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  type="button"
                  onClick={handleAddSpecRow} 
                  className="mt-2 text-sm text-amber-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? "إضافة مواصفة جديدة" : "Add New Specification"}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                {editingIndex !== -1 && onDeleteProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(isAr ? 'هل أنت متأكد من حذف هذه المادة؟' : 'Are you sure you want to delete this material?')) {
                        onDeleteProduct(products[editingIndex].id);
                        handleCloseEdit();
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "حذف المادة" : "Delete Item"}</span>
                  </button>
                )}

                <div className="flex justify-end gap-3 ms-auto">
                  <button 
                    type="button"
                    onClick={handleCloseEdit} 
                    className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveProduct} 
                    id="btn-save-material-card"
                    className="px-5 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-600 font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? "حفظ التعديلات" : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
