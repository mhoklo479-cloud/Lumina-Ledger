import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Download, FileText, User, Calendar, CreditCard, AlignLeft, Hash } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useStore } from '../store';
import { Invoice, TRANSLATIONS, LineItem } from '../types';
import InvoicePDF from './PDFDocument';

const InvoiceForm = () => {
  const { language, addInvoice, companySettings } = useStore();
  const t = TRANSLATIONS[language];
  const isRTL = language === 'ar';

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(15);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ]);
  const [lastSavedInvoice, setLastSavedInvoice] = useState<Invoice | null>(null);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + (sub * (taxRate / 100)) - discount;
  };

  const handleSave = () => {
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      clientName,
      clientEmail,
      clientAddress,
      date,
      dueDate,
      items,
      taxRate,
      discount,
      status: 'pending',
      currency: companySettings.currency,
      notes,
      paymentTerms
    };
    addInvoice(newInvoice);
    setLastSavedInvoice(newInvoice);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-8 pb-32"
    >
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.createInvoice}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create professional invoices in seconds.</p>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          {lastSavedInvoice && (
             <PDFDownloadLink
                document={<InvoicePDF invoice={lastSavedInvoice} settings={companySettings} language={language} />}
                fileName={`invoice-${lastSavedInvoice.id}.pdf`}
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold shadow-sm"
             >
                {({ loading }) => (
                    <>
                        <Download size={20} />
                        {loading ? 'Generating...' : t.downloadPdf}
                    </>
                )}
             </PDFDownloadLink>
          )}
          <button 
            onClick={handleSave}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 font-bold text-lg"
          >
            <Save size={20} />
            {t.save}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Invoice Details */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Card 1: Client & Meta */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        <User size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.clientDetails}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Client Name / Company"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                         <input 
                            type="email" 
                            placeholder="Email Address"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <textarea 
                            placeholder="Billing Address..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2">{t.newInvoice} Date</label>
                        <div className="relative">
                            <Calendar className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-3.5 text-slate-400`} size={20} />
                            <input 
                                type="date" 
                                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white dark:[color-scheme:dark]`}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2">Due Date</label>
                        <div className="relative">
                            <Calendar className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-3.5 text-slate-400`} size={20} />
                            <input 
                                type="date" 
                                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white dark:[color-scheme:dark]`}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Items */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                            <Hash size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.items}</h3>
                    </div>
                </div>

                <div className="space-y-4">
                     {/* Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <div className="col-span-6">{t.description}</div>
                        <div className="col-span-2 text-center">{t.qty}</div>
                        <div className="col-span-2 text-right">{t.price}</div>
                        <div className="col-span-2 text-right">{t.total}</div>
                    </div>

                    {/* Dynamic Rows */}
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <motion.div 
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                            >
                                <div className="col-span-1 md:col-span-6">
                                    <label className="md:hidden text-xs font-bold text-slate-400 mb-1 block">{t.description}</label>
                                    <textarea
                                        rows={1}
                                        placeholder="Item details..."
                                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-800 dark:text-white font-medium resize-none placeholder-slate-400"
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="md:hidden text-xs font-bold text-slate-400 mb-1 block">{t.qty}</label>
                                    <input 
                                        type="number"
                                        min="1"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                     <label className="md:hidden text-xs font-bold text-slate-400 mb-1 block">{t.price}</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        value={item.price}
                                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 text-right pt-2 md:pt-3">
                                    <label className="md:hidden text-xs font-bold text-slate-400 mb-1 block">{t.total}</label>
                                    <span className="text-slate-900 dark:text-white font-bold text-lg">
                                        {(item.quantity * item.price).toFixed(2)}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="absolute -right-2 -top-2 md:top-auto md:bottom-auto md:right-[-40px] md:translate-y-2 p-2 bg-white dark:bg-slate-800 rounded-full text-red-500 shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <button 
                        onClick={handleAddItem}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                        <Plus size={20} />
                        {t.addItem}
                    </button>
                </div>
            </div>

            {/* Card 3: Notes & Terms */}
             <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                        <AlignLeft size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.notes}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2">Internal/Public Notes</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
                            placeholder="Add notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2">{t.paymentTerms}</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
                            placeholder="Net 30, Bank Transfer details..."
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value)}
                        />
                    </div>
                </div>
             </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                        <CreditCard size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.summary}</h3>
                </div>

                <div className="space-y-4">
                     <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="font-medium">{t.subtotal}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{companySettings.currency} {calculateSubtotal().toFixed(2)}</span>
                     </div>

                     <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{t.tax} (%)</span>
                        <input 
                            type="number"
                            className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-right focus:ring-indigo-500 outline-none dark:text-white"
                            value={taxRate}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        />
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{t.discount}</span>
                        <input 
                            type="number"
                            className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-right focus:ring-indigo-500 outline-none dark:text-white"
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        />
                     </div>

                     <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>

                     <div className="flex justify-between items-end">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{t.grandTotal}</span>
                        <div className="text-right">
                             <p className="text-sm text-slate-500 dark:text-slate-500 mb-1">{companySettings.currency}</p>
                             <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{calculateTotal().toFixed(2)}</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceForm;