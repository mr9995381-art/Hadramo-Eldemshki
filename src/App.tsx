import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Search as SearchIcon, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  ChevronLeft,
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { MENU_DATA, CATEGORIES } from './data/menu';
import { MenuItem, CartItem } from './types';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[1].arabicName); // Default to first proper category
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'items' | 'checkout'>('items');
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [menuData] = useState<MenuItem[]>(MENU_DATA);
  
  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return menuData.filter(item => {
      const matchesCategory = item.arabicCategory === activeCategory;
      const matchesSearch = item.arabicName.includes(searchQuery) || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, menuData]);

  const addToCart = (item: MenuItem, size?: 'quarter' | 'third' | 'half' | 'kilo') => {
    const finalPrice = size && item.prices ? item.prices[size]! : (item.price || 0);
    const cartId = `${item.id}-${size || 'none'}`;
    
    setCart(prev => {
      const existing = prev.find(i => `${i.id}-${i.selectedSize || 'none'}` === cartId);
      if (existing) {
        return prev.map(i => `${i.id}-${i.selectedSize || 'none'}` === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, selectedSize: size, finalPrice }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => `${i.id}-${i.selectedSize || 'none'}` !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (`${i.id}-${i.selectedSize || 'none'}` === cartId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    const restaurantPhone = '201000520345'; // Updated from flyer
    
    const message = `*طلب جديد من مطعم حضرموت الدمشقي* 🍖
-----------------------------------
*بيانات العميل:*
👤 الاسم: ${customerInfo.name}
📱 الهاتف: ${customerInfo.phone}
📍 العنوان: ${customerInfo.address}

*تفاصيل الطلب:*
${cart.map(item => `• ${item.arabicName} ${item.selectedSize ? `(${sizeLabels[item.selectedSize]})` : ''} x${item.quantity} = ${item.finalPrice * item.quantity} ج.م`).join('\n')}

*الإجمالي:* ${cartTotal} ج.م
-----------------------------------
شكراً لاختياركم حضرموت الدمشقي!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    setIsOrderComplete(true);
    setCart([]);
    setTimeout(() => {
      setIsOrderComplete(false);
      setIsCartOpen(false);
    }, 4000);
  };

  const sizeLabels: Record<string, string> = {
    quarter: 'ربع',
    third: 'ثلث',
    half: 'نصف',
    kilo: 'كيلو'
  };

  if (isOrderComplete) {
    // Show order success state if needed, or just stay on home
  }

  return (
    <div className="min-h-screen bg-sand dots-pattern selection:bg-primary/10 selection:text-primary" dir="rtl">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                <UtensilsCrossed size={20} />
              </div>
              <div className="text-right flex flex-col justify-center">
                <h1 className="text-xl font-black text-ink arabic leading-none">حضرموت الدمشقي</h1>
                <p className="text-[9px] text-primary font-bold uppercase tracking-[0.2em] arabic mt-0.5">HADRAMOUT AL DAMASHQI</p>
              </div>
            </div>

            <div className="flex-1 max-w-sm mx-12 relative hidden lg:block">
              <input 
                type="text" 
                placeholder="ابحث عن وجبتك المفضلة..."
                className="w-full bg-sand/50 border border-border rounded-2xl py-2.5 pr-12 pl-4 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-sm arabic text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setCartStep('items');
                  setIsCartOpen(true);
                }}
                className="group relative p-3 bg-ink text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-accent text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-24">
        {/* Massive Typographic Hero */}
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center space-y-10 py-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none"
          >
            <div className="w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -ml-32 -mt-32" />
          </motion.div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 bg-white/60 border border-border px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.3em] arabic text-primary-dark uppercase shadow-sm"
            >
              <Clock size={16} /> المذاق الأصيل منذ سنوات
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black text-ink heading-tight arabic"
            >
              عراقة المندي <br />
              <span className="text-primary-dark serif italic">وفن المشوي</span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl text-lg md:text-xl text-muted arabic font-medium leading-relaxed mx-auto italic opacity-80"
          >
            "أشهى المأكولات اليمنية والشامية الأصيلة في قلب طنطا، حيث يلتقي التراث مع الإبداع في كل وجبة."
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-6 justify-center"
          >
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-ink text-white px-12 py-5 rounded-[28px] font-black text-lg transition-all shadow-2xl hover:bg-primary-dark hover:scale-105 active:scale-95 arabic"
            >
              تصفح القائمة
            </button>
            <div className="flex items-center gap-4 text-ink font-bold arabic bg-white px-8 py-5 rounded-[28px] shadow-sm border border-border">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              توصيل سريع داخل طنطا
            </div>
          </motion.div>
        </section>

        <div id="menu-section" className="space-y-12">
          {/* Categories Navigation */}
          <section className="sticky top-[64px] z-40 -mx-4 md:-mx-8 px-4 md:px-8 bg-sand/90 backdrop-blur-xl py-6 border-y border-border/50">
            <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar flex items-center gap-5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.arabicName}
                  onClick={() => setActiveCategory(cat.arabicName)}
                  className={`whitespace-nowrap px-8 py-4 rounded-2xl text-sm font-black transition-all duration-500 arabic ${
                    activeCategory === cat.arabicName
                      ? 'bg-primary-dark text-white shadow-2xl shadow-primary/40 translate-y-[-2px]'
                      : 'bg-white border border-border text-muted hover:border-primary/30 hover:text-ink shadow-sm'
                  }`}
                >
                  {cat.arabicName}
                </button>
              ))}
            </div>
          </section>

          {/* Menu Items Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="bento-card group flex flex-col h-full bg-white border border-border/50 hover:border-primary/30 relative"
                >
                  <div className="p-10 flex flex-col h-full space-y-8">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark bg-primary/10 px-4 py-2 rounded-xl arabic">
                        {item.arabicCategory}
                      </span>
                      <div className="w-12 h-12 bg-sand rounded-2xl flex items-center justify-center text-muted group-hover:bg-primary-dark group-hover:text-white transition-all duration-500 shadow-sm border border-border/50 rotate-3 group-hover:rotate-0">
                        <UtensilsCrossed size={22} />
                      </div>
                    </div>

                    <div className="space-y-4 flex-grow text-right">
                      <h3 className="text-3xl font-black text-ink arabic leading-tight group-hover:text-primary-dark transition-colors">{item.arabicName}</h3>
                      {item.arabicDescription && (
                        <p className="text-sm text-muted arabic leading-relaxed opacity-70 font-medium">{item.arabicDescription}</p>
                      )}
                    </div>

                    <div className="mt-auto pt-10 border-t border-sand-dark/50">
                      {!item.prices && (
                        <div className="flex items-baseline justify-center gap-3 mb-8">
                          <span className="text-6xl font-black text-ink serif leading-none">{item.price}</span>
                          <span className="text-xs font-black text-muted arabic uppercase tracking-[0.2em] opacity-60">ج.م</span>
                        </div>
                      )}

                      {item.prices ? (
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(item.prices).map(([size, p]) => (
                            <button
                              key={size}
                              onClick={() => addToCart(item, size as any)}
                              className="flex flex-col items-center justify-center p-5 bg-sand/30 rounded-3xl border border-transparent hover:border-primary/30 hover:bg-white hover:shadow-2xl transition-all group/btn active:scale-95"
                            >
                              <span className="text-[10px] font-black text-muted arabic mb-1.5 opacity-60 uppercase tracking-widest">{sizeLabels[size]}</span>
                              <span className="text-xl font-black text-ink serif">{p} <span className="text-[10px] arabic">ج.م</span></span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              addToCart(item);
                              setCartStep('checkout');
                              setIsCartOpen(true);
                            }}
                            className="bg-sand text-ink px-4 py-5 rounded-[24px] font-black text-xs hover:bg-ink hover:text-white transition-all active:scale-95 arabic border border-border/50 shadow-sm"
                          >
                            اطلب الآن
                          </button>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-primary-dark text-white px-4 py-5 rounded-[24px] font-black text-xs hover:bg-ink transition-all shadow-xl hover:shadow-primary/30 active:scale-95 arabic"
                          >
                            أضف للحقيبة
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          {/* Additional Info Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bento-card p-8 flex flex-col gap-4 text-right">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h4 className="text-lg font-black arabic">العنوان</h4>
              <p className="text-sm text-muted arabic">طنطا - شارع النادي - امام نادي طنطا الرياضي</p>
            </div>
            <div className="bento-card p-8 flex flex-col gap-4 text-right">
              <div className="w-12 h-12 bg-primary/10 text-primary-dark rounded-2xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <h4 className="text-lg font-black arabic">اتصل بنا</h4>
              <p className="text-sm text-muted arabic leading-loose">01000520345 <br/> 01000520346</p>
            </div>
            <div className="bento-card p-8 flex flex-col gap-4 text-right">
              <div className="w-12 h-12 bg-ink/5 text-ink rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h4 className="text-lg font-black arabic">ساعات العمل</h4>
              <p className="text-sm text-muted arabic">يومياً من الساعة 12 ظهراً حتى 1 صباحاً</p>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Cart Summary Bar */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-3 left-3 right-3 z-40 md:left-auto md:right-8 md:w-80"
          >
            <button 
              onClick={() => {
                setCartStep('items');
                setIsCartOpen(true);
              }}
              className="w-full bg-ink text-white p-3 rounded-[20px] shadow-2xl border border-white/10 flex items-center justify-between group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-accent text-black w-10 h-10 rounded-xl flex items-center justify-center font-black">
                  {cartCount}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Bag</p>
                  <p className="text-lg font-black text-accent">{cartTotal} ج.م</p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10 arabic font-bold text-sm bg-white/5 px-4 py-2 rounded-xl">
                عرض الحقيبة
                <ChevronLeft size={16} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer - Premium Design */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-ink/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white text-ink z-[70] shadow-2xl flex flex-col text-right"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-sand/30">
                <div className="flex items-center gap-4">
                  {cartStep === 'checkout' && (
                    <button 
                      onClick={() => setCartStep('items')}
                      className="p-2.5 bg-sand rounded-xl hover:bg-border transition-colors text-ink"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-2xl font-black arabic leading-none">
                      {cartStep === 'items' ? 'حقيبة الطلبات' : 'إتمام الطلب'}
                    </h2>
                    <p className="text-[9px] text-muted font-black tracking-widest uppercase mt-1">
                      {cartStep === 'items' ? 'Your Gourmet Bag' : 'Shipping Details'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 bg-sand rounded-xl hover:bg-border transition-colors text-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-24 h-24 bg-sand rounded-[40px] flex items-center justify-center text-primary/20 rotate-12">
                      <ShoppingCart size={48} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-ink arabic mb-2">الحقيبة فارغة</h3>
                      <p className="text-muted text-sm arabic opacity-70">استكشف منيو طنطا الأصيل الآن</p>
                    </div>
                  </div>
                ) : cartStep === 'checkout' ? (
                  <div className="space-y-8">
                    <div className="bg-sand/50 p-8 rounded-[32px] border border-border space-y-6">
                      <h4 className="text-xs font-black text-primary-dark uppercase tracking-widest border-b border-border pb-4 arabic">ملخص سريع للطلب</h4>
                      <div className="space-y-4">
                        {cart.map(item => (
                          <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center text-sm font-bold">
                            <span className="serif text-lg">{item.finalPrice * item.quantity} <span className="text-[10px] arabic">ج.م</span></span>
                            <span className="arabic text-muted">{item.arabicName} {item.selectedSize ? `(${sizeLabels[item.selectedSize]})` : ''} × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <form onSubmit={handleCheckout} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted arabic mr-4">اسم العميل</label>
                          <input required type="text" placeholder="الاسم الكامل" className="w-full bg-sand/30 border border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary-dark transition-all arabic" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted arabic mr-4">رقم الهاتف</label>
                          <input required type="tel" placeholder="01xxxxxxxxx" className="w-full bg-sand/30 border border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary-dark transition-all text-center font-bold" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted arabic mr-4">عنوان التوصيل في طنطا</label>
                          <textarea required placeholder="الحي، الشارع، رقم العمارة..." rows={3} className="w-full bg-sand/30 border border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary-dark transition-all arabic" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
                        </div>
                      </div>
                      
                      <button type="submit" className="w-full bg-ink text-white py-6 rounded-[28px] font-black text-lg shadow-2xl hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all arabic">
                        ارسل الطلب عبر واتساب
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="bg-sand/20 border border-border p-6 rounded-3xl flex items-center gap-4 text-right">
                        <div className="flex-1 space-y-1">
                          <h4 className="font-black text-ink arabic text-lg leading-tight">{item.arabicName}</h4>
                          <p className="text-[10px] font-bold text-muted arabic uppercase tracking-widest">
                            {item.selectedSize ? sizeLabels[item.selectedSize] : 'وجبة كاملة'} — {item.finalPrice} ج.م
                          </p>
                          <div className="flex items-center gap-3 mt-4">
                            <button onClick={() => updateQuantity(`${item.id}-${item.selectedSize || 'none'}`, -1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors"><Minus size={14}/></button>
                            <span className="font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(`${item.id}-${item.selectedSize || 'none'}`, 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors"><Plus size={14}/></button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(`${item.id}-${item.selectedSize || 'none'}`)} className="text-muted hover:text-red-500 p-2"><X size={20}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && cartStep === 'items' && (
                <div className="p-8 border-t border-border bg-sand/30 space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-3xl font-black serif">{cartTotal} <span className="text-xs font-black arabic text-muted uppercase tracking-widest">ج.م</span></span>
                    <span className="text-sm font-black text-muted arabic uppercase tracking-widest">إجمالي الطلب</span>
                  </div>
                  <button 
                    onClick={() => setCartStep('checkout')}
                    className="w-full bg-primary-dark text-white py-6 rounded-[28px] font-black text-lg shadow-xl hover:bg-ink hover:scale-[1.02] active:scale-95 transition-all arabic"
                  >
                    أتمم الطلب
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer Bar - Bento style */}
      <footer className="bg-white border-t border-border py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-right flex flex-col items-center md:items-start">
            <h3 className="text-lg font-black text-primary arabic">حضرموت الدمشقي</h3>
            <p className="text-muted text-[11px] arabic">جميع الحقوق محفوظة © ٢٠٢٤ مطعم حضرموت الدمشقي</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 text-[11px] font-bold text-muted uppercase tracking-widest arabic items-center">
             <span className="hover:text-accent cursor-pointer transition-colors flex flex-col items-center md:items-start gap-1">
               <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                طنطا - شارع البحر - بجوار صيدناوي
               </div>
               <span className="text-[9px] text-accent">ليس للمطعم فروع أخرى بطنطا</span>
              </span>
             <div className="flex flex-col items-center md:items-start gap-1">
               <span className="hover:text-accent cursor-pointer transition-colors flex items-center gap-2">
                 <Phone size={14} className="text-primary" />
                 ٠١٠٠٠٥٢٠٣٤٥ - ٠١٢٧١١٩٤٩٤٤
               </span>
               <span className="text-[9px] text-muted">٠٤٠٣٤١٥٢٤٤ - ٠٤٠٣٣٥٨٠٨٤</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
