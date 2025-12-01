import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Invoice, CompanySettings, Product, ChatMessage } from './types';

// Empty state initially for a fresh start
const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'اسم شركتك هنا',
  email: 'info@company.com',
  address: 'الرياض، المملكة العربية السعودية',
  taxId: '',
  logoUrl: '',
  signatureUrl: '',
  currency: 'SAR',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'ar', // Default to Arabic
      invoices: [],
      products: [],
      chatHistory: [],
      companySettings: DEFAULT_COMPANY_SETTINGS,
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (lang) => set({ language: lang }),
      
      addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
      deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((i) => i.id !== id) })),
      updateInvoice: (id, invoice) =>
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === id ? invoice : i)),
        })),
        
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? product : p)),
        })),

      addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
      clearChat: () => set({ chatHistory: [] }),

      updateCompanySettings: (settings) => set((state) => ({
        companySettings: { ...state.companySettings, ...settings }
      })),
    }),
    {
      name: 'lumina-ledger-v3', // Version bump for clean storage
    }
  )
);