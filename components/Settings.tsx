import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Building2, Globe, FileCheck } from 'lucide-react';
import { useStore } from '../store';
import { TRANSLATIONS } from '../types';

const Settings = () => {
  const { language, companySettings, updateCompanySettings } = useStore();
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'company' | 'localization' | 'pdf'>('company');

  const handleChange = (field: string, value: string) => {
    updateCompanySettings({ [field]: value });
  };

  const tabs = [
    { id: 'company', icon: Building2, label: t.companyDetails },
    { id: 'localization', icon: Globe, label: t.localization },
    { id: 'pdf', icon: FileCheck, label: t.pdfPreferences },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.settings}</h1>
         <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md font-medium">
            <Save size={18} />
            {t.saveSettings}
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
                 {tabs.map((tab) => (
                   <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`whitespace-nowrap px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all duration-200
                        ${activeTab === tab.id 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                      `}
                   >
                      <tab.icon size={20} />
                      {tab.label}
                   </button>
                 ))}
            </div>
        </div>

        {/* Main Content Form */}
        <div className="col-span-1 md:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'company' && (
                    <motion.div 
                        key="company"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                            {t.companyDetails}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-2">{t.companyName}</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-medium"
                                    value={companySettings.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2">{t.taxId}</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        value={companySettings.taxId}
                                        onChange={(e) => handleChange('taxId', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        value={companySettings.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-2">{t.address}</label>
                                <textarea 
                                    rows={3}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
                                    value={companySettings.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>
                  )}

                  {activeTab === 'localization' && (
                    <motion.div 
                        key="localization"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                            {t.localization}
                        </h2>
                        <div>
                             <label className="block text-sm font-semibold text-slate-500 mb-2">Currency Symbol</label>
                             <input 
                                type="text" 
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                value={companySettings.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                            />
                        </div>
                        <p className="text-slate-500 text-sm">Language settings are managed via the top bar selector.</p>
                    </motion.div>
                  )}

                  {activeTab === 'pdf' && (
                    <motion.div 
                        key="pdf"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                            {t.pdfPreferences}
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-500 mb-2">{t.uploadLogo}</label>
                            <input 
                                type="text" 
                                placeholder="https://..."
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm"
                                value={companySettings.logoUrl}
                                onChange={(e) => handleChange('logoUrl', e.target.value)}
                            />
                            <p className="text-xs text-slate-400 mt-2">Direct URL for PDF rendering (PNG/JPG).</p>
                        </div>

                         <div>
                            <label className="block text-sm font-semibold text-slate-500 mb-2">{t.signature}</label>
                            <input 
                                type="text" 
                                placeholder="https://..."
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm"
                                value={companySettings.signatureUrl}
                                onChange={(e) => handleChange('signatureUrl', e.target.value)}
                            />
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;