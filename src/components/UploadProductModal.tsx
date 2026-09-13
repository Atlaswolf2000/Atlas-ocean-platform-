import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  FileSpreadsheet, 
  Download, 
  FileText, 
  AlertCircle,
  Table
} from 'lucide-react';
import { Category, Product, Language } from '../types';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'ordersCount'>) => void;
  onBulkAddProducts?: (products: Omit<Product, 'id' | 'createdAt' | 'rating' | 'ordersCount'>[]) => void;
  onQuickAddCategory: (nameEn: string, nameAr: string) => Category;
  initialMode?: 'single' | 'bulk';
  lang: Language;
}

interface ParsedBulkItem {
  titleEn: string;
  titleAr: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  price: number;
  currency: string;
  moq: number;
  unit: string;
  stock: number;
  image: string;
  descriptionEn: string;
  descriptionAr: string;
  specs: { [key: string]: string };
  isFeatured: boolean;
}

export const UploadProductModal: React.FC<UploadProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddProduct,
  onBulkAddProducts,
  onQuickAddCategory,
  initialMode = 'single',
  lang,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // Active mode: single product vs bulk import
  const [mode, setMode] = useState<'single' | 'bulk'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  // Form State (Single Product)
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);

  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('45.00');
  const [currency, setCurrency] = useState('$');
  const [moq, setMoq] = useState('5');
  const [unit, setUnit] = useState('Pieces');
  const [stock, setStock] = useState('500');
  const [imagePreview, setImagePreview] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  // Specs key-value pairs
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Material', value: 'Commercial Grade' },
    { key: 'Certification', value: 'ISO9001 / CE' },
  ]);

  // Bulk Import States
  const [bulkRawText, setBulkRawText] = useState('');
  const [bulkFileName, setBulkFileName] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedBulkItem[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local image file upload (Single Product)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCatId = categoryId;
    if (isAddingNewCat && newCatNameEn.trim()) {
      const created = onQuickAddCategory(newCatNameEn.trim(), newCatNameAr.trim() || newCatNameEn.trim());
      targetCatId = created.id;
    }

    const finalImage = imagePreview.trim() || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';

    const specObj: { [key: string]: string } = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specObj[s.key.trim()] = s.value.trim();
      }
    });

    onAddProduct({
      titleEn: titleEn.trim() || (titleAr.trim() ? titleAr.trim() : 'Wholesale Industrial Product'),
      titleAr: titleAr.trim() || (titleEn.trim() ? titleEn.trim() : 'منتج ومادة صناعية للتجارة'),
      categoryId: targetCatId,
      brand: brand.trim() || 'ATLAS VERIFIED',
      price: parseFloat(price) || 10,
      currency,
      moq: parseInt(moq, 10) || 1,
      unit: unit.trim() || 'Piece',
      stock: parseInt(stock, 10) || 100,
      image: finalImage,
      descriptionEn: descriptionEn.trim() || 'High quality wholesale trade item sourced directly from verified manufacturer.',
      descriptionAr: descriptionAr.trim() || 'منتج ومادة عالية الجودة متوفرة للشراء المباشر وبالجملة من مصانع معتمدة.',
      specs: specObj,
      isFeatured,
    });

    onClose();
  };

  // Helper: Find category matching text
  const resolveCategory = (catText: string): { id: string; name: string } => {
    if (!catText || !catText.trim()) {
      return {
        id: categories[0]?.id || 'cat-1',
        name: isAr ? categories[0]?.nameAr || 'عام' : categories[0]?.nameEn || 'General',
      };
    }
    const clean = catText.trim().toLowerCase();
    const found = categories.find(
      (c) =>
        c.id.toLowerCase() === clean ||
        c.nameEn.toLowerCase().includes(clean) ||
        c.nameAr.toLowerCase().includes(clean) ||
        clean.includes(c.nameEn.toLowerCase()) ||
        clean.includes(c.nameAr.toLowerCase())
    );
    if (found) {
      return { id: found.id, name: isAr ? found.nameAr : found.nameEn };
    }
    return {
      id: categories[0]?.id || 'cat-1',
      name: isAr ? categories[0]?.nameAr || 'عام' : categories[0]?.nameEn || 'General',
    };
  };

  // Parse Raw CSV / TSV / Excel pasted lines
  const parseSpreadsheetData = (text: string) => {
    setBulkError(null);
    if (!text || !text.trim()) {
      setParsedItems([]);
      return;
    }

    const lines = text.trim().split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      setBulkError(isAr ? 'لم يتم العثور على أي أسطر في البيانات المدخلة' : 'No lines found in provided data');
      return;
    }

    // Determine delimiter (tab or comma or semicolon)
    const firstLine = lines[0];
    const isTab = firstLine.includes('\t');
    const isSemicolon = !isTab && firstLine.includes(';');
    const delimiter = isTab ? '\t' : isSemicolon ? ';' : ',';

    const parseLine = (line: string): string[] => {
      if (delimiter === '\t') {
        return line.split('\t').map((s) => s.trim().replace(/^["']|["']$/g, ''));
      }
      // Handle comma/semicolon with quotes
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      return result;
    };

    let startIndex = 0;
    const headerCols = parseLine(lines[0]).map((h) => h.toLowerCase());
    const hasHeader =
      headerCols.some((h) => h.includes('title') || h.includes('name') || h.includes('اسم') || h.includes('price') || h.includes('سعر'));

    if (hasHeader) {
      startIndex = 1;
    }

    const items: ParsedBulkItem[] = [];
    const defaultImages = [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    ];

    for (let i = startIndex; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length < 2) continue; // skip empty or invalid line

      // Expected Column Order:
      // 0: titleEn, 1: titleAr, 2: category, 3: brand, 4: price, 5: moq, 6: unit, 7: stock, 8: descriptionEn, 9: descriptionAr, 10: image
      const titleEnVal = cols[0] || `Industrial Bulk Item #${i}`;
      const titleArVal = cols[1] || (titleEnVal ? `${titleEnVal} (تجاري)` : `مادة صناعية #${i}`);
      const catText = cols[2] || '';
      const resolvedCat = resolveCategory(catText);
      const brandVal = cols[3] || 'ATLAS VERIFIED';
      
      const rawPrice = (cols[4] || '').replace(/[^0-9.]/g, '');
      const priceVal = parseFloat(rawPrice) || 35.0;

      const rawMoq = (cols[5] || '').replace(/[^0-9]/g, '');
      const moqVal = parseInt(rawMoq, 10) || 5;

      const unitVal = cols[6] || 'Piece';

      const rawStock = (cols[7] || '').replace(/[^0-9]/g, '');
      const stockVal = parseInt(rawStock, 10) || 250;

      const descEnVal = cols[8] || `${titleEnVal} with commercial certifications. Direct factory supply.`;
      const descArVal = cols[9] || `${titleArVal} بمواصفات معتمدة ومطابقة للمعايير. توريد فوري من المصنع.`;

      const imgVal = cols[10]?.startsWith('http') 
        ? cols[10] 
        : defaultImages[i % defaultImages.length];

      items.push({
        titleEn: titleEnVal,
        titleAr: titleArVal,
        categoryId: resolvedCat.id,
        categoryName: resolvedCat.name,
        brand: brandVal,
        price: priceVal,
        currency: '$',
        moq: moqVal,
        unit: unitVal,
        stock: stockVal,
        image: imgVal,
        descriptionEn: descEnVal,
        descriptionAr: descArVal,
        specs: {
          'Origin': 'Factory Direct',
          'Standard': 'Commercial Grade',
          'Grade': 'A1 Export Quality',
        },
        isFeatured: true,
      });
    }

    if (items.length === 0) {
      setBulkError(isAr ? 'لم نتمكن من تحليل أسطر المنتجات بشكل صحيح. يرجى مراجعة التنسيق.' : 'Could not parse any product records. Please check the columns.');
    } else {
      setParsedItems(items);
      setBulkError(null);
    }
  };

  // Handle Excel/CSV file upload
  const handleBulkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setBulkRawText(content);
        parseSpreadsheetData(content);
      }
    };
    reader.readAsText(file);
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const header = 'Title English,Title Arabic,Category,Brand,Price,MOQ,Unit,Stock,Description English,Description Arabic,Image URL\n';
    const sample1 = 'Double Glazed Float Glass,زجاج مزدوج عازل للمباني,Glass Materials,SAINT GOBAIN,68.00,10,m²,500,Acoustic and thermal insulating architectural double glazing glass.,زجاج معماري مزدوج عازل للصوت والحرارة عالي المتانة للواجهات.,https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80\n';
    const sample2 = 'Industrial Carbon Steel Seamless Pipe,أنابيب فولاذية كربونية غير ملحومة,Steel & Metal,NIPPON STEEL,140.00,5,Ton,80,Heavy duty ASTM A106 carbon steel seamless pipes for piping.,أنابيب فولاذية غير ملحومة للمشاريع البترولية والصناعية الثقيلة.,https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80\n';
    const sample3 = 'Multiwall Polycarbonate Hollow Sheet,ألواح بوليكربونيت متعددة الجدران,Plastics & Polymers,SABIC LEXAN,32.50,20,Sheet,400,UV protected lightweight multiwall polycarbonate sheets for roofing.,ألواح بوليكربونيت مفرغة مقاومة للأشعة فوق البنفسجية لتغطية الأسقف.,https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80\n';

    // UTF-8 BOM so Excel opens Arabic text accurately without question marks
    const blob = new Blob(['\uFEFF' + header + sample1 + sample2 + sample3], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atlas_ocean_products_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Confirm Bulk Import
  const handleConfirmBulkImport = () => {
    if (parsedItems.length === 0) return;

    if (onBulkAddProducts) {
      onBulkAddProducts(
        parsedItems.map((item) => ({
          titleEn: item.titleEn,
          titleAr: item.titleAr,
          categoryId: item.categoryId,
          brand: item.brand,
          price: item.price,
          currency: item.currency,
          moq: item.moq,
          unit: item.unit,
          stock: item.stock,
          image: item.image,
          descriptionEn: item.descriptionEn,
          descriptionAr: item.descriptionAr,
          specs: item.specs,
          isFeatured: item.isFeatured,
        }))
      );
    } else {
      // Fallback: sequential addition
      parsedItems.forEach((item) => {
        onAddProduct({
          titleEn: item.titleEn,
          titleAr: item.titleAr,
          categoryId: item.categoryId,
          brand: item.brand,
          price: item.price,
          currency: item.currency,
          moq: item.moq,
          unit: item.unit,
          stock: item.stock,
          image: item.image,
          descriptionEn: item.descriptionEn,
          descriptionAr: item.descriptionAr,
          specs: item.specs,
          isFeatured: item.isFeatured,
        });
      });
    }

    setBulkSuccessMsg(
      isAr 
        ? `تم استيراد ${parsedItems.length} منتج ومادة بنجاح وإضافتها للمنصة!` 
        : `Successfully imported ${parsedItems.length} products and materials!`
    );

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleRemoveParsedItem = (index: number) => {
    setParsedItems(parsedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        id="upload-product-modal-dialog"
        className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 w-full max-w-3xl rounded shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 flex flex-col max-h-[92vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="bg-[#4d4440] text-white px-6 py-4 flex items-center justify-between border-b border-[#3b3430] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#df6828] rounded-sm text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isAr ? "رفع مادة أو منتج جديد للمبيعات" : "Upload Product or Material for Sales"}
              </h3>
              <p className="text-xs text-gray-300">
                {isAr ? "إضافة المنتجات والمواد للأقسام وعرضها للمشترين بالجملة" : "Add products, materials, and categories to Atlas Ocean Platform"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1.5 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Single vs Bulk Excel/CSV) */}
        <div className="flex items-center border-b border-gray-200 dark:border-neutral-700 bg-gray-100/70 dark:bg-neutral-800 px-6 pt-2 gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'single'
                ? 'border-[#df6828] text-[#df6828] bg-white dark:bg-neutral-900 rounded-t border-t border-x border-gray-200 dark:border-neutral-700'
                : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? "رفع منتج ومادة فردية" : "Single Product Entry"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'bulk'
                ? 'border-[#df6828] text-[#df6828] bg-white dark:bg-neutral-900 rounded-t border-t border-x border-gray-200 dark:border-neutral-700'
                : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? "استيراد سريع بالجملة (Excel / CSV)" : "Bulk Import via Excel / CSV"}</span>
            <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
              B2B
            </span>
          </button>
        </div>

        {/* TAB 1: SINGLE PRODUCT FORM (100% UNTOUCHED ORIGINAL STRUCTURE) */}
        {mode === 'single' && (
          <form onSubmit={handleSubmitSingle} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            {/* Section: Names in Arabic & English */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "اسم المنتج / المادة (بالعربية) *" : "Product Name (Arabic) *"}
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: زجاج أمامي للسيارات مصفح عالي الجودة"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "اسم المنتج / المادة (بالانجليزية) *" : "Product Name (English) *"}
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. High Impact Laminated Windshield Glass"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Section: Department / Category selection */}
            <div className="bg-gray-50 dark:bg-neutral-800/80 p-3.5 rounded border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-800 dark:text-neutral-200 font-bold">
                  {isAr ? "القسم والمادة التابعة له *" : "Department / Material Category *"}
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                  className="text-[#df6828] hover:text-[#b8531c] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewCat ? (isAr ? "اختيار من القائمة" : "Select Existing") : (isAr ? "+ إنشاء قسم جديد" : "+ Create New Category")}</span>
                </button>
              </div>

              {!isAddingNewCat ? (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.nameAr : c.nameEn} ({c.nameEn})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <input
                    type="text"
                    required
                    value={newCatNameAr}
                    onChange={(e) => setNewCatNameAr(e.target.value)}
                    placeholder="اسم القسم بالعربية (مثال: مواد البناء والخرسانة)"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none"
                    dir="rtl"
                  />
                  <input
                    type="text"
                    required
                    value={newCatNameEn}
                    onChange={(e) => setNewCatNameEn(e.target.value)}
                    placeholder="Category Name in English (e.g. Building Materials)"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none"
                    dir="ltr"
                  />
                </div>
              )}
            </div>

            {/* Section: Brand & Pricing & Stock */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "الماركة / المصنع" : "Brand / Maker"}
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. SAINT GOBAIN"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "سعر الجملة ($) *" : "Wholesale Price ($) *"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none font-bold text-[#df6828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "أدنى كمية للطلب (MOQ)" : "Minimum Order (MOQ)"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "وحدة البيع" : "Sales Unit"}
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Piece / Ton / m²"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                {isAr ? "المخزون المتاح في المستودع *" : "Stock Available in Warehouse *"}
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
              />
            </div>

            {/* Section: Image Upload & Preview */}
            <div>
              <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                {isAr ? "صورة المنتج والمادة *" : "Product & Material Image *"}
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-48 h-36 border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-[#df6828] rounded flex flex-col items-center justify-center p-4 cursor-pointer bg-gray-50 dark:bg-neutral-800 transition-colors"
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-[11px] text-gray-500 dark:text-neutral-400 text-center font-medium">
                        {isAr ? "اضغط لرفع صورة من جهازك" : "Click to upload image"}
                      </span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <span className="text-xs text-gray-500 dark:text-neutral-400 block">
                    {isAr ? "أو يمكنك كتابة رابط صورة مباشرة (URL):" : "Or enter direct image URL:"}
                  </span>
                  <input
                    type="url"
                    value={imagePreview}
                    onChange={(e) => setImagePreview(e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-[#df6828]"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setImagePreview('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80')}
                      className="text-[11px] text-gray-600 dark:text-neutral-400 hover:text-[#df6828] bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded"
                    >
                      {isAr ? "صورة زجاج صناعي تجريبية" : "Sample Glass Image"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImagePreview('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80')}
                      className="text-[11px] text-gray-600 dark:text-neutral-400 hover:text-[#df6828] bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded"
                    >
                      {isAr ? "صورة معادن ومستودع" : "Sample Metal Image"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Description in Arabic & English */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "الوصف التفصيلي (عربي)" : "Description (Arabic)"}
                </label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف استخدامات المادة، مميزاتها، الشحن..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-neutral-300 font-semibold mb-1">
                  {isAr ? "الوصف التفصيلي (انجليزي)" : "Description (English)"}
                </label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Detailed specifications, industrial usage, packaging..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#df6828] outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Section: Technical Specs List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-800 dark:text-neutral-200 font-bold">
                  {isAr ? "المواصفات الفنية المعتمدة" : "Technical Specifications"}
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-[#df6828] hover:text-[#b8531c] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? "إضافة خاصية فنية" : "Add Specification"}</span>
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                      placeholder={isAr ? "الخاصية (مثل: السماكة، الضغط)" : "Spec Key (e.g. Thickness, Pressure)"}
                      className="w-1/3 px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#df6828]"
                    />
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      placeholder={isAr ? "القيمة (مثل: 50 كجم، 220V)" : "Value (e.g. 50kg, 220V)"}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-[#df6828]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkbox: Show in Featured Products */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is-featured-checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#df6828] accent-[#df6828] rounded cursor-pointer"
              />
              <label htmlFor="is-featured-checkbox" className="text-gray-700 dark:text-neutral-300 font-medium cursor-pointer">
                {isAr ? "عرض في قسم المنتجات المميزة (FEATURED PRODUCTS) في الصفحة الرئيسية" : "Show in Featured Products on Homepage"}
              </label>
            </div>

            {/* Footer Submit */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 font-medium transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                id="submit-new-product-btn"
                type="submit"
                className="px-6 py-2 bg-[#df6828] hover:bg-[#c65a1f] text-white font-bold rounded shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? "حفظ ورفع المنتج للمبيعات" : "Upload & Publish Product"}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: BULK IMPORT VIA EXCEL / CSV */}
        {mode === 'bulk' && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            {/* Explanatory Banner & Download Sample */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    {isAr ? "استيراد المنتجات والمواد دفعة واحدة عبر ملف Excel / CSV" : "Fast B2B Bulk Product Import via Excel / CSV"}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 leading-relaxed">
                    {isAr 
                      ? "وفر وقتك في رفع كل منتج على حدة. قم برفع جدول البيانات بصيغة CSV أو Excel وسيتم تحليل الأعمدة وإدراج كافة المنتجات تلقائياً." 
                      : "Upload a spreadsheet or paste table data from Excel/Google Sheets to import multiple wholesale items in one step."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-neutral-800 px-3 py-2 rounded font-bold text-xs transition-colors flex-shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? "تحميل نموذج Excel التجريبي" : "Download Template .CSV"}</span>
              </button>
            </div>

            {/* Drag and Drop File Input Area */}
            <div 
              onClick={() => bulkFileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-500 bg-emerald-50/40 dark:bg-neutral-800/60 p-6 rounded-lg text-center cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-gray-800 dark:text-neutral-200 text-sm">
                {bulkFileName 
                  ? (isAr ? `الملف المحدد: ${bulkFileName}` : `Selected: ${bulkFileName}`)
                  : (isAr ? "اضغط هنا لاختيار ملف Excel أو CSV من جهازك" : "Click here to choose an Excel (.xlsx / .xls) or CSV file")}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                {isAr ? "يدعم امتدادات (.csv, .xlsx, .xls, .tsv, .txt)" : "Supports (.csv, .xlsx, .xls, .tsv, .txt)"}
              </p>
              <input
                ref={bulkFileInputRef}
                type="file"
                accept=".csv,.tsv,.txt,.xlsx,.xls"
                onChange={handleBulkFileUpload}
                className="hidden"
              />
            </div>

            {/* Direct Paste Alternative */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-700 dark:text-neutral-300 text-xs">
                  {isAr ? "أو الصق بيانات الجدول المنسوخة من Excel مباشرة هنا:" : "Or paste copied table data directly from Excel / Sheets:"}
                </label>
                {bulkRawText && (
                  <button
                    type="button"
                    onClick={() => {
                      setBulkRawText('');
                      setParsedItems([]);
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    {isAr ? "مسح البيانات" : "Clear"}
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={bulkRawText}
                onChange={(e) => {
                  setBulkRawText(e.target.value);
                  parseSpreadsheetData(e.target.value);
                }}
                placeholder={
                  isAr 
                    ? "الصق أعمدة الجدول (العنوان بالانجليزي، بالعربي، القسم، الماركة، السعر، أدنى طلب، الوحدة، المخزون...)" 
                    : "Paste raw table text or comma/tab separated lines..."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-[11px] focus:ring-2 focus:ring-[#df6828] outline-none"
              />
            </div>

            {/* Error Message if any */}
            {bulkError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{bulkError}</span>
              </div>
            )}

            {/* Parsed Items Preview Table */}
            {parsedItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 dark:text-neutral-200 text-xs">
                      {isAr ? "معاينة المنتجات المستخرجة قبل الإدراج:" : "Preview Parsed Products:"}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {parsedItems.length} {isAr ? "منتج جاهز" : "items ready"}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {isAr ? "يمكنك حذف أي منتج غير مرغوب قبل التأكيد" : "Review items before importing"}
                  </span>
                </div>

                <div className="border border-gray-200 dark:border-neutral-700 rounded overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 uppercase font-semibold border-b border-gray-200 dark:border-neutral-700 sticky top-0">
                      <tr>
                        <th className="p-2 w-10">#</th>
                        <th className="p-2 w-12">{isAr ? "الصورة" : "Image"}</th>
                        <th className="p-2">{isAr ? "اسم المنتج (عربي / إنجليزي)" : "Product Title"}</th>
                        <th className="p-2">{isAr ? "القسم" : "Department"}</th>
                        <th className="p-2">{isAr ? "السعر" : "Price"}</th>
                        <th className="p-2">{isAr ? "أدنى طلب" : "MOQ"}</th>
                        <th className="p-2">{isAr ? "المخزون" : "Stock"}</th>
                        <th className="p-2 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                      {parsedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-neutral-800/60">
                          <td className="p-2 text-gray-400 text-[10px]">{idx + 1}</td>
                          <td className="p-2">
                            <img
                              src={item.image}
                              alt=""
                              className="w-8 h-8 object-contain rounded bg-white border border-gray-200"
                            />
                          </td>
                          <td className="p-2">
                            <span className="font-bold text-gray-800 dark:text-neutral-200 block truncate max-w-[200px]">
                              {isAr ? item.titleAr : item.titleEn}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate block max-w-[200px]">
                              {item.brand} • {isAr ? item.titleEn : item.titleAr}
                            </span>
                          </td>
                          <td className="p-2 text-gray-600 dark:text-neutral-400">
                            {item.categoryName}
                          </td>
                          <td className="p-2 font-bold text-[#df6828]">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-2 text-gray-600 dark:text-neutral-400">
                            {item.moq} {item.unit}
                          </td>
                          <td className="p-2 font-semibold text-emerald-600">
                            {item.stock}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveParsedItem(idx)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title={isAr ? "حذف من القائمة" : "Remove"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Success Message Banner */}
            {bulkSuccessMsg && (
              <div className="bg-emerald-500 text-white p-3 rounded font-bold text-center text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>{bulkSuccessMsg}</span>
              </div>
            )}

            {/* Actions Footer */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 font-medium transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={handleConfirmBulkImport}
                disabled={parsedItems.length === 0}
                className={`px-6 py-2 rounded font-bold shadow-md flex items-center gap-2 transition-all ${
                  parsedItems.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                    : 'bg-gray-300 dark:bg-neutral-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {isAr 
                    ? `تأكيد استيراد المنتجات (${parsedItems.length} منتجات)` 
                    : `Confirm Bulk Import (${parsedItems.length} items)`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
