export type Language = 'en' | 'ar' | 'es' | 'nl' | 'th';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  images: string[]; // Base64 strings
  stock: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CompanySettings {
  name: string;
  email: string;
  address: string;
  taxId: string;
  logoUrl: string;
  signatureUrl: string;
  currency: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  taxRate: number;
  discount: number;
  status: InvoiceStatus;
  currency: string;
  notes?: string;
  paymentTerms?: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: Language;
  invoices: Invoice[];
  products: Product[];
  chatHistory: ChatMessage[];
  companySettings: CompanySettings;
  
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  
  addInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  updateInvoice: (id: string, invoice: Invoice) => void;
  
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, product: Product) => void;

  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
}

export const SUPPORTED_LANGUAGES: { code: Language; name: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'nl', name: 'Nederlands', dir: 'ltr' },
  { code: 'th', name: 'ไทย', dir: 'ltr' },
];

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    invoices: 'Invoices',
    products: 'Products',
    createInvoice: 'Create Invoice',
    settings: 'Settings',
    aiInsights: 'AI Advisor',
    totalRevenue: 'Total Revenue',
    pendingInvoices: 'Pending Invoices',
    activeClients: 'Active Clients',
    recentActivity: 'Recent Activity',
    newInvoice: 'New Invoice',
    clientDetails: 'Client Information',
    companyDetails: 'Company Details',
    items: 'Line Items',
    summary: 'Financial Summary',
    downloadPdf: 'Download PDF',
    save: 'Save Invoice',
    addItem: 'Add Line Item',
    description: 'Description',
    qty: 'Qty',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax (VAT)',
    discount: 'Discount',
    grandTotal: 'Grand Total',
    welcome: 'Welcome back',
    notes: 'Notes & Terms',
    paymentTerms: 'Payment Terms',
    status: 'Status',
    companyName: 'Company Name',
    taxId: 'Tax ID / VAT Number',
    address: 'Address',
    uploadLogo: 'Logo URL',
    signature: 'Digital Signature',
    saveSettings: 'Save Settings',
    addProduct: 'Add Product',
    productName: 'Product Name',
    sku: 'SKU',
    stock: 'Stock',
    uploadImages: 'Upload Images (Max 4)',
    localization: 'Localization',
    pdfPreferences: 'PDF Preferences',
    chatPlaceholder: 'Ask me about your finances, revenue trends, or advice...',
    aiDisclaimer: 'AI can make mistakes. Please verify financial data.'
  },
  ar: {
    dashboard: 'لوحة القيادة',
    invoices: 'الفواتير',
    products: 'المنتجات والخدمات',
    createInvoice: 'إنشاء فاتورة',
    settings: 'الإعدادات',
    aiInsights: 'المستشار المالي',
    totalRevenue: 'إجمالي الإيرادات',
    pendingInvoices: 'فواتير مستحقة',
    activeClients: 'العملاء النشطون',
    recentActivity: 'النشاط الحديث',
    newInvoice: 'فاتورة جديدة',
    clientDetails: 'بيانات العميل',
    companyDetails: 'بيانات الشركة',
    items: 'بنود الفاتورة',
    summary: 'الملخص المالي',
    downloadPdf: 'تصدير PDF',
    save: 'حفظ الفاتورة',
    addItem: 'إضافة بند',
    description: 'الوصف',
    qty: 'الكمية',
    price: 'السعر',
    total: 'الإجمالي',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة (VAT)',
    discount: 'الخصم',
    grandTotal: 'المبلغ النهائي',
    welcome: 'مرحباً بك',
    notes: 'الملاحظات والشروط',
    paymentTerms: 'شروط الدفع',
    status: 'الحالة',
    companyName: 'اسم الشركة',
    taxId: 'الرقم الضريبي',
    address: 'العنوان',
    uploadLogo: 'رابط الشعار',
    signature: 'التوقيع الرقمي',
    saveSettings: 'حفظ الإعدادات',
    addProduct: 'إضافة منتج',
    productName: 'اسم المنتج',
    sku: 'رمز المخزون (SKU)',
    stock: 'المخزون',
    uploadImages: 'صور المنتج (حد أقصى 4)',
    localization: 'اللغة والمنطقة',
    pdfPreferences: 'خيارات الفاتورة',
    chatPlaceholder: 'اسألني عن وضعك المالي، تحليل الإيرادات، أو نصائح...',
    aiDisclaimer: 'قد يخطئ الذكاء الاصطناعي. يرجى مراجعة البيانات المالية.'
  },
  es: {
    dashboard: 'Panel de Control',
    invoices: 'Facturas',
    products: 'Productos',
    createInvoice: 'Nueva Factura',
    settings: 'Configuración',
    aiInsights: 'Asesor IA',
    totalRevenue: 'Ingresos Totales',
    pendingInvoices: 'Pendientes',
    activeClients: 'Clientes Activos',
    recentActivity: 'Actividad Reciente',
    newInvoice: 'Nueva Factura',
    clientDetails: 'Información del Cliente',
    companyDetails: 'Detalles de la Empresa',
    items: 'Ítems',
    summary: 'Resumen Financiero',
    downloadPdf: 'Descargar PDF',
    save: 'Guardar',
    addItem: 'Agregar Ítem',
    description: 'Descripción',
    qty: 'Cant',
    price: 'Precio',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Impuesto (IVA)',
    discount: 'Descuento',
    grandTotal: 'Gran Total',
    welcome: 'Bienvenido',
    notes: 'Notas y Términos',
    paymentTerms: 'Términos de Pago',
    status: 'Estado',
    companyName: 'Nombre de Empresa',
    taxId: 'ID Tributario',
    address: 'Dirección',
    uploadLogo: 'URL del Logo',
    signature: 'Firma Digital',
    saveSettings: 'Guardar Configuración',
    addProduct: 'Agregar Producto',
    productName: 'Nombre del Producto',
    sku: 'SKU',
    stock: 'Existencias',
    uploadImages: 'Subir Imágenes (Máx 4)',
    localization: 'Localización',
    pdfPreferences: 'Preferencias PDF',
    chatPlaceholder: 'Pregúntame sobre tus finanzas...',
    aiDisclaimer: 'La IA puede cometer errores.'
  },
  nl: {
    dashboard: 'Dashboard',
    invoices: 'Facturen',
    products: 'Producten',
    createInvoice: 'Factuur Maken',
    settings: 'Instellingen',
    aiInsights: 'AI Adviseur',
    totalRevenue: 'Totale Omzet',
    pendingInvoices: 'Openstaande Facturen',
    activeClients: 'Actieve Klanten',
    recentActivity: 'Recente Activiteit',
    newInvoice: 'Nieuwe Factuur',
    clientDetails: 'Klantgegevens',
    companyDetails: 'Bedrijfsgegevens',
    items: 'Regels',
    summary: 'Financieel Overzicht',
    downloadPdf: 'PDF Downloaden',
    save: 'Opslaan',
    addItem: 'Regel Toevoegen',
    description: 'Omschrijving',
    qty: 'Aantal',
    price: 'Prijs',
    total: 'Totaal',
    subtotal: 'Subtotaal',
    tax: 'BTW',
    discount: 'Korting',
    grandTotal: 'Totaalbedrag',
    welcome: 'Welkom terug',
    notes: 'Notities & Voorwaarden',
    paymentTerms: 'Betalingsvoorwaarden',
    status: 'Status',
    companyName: 'Bedrijfsnaam',
    taxId: 'BTW Nummer',
    address: 'Adres',
    uploadLogo: 'Logo URL',
    signature: 'Digitale Handtekening',
    saveSettings: 'Instellingen Opslaan',
    addProduct: 'Product Toevoegen',
    productName: 'Productnaam',
    sku: 'SKU',
    stock: 'Voorraad',
    uploadImages: 'Afbeeldingen Uploaden (Max 4)',
    localization: 'Lokalisatie',
    pdfPreferences: 'PDF Voorkeuren',
    chatPlaceholder: 'Vraag me over je financiën...',
    aiDisclaimer: 'AI kan fouten maken.'
  },
  th: {
    dashboard: 'แดชบอร์ด',
    invoices: 'ใบแจ้งหนี้',
    products: 'สินค้า',
    createInvoice: 'สร้างใบแจ้งหนี้',
    settings: 'การตั้งค่า',
    aiInsights: 'ที่ปรึกษา AI',
    totalRevenue: 'รายได้รวม',
    pendingInvoices: 'รอดำเนินการ',
    activeClients: 'ลูกค้าที่ใช้งานอยู่',
    recentActivity: 'กิจกรรมล่าสุด',
    newInvoice: 'ใบแจ้งหนี้ใหม่',
    clientDetails: 'ข้อมูลลูกค้า',
    companyDetails: 'ข้อมูลบริษัท',
    items: 'รายการ',
    summary: 'สรุปทางการเงิน',
    downloadPdf: 'ดาวน์โหลด PDF',
    save: 'บันทึก',
    addItem: 'เพิ่มรายการ',
    description: 'รายละเอียด',
    qty: 'จำนวน',
    price: 'ราคา',
    total: 'รวม',
    subtotal: 'ยอดรวมย่อย',
    tax: 'ภาษีมูลค่าเพิ่ม',
    discount: 'ส่วนลด',
    grandTotal: 'ยอดรวมทั้งสิ้น',
    welcome: 'ยินดีต้อนรับ',
    notes: 'หมายเหตุ',
    paymentTerms: 'เงื่อนไขการชำระเงิน',
    status: 'สถานะ',
    companyName: 'ชื่อบริษัท',
    taxId: 'เลขประจำตัวผู้เสียภาษี',
    address: 'ที่อยู่',
    uploadLogo: 'URL โลโก้',
    signature: 'ลายเซ็นดิจิทัล',
    saveSettings: 'บันทึกการตั้งค่า',
    addProduct: 'เพิ่มสินค้า',
    productName: 'ชื่อสินค้า',
    sku: 'SKU',
    stock: 'สต็อก',
    uploadImages: 'อัปโหลดรูปภาพ (สูงสุด 4)',
    localization: 'การแปลภาษา',
    pdfPreferences: 'การตั้งค่า PDF',
    chatPlaceholder: 'ถามฉันเกี่ยวกับการเงินของคุณ...',
    aiDisclaimer: 'AI อาจทำผิดพลาดได้'
  },
};