import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { TRANSLATIONS } from '../types';
import { TrendingUp, Users, AlertCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { invoices, language, companySettings } = useStore();
  const t = TRANSLATIONS[language];

  const totalRevenue = invoices.reduce((sum, inv) => {
     const sub = inv.items.reduce((s, i) => s + (i.price * i.quantity), 0);
     const total = sub + (sub * (inv.taxRate / 100)) - inv.discount;
     return sum + total;
  }, 0);

  const pendingCount = invoices.filter(i => i.status === 'pending').length;
  const activeClients = new Set(invoices.map(i => i.clientEmail)).size;

  // Mock data generator based on real data would go here, using static mock for visual if empty
  const data = invoices.length > 0 ? invoices.map(i => ({
      name: new Date(i.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' }),
      amt: i.items.reduce((s, x) => s + (x.price * x.quantity), 0)
  })) : [
    { name: 'Jan', amt: 0 },
    { name: 'Feb', amt: 0 },
    { name: 'Mar', amt: 0 },
  ];

  if (invoices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-500"
             >
                 <TrendingUp size={40} />
             </motion.div>
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.welcome}, {companySettings.name}</h1>
             <p className="text-slate-500 max-w-md">Your accounting journey starts here. Create your first invoice to see your financial insights.</p>
             <Link to="/create" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all">
                {t.createInvoice}
             </Link>
        </div>
      );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4"
      >
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.dashboard}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{t.welcome}, <span className="text-indigo-600 font-semibold">{companySettings.name}</span></p>
        </div>
        <Link to="/create" className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold shadow-md hover:scale-105 transition-transform">
            <PlusCircle size={20} />
            {t.newInvoice}
        </Link>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <TrendingUp size={24} />
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 font-bold relative z-10 uppercase tracking-wide text-xs">{t.totalRevenue}</h3>
            </div>
            
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 relative z-10">{companySettings.currency} {totalRevenue.toFixed(2)}</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
        >
             <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 dark:bg-orange-900/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl text-orange-600 dark:text-orange-400">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 font-bold relative z-10 uppercase tracking-wide text-xs">{t.pendingInvoices}</h3>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 relative z-10">{pendingCount}</p>
        </motion.div>

         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-900 to-indigo-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden"
        >
            <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-white/10 rounded-xl text-indigo-200">
                    <Users size={24} />
                 </div>
                 <h3 className="text-indigo-200 font-bold relative z-10 uppercase tracking-wide text-xs">{t.activeClients}</h3>
            </div>
            <p className="text-4xl font-extrabold mt-2 relative z-10">{activeClients}</p>
            <div className="absolute bottom-[-30px] right-[-30px] opacity-10 rotate-12">
               <TrendingUp size={180} />
            </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-[450px]"
        >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} dx={-10} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', padding: '10px 15px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="amt" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
        
        <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.recentActivity}</h3>
            <div className="space-y-4">
                {invoices.slice(0, 5).map((inv, idx) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105
                                ${idx % 2 === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'}
                            `}>
                                {inv.clientName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-900 dark:text-white">{inv.clientName}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{inv.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-slate-900 dark:text-white">{companySettings.currency} {inv.items.reduce((a,b)=>a+(b.price*b.quantity),0).toFixed(0)}</p>
                             <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mt-1
                                ${inv.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}
                            `}>
                                {inv.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;