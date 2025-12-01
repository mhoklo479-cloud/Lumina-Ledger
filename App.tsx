import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import AIFinancialAdvisor from './components/AIFinancialAdvisor';
import Settings from './components/Settings';
import Products from './components/Products';

// Placeholder for invoice list
const InvoiceList = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold dark:text-white mb-4">All Invoices</h2>
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center py-20">
        <p className="text-slate-500">List view with filters coming soon.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<InvoiceForm />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="products" element={<Products />} />
          <Route path="insights" element={<AIFinancialAdvisor />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;