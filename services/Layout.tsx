import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Globe,
  PlusCircle,
  BrainCircuit,
  Package
} from 'lucide-react';
import { useStore } from '../store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../types';

const Layout = () => {
  const { theme, toggleTheme, language, setLanguage, companySettings } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const t = TRANSLATIONS[language];
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const isRTL = currentLangObj?.dir === 'rtl';

  // Handle Theme and Direction effects
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Direction & Lang
    root.dir = currentLangObj?.dir || 'ltr';
    root.lang = language;
    
    // Font family adjustment for Arabic
    if (language === 'ar') {
      root.style.fontFamily = "'Cairo', sans-serif";
    } else {
      root.style.fontFamily = "'Inter', sans-serif";
    }

  }, [theme, language, currentLangObj]);

  // Responsive sidebar check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard, path: '/' },
    { icon: FileText, label: t.invoices, path: '/invoices' },
    { icon: Package, label: t.products, path: '/products' },
    { icon: PlusCircle, label: t.createInvoice, path: '/create' },
    { icon: BrainCircuit, label: t.aiInsights, path: '/insights' },
    { icon: Settings, label: t.settings, path: '/settings' },
  ];

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden font-sans`}>
      
      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? '80%' : 300) : (isMobile ? 0 : 100),
          x: isMobile && !sidebarOpen ? (isRTL ? 300 : -300) : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={`fixed lg:relative z-50 h-full bg-white dark:bg-slate-900 border-r dark:border-slate-800 shadow-2xl flex flex-col`}
      >
        <div className={`h-24 flex items-center ${!sidebarOpen && !isMobile ? 'justify-center' : 'px-8'}`}>
          {sidebarOpen ? (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">L</div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Lumina
              </span>
            </motion.div>
          ) : (
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">L</div>
          )}
          
          {isMobile && sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className={`absolute ${isRTL ? 'left-4' : 'right-4'} p-1 text-slate-500`}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              <item.icon size={24} className={`shrink-0 transition-transform duration-300 ${!sidebarOpen && !isMobile ? 'mx-auto' : ''}`} />
              
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap font-semibold text-lg"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Snippet */}
        <div className={`p-6 border-t dark:border-slate-800 ${sidebarOpen ? 'flex items-center gap-4' : 'flex justify-center'}`}>
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-300 border-2 border-white dark:border-slate-800">
                    {companySettings.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            {sidebarOpen && (
                <div className="overflow-hidden">
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">Admin</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{companySettings.name}</p>
                </div>
            )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen bg-slate-50 dark:bg-slate-950 relative">
        {/* Topbar */}
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {navItems.find(i => i.path === location.pathname)?.label}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                    {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative group z-50">
              <button className="h-12 px-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-3 hover:border-indigo-500 transition-all">
                <Globe size={20} />
                <span className="text-sm font-bold uppercase hidden sm:block">{language}</span>
              </button>
              
              <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50`}>
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Language</div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${language === lang.code ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/10' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    <span className="flex items-center gap-2">
                        {lang.name}
                    </span>
                    {language === lang.code && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
          </div>
        </header>

        {/* Page Content Scroll Area */}
        <div className="flex-1 overflow-auto px-4 pb-8 sm:px-8 sm:pb-8 relative scrollbar-hide">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;