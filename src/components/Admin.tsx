import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc,
  query
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MENU_DATA } from '../data/menu';
import { MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  LogOut, 
  RefreshCcw, 
  Search, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Database,
  Lock
} from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    // Basic local session persistence
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const q = query(collection(db, 'menu'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => doc.data() as MenuItem);
        if (items.length > 0) {
          setMenuItems(items);
        } else {
          setMenuItems(MENU_DATA);
        }
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError(false);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const syncWithStatic = async () => {
    setLoading(true);
    for (const item of MENU_DATA) {
      await setDoc(doc(db, 'menu', item.id), item);
    }
    setLoading(false);
    alert('تم مزامنة البيانات الأصلية مع قاعدة البيانات بنجاح!');
  };

  const updatePrice = async (itemId: string, newPrice: number) => {
    setSavingId(itemId);
    try {
      await updateDoc(doc(db, 'menu', itemId), { price: newPrice });
    } catch (error) {
      console.error("Update failed", error);
      alert('فشل في التحديث. تأكد من أنك تملك صلاحيات المسؤول.');
    } finally {
      setSavingId(null);
    }
  };

  const updateNestedPrice = async (itemId: string, size: string, newPrice: number) => {
    setSavingId(`${itemId}-${size}`);
    try {
      const item = menuItems.find(i => i.id === itemId);
      if (item && item.prices) {
        const updatedPrices = { ...item.prices, [size]: newPrice };
        await updateDoc(doc(db, 'menu', itemId), { prices: updatedPrices });
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setSavingId(null);
    }
  };

  const filteredItems = menuItems.filter(item => 
    item.arabicName.includes(search) || item.id.includes(search)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCcw size={48} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bento-card p-10 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
            <Lock size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-ink arabic mb-2">كلمة المرور</h1>
            <p className="text-muted text-sm arabic">يرجى إدخال كلمة المرور للوصول للإعدادات</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                autoFocus
                type="password"
                placeholder="كلمة المرور"
                className={`w-full bg-white border ${error ? 'border-red-500' : 'border-border'} rounded-2xl py-4 px-6 text-center text-lg focus:ring-2 focus:ring-primary transition-all arabic`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2 arabic font-bold"
                >
                  كلمة المرور غير صحيحة!
                </motion.p>
              )}
            </div>
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all arabic shadow-xl active:scale-95"
            >
              دخول النظام
            </button>
          </form>

          <a href="/" className="inline-flex items-center gap-2 text-primary text-sm font-bold arabic hover:underline">
            <ChevronRight size={16} /> العودة للموقع
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand pb-20">
      <header className="bg-ink text-white sticky top-0 z-50 px-4 py-4 md:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-black font-black">
              HM
            </div>
            <div>
              <h1 className="text-lg font-black arabic leading-none">مدير المطعم</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin Control Panel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={syncWithStatic}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold arabic flex items-center gap-2 transition-all border border-white/10"
            >
              <Database size={14} /> رفع البيانات الافتراضية
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 md:px-8 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white/50 p-6 rounded-3xl border border-border/50">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-black text-muted arabic block mr-2">بحث عن صنف</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="ابحث بالاسم أو المعرف..."
                className="w-full bg-white border border-border rounded-2xl py-4 pr-12 pl-4 text-sm focus:ring-2 focus:ring-primary arabic text-right"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute top-4 right-4 text-muted" size={20} />
            </div>
          </div>
          <div className="bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none mb-1">Items Found</p>
            <p className="text-2xl font-black text-ink leading-none">{filteredItems.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bento-card p-6 flex flex-col gap-6"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black arabic">
                    {item.arabicCategory}
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-ink arabic text-lg">{item.arabicName}</h3>
                    <p className="text-[10px] text-muted font-mono">{item.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.prices ? (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(item.prices).map(([size, price]) => (
                        <div key={size} className="space-y-2">
                          <label className="text-[10px] font-bold text-muted arabic block mr-1">
                            {size === 'quarter' ? 'ربع' : size === 'half' ? 'نص' : size === 'third' ? 'ثمن' : 'كيلو'}
                          </label>
                          <div className="relative">
                            <input 
                              type="number"
                              className="w-full bg-sand/30 border border-border rounded-xl p-3 text-sm font-black text-ink text-left pr-12"
                              defaultValue={price}
                              onBlur={(e) => updateNestedPrice(item.id, size, Number(e.target.value))}
                            />
                            <div className="absolute right-3 top-3.5 text-[10px] text-muted font-bold arabic">ج.م</div>
                            {savingId === `${item.id}-${size}` && (
                              <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="absolute left-2 top-3 text-green-500"
                              >
                                <Save size={14} />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted arabic block mr-1">السعر الأساسي</label>
                      <div className="relative">
                        <input 
                          type="number"
                          className="w-full bg-sand/30 border border-border rounded-xl p-4 text-lg font-black text-primary text-left pr-16"
                          defaultValue={item.price}
                          onBlur={(e) => updatePrice(item.id, Number(e.target.value))}
                        />
                        <div className="absolute right-4 top-4 text-xs text-muted font-black arabic">جنيه مصري</div>
                        {savingId === item.id && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute left-4 top-5 text-green-500"
                          >
                            <Save size={20} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white/20 rounded-[40px] border border-dashed border-border">
            <AlertCircle size={48} className="mx-auto text-muted/30 mb-4" />
            <h3 className="text-xl font-bold text-ink/40 arabic">لم يتم العثور على نتائج</h3>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <a 
          href="/" 
          className="bg-ink text-white px-8 py-4 rounded-full font-black arabic shadow-2xl flex items-center gap-3 hover:scale-105 transition-all text-sm"
        >
          <ChevronRight size={18} /> العودة للمطعم
        </a>
      </div>
    </div>
  );
}
