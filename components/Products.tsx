import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Package, Image as ImageIcon, Trash2, Edit2, X } from 'lucide-react';
import { useStore } from '../store';
import { Product, TRANSLATIONS } from '../types';

const Products = () => {
  const { products, addProduct, deleteProduct, updateProduct, language, companySettings } = useStore();
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSku('');
    setPrice('');
    setStock('');
    setDescription('');
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (images.length >= 4) {
        alert("Maximum 4 images allowed");
        return;
      }

      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages(prev => [...prev, reader.result as string].slice(0, 4));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editingId || Date.now().toString(),
      name,
      sku: sku || `SKU-${Math.floor(Math.random() * 1000)}`,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      description,
      images
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setSku(product.sku);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDescription(product.description);
    setImages(product.images);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t.products}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your inventory and services</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 font-bold"
        >
          <Plus size={20} />
          {t.addProduct}
        </button>
      </div>

      {/* Search & Grid */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
          <p className="text-slate-500">Start by adding your first product or service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col"
            >
              {/* Image Area */}
              <div className="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(product)} className="p-2 bg-white/90 backdrop-blur rounded-full text-indigo-600 hover:bg-indigo-50 shadow-sm"><Edit2 size={16} /></button>
                  <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-50 shadow-sm"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{product.sku}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold">{t.price}</span>
                    <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{companySettings.currency} {product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-400 uppercase font-bold">{t.stock}</span>
                    <span className={`text-sm font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>{product.stock} units</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingId ? 'Edit Product' : t.addProduct}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Images */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.uploadImages}</label>
                    <div className="grid grid-cols-4 gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      {images.length < 4 && (
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                        >
                          <Plus size={24} />
                        </button>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.productName}</label>
                      <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.sku}</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" value={sku} onChange={e => setSku(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.price}</label>
                      <input required type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.stock}</label>
                      <input required type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" value={stock} onChange={e => setStock(e.target.value)} />
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.description}</label>
                     <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none" value={description} onChange={e => setDescription(e.target.value)} />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">Save Product</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;