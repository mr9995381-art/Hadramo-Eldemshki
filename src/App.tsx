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
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].arabicName);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'items' | 'checkout'>('items');
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return MENU_DATA.filter(item => {
      const matchesCategory = item.arabicCategory === activeCategory;
      const matchesSearch = item.arabicName.includes(searchQuery) || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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

  return (
    <div className="min-h-screen rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex flex-col items-center justify-center text-white shadow-lg border border-accent/10">
                <UtensilsCrossed size={14} className="mb-[-1px]" />
              </div>
              <div className="text-right">
                <h1 className="text-lg font-black text-primary arabic tracking-tight leading-none">حضرموت الدمشقي</h1>
                <p className="text-[7px] text-accent font-black uppercase tracking-widest arabic leading-none">أصل المندي والمشوي</p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8 relative hidden md:block">
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text" 
                placeholder="ماذا تحب أن تأكل اليوم؟"
                className="w-full bg-white border border-border rounded-[12px] py-2.5 pr-12 pl-4 focus:ring-2 focus:ring-primary/10 transition-all text-sm arabic text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setCartStep('items');
                  setIsCartOpen(true);
                }}
                className="relative p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-md"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner - Bento Featured Card style */}
        <div className="relative rounded-3xl overflow-hidden mb-12 h-40 lg:h-48 bg-primary shadow-2xl border border-white/10 flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-90" />
          
          <div className="relative z-10 px-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 arabic leading-[1.1]">حضرموت الدمشقي<br/><span className="text-accent underline decoration-accent/30 underline-offset-4">أصل المندي والمشوي</span></h2>
              <p className="text-white/60 text-[11px] sm:text-sm mb-6 arabic mx-auto max-w-lg">أشهى المأكولات اليمنية والشامية الأصيلة في قلب طنطا. خبرة سنين في فن المندي والمشويات على أصولها.</p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => {
                    const menuSection = document.getElementById('menu-section');
                    menuSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-accent hover:bg-white text-black font-black px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg active:scale-95 arabic"
                >
                  تصفح القائمة
                </button>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-full text-white text-[10px] border border-white/5">
                  <Clock size={14} className="text-accent" />
                  <span className="arabic font-bold">توصيل سريع داخل طنطا</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div id="menu-section" className="flex flex-col lg:flex-row gap-10">
          {/* Main Menu Grid Area */}
          <div className="flex-1">
            {/* Categories Navigation - Tabs style */}
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-8 sticky top-24 z-30 bg-sand/80 backdrop-blur-sm py-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.arabicName}
                  onClick={() => setActiveCategory(cat.arabicName)}
                  className={`whitespace-nowrap px-6 py-3 rounded-[12px] text-sm font-bold transition-all duration-300 arabic border
                    ${activeCategory === cat.arabicName 
                      ? 'bg-primary border-primary text-white shadow-lg' 
                      : 'bg-white border-border text-muted hover:text-primary hover:border-primary/30'}`}
                >
                  {cat.arabicName}
                </button>
              ))}
            </div>

            {/* Menu Items Grid - Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bento-card group hover:shadow-xl transition-all duration-500 overflow-hidden relative flex flex-col text-right"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-ink arabic">{item.arabicName}</h3>
                        <UtensilsCrossed size={16} className="text-primary/20" />
                      </div>
                      {item.arabicDescription && (
                        <p className="text-muted text-[11px] mb-6 arabic leading-relaxed">{item.arabicDescription}</p>
                      )}
                      
                      <div className="mt-auto">
                        {!item.prices && (
                          <div className="flex justify-center mb-4">
                            <span className="text-2xl font-black text-primary">{item.price} <span className="text-xs arabic font-bold text-muted">جنيه</span></span>
                          </div>
                        )}
                        {item.prices ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(item.prices).map(([size, price]) => (
                                <button
                                  key={size}
                                  onClick={() => addToCart(item, size as any)}
                                  className="flex justify-between items-center bg-sand/50 hover:bg-primary hover:text-white p-3 rounded-[12px] transition-all group/btn border border-border/50"
                                >
                                  <span className="text-sm font-black">{price} <span className="text-[10px]">ج.م</span></span>
                                  <span className="text-[11px] font-bold arabic">{sizeLabels[size]}</span>
                                </button>
                              ))}
                            </div>
                            <p className="text-[10px] text-muted text-center arabic italic">اختر الحجم للإضافة للحقيبة</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => addToCart(item)}
                              className="flex items-center justify-center gap-2 bg-sand hover:bg-primary hover:text-white py-3 rounded-[12px] transition-all arabic border border-border/50"
                            >
                              <Plus size={16} />
                              <span className="text-xs font-black">أضف للحقيبة</span>
                            </button>
                            <button 
                              onClick={() => {
                                addToCart(item);
                                setCartStep('checkout');
                                setIsCartOpen(true);
                              }}
                              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-black py-3 rounded-[12px] transition-all arabic shadow-lg shadow-accent/10"
                            >
                              <ShoppingCart size={16} />
                              <span className="text-xs font-black">طلب مباشر</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Stats Area (New added for Bento look) */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bento-card p-6">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 arabic border-b border-border pb-2">تفاصيل الخدمة</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted arabic mb-1">وقت التوصيل المتوقع</h4>
                  <div className="text-2xl font-black text-ink">٣٥ - ٤٥ دقيقة</div>
                  <p className="text-[10px] text-muted arabic">طنطا - شارع البحر - بجوار صيدناوي</p>
                  <p className="text-[9px] text-accent font-bold arabic mt-1">⚠️ ليس للمطعم فروع أخرى بطنطا</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-bold text-muted arabic mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    حالة المطعم
                  </h4>
                  <div className="text-2xl font-black text-ink">مفتوح الآن</div>
                  <p className="text-[10px] text-muted arabic">نستقبل طلباتكم حتى ١:٠٠ صباحاً</p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Cart Drawer - Using Dark Theme from Bento design */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-ink text-white z-50 shadow-2xl flex flex-col text-right"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {cartStep === 'checkout' && (
                    <button 
                      onClick={() => setCartStep('items')}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-accent mr-2"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}
                  <div className="bg-accent p-2.5 rounded-xl text-black">
                    <ShoppingCart size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold arabic text-white">
                      {cartStep === 'items' ? 'حقيبة الطلبات' : 'بيانات التوصيل'}
                    </h2>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase">
                      {cartStep === 'items' ? 'Your Current Selection' : 'Delivery Information'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-accent/20 mb-8 border border-white/5">
                      <ShoppingCart size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-white arabic mb-2">الحقيبة فارغة تماماً</h3>
                    <p className="text-white/40 text-xs arabic">لا تتردد في إضافة ما تشتهيه من قائمتنا المميزة</p>
                  </div>
                ) : cartStep === 'checkout' ? (
                  <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <h4 className="text-accent font-black text-xs uppercase tracking-widest mb-4 arabic">ملخص سريع للطلب</h4>
                      <div className="space-y-3">
                        {cart.map(item => (
                          <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-xs bg-black/20 p-3 rounded-xl border border-white/5">
                            <span className="text-accent font-black">{item.finalPrice * item.quantity} ج.م</span>
                            <span className="text-white/80 arabic">{item.arabicName} × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="bg-black/40 rounded-3xl p-6 space-y-4 border border-white/5">
                        <input 
                          required
                          type="text" 
                          placeholder="الاسم لخدمة التوصيل"
                          className="w-full bg-white/5 border border-white/10 rounded-[12px] p-4 text-sm focus:ring-1 focus:ring-accent text-white arabic text-right placeholder:text-white/20"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        />
                        <input 
                          required
                          type="tel" 
                          placeholder="رقم الهاتف للتواصل"
                          className="w-full bg-white/5 border border-white/10 rounded-[12px] p-4 text-sm focus:ring-1 focus:ring-accent text-white arabic text-right placeholder:text-white/20"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        />
                        <input 
                          required
                          type="text" 
                          placeholder="تفاصيل العنوان بدقة"
                          className="w-full bg-white/5 border border-white/10 rounded-[12px] p-4 text-sm focus:ring-1 focus:ring-accent text-white arabic text-right placeholder:text-white/20"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        />
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isOrderComplete}
                        className="w-full bg-accent hover:bg-accent-dark text-black font-black py-5 rounded-[16px] flex items-center justify-center gap-3 arabic shadow-xl transition-all"
                      >
                        {isOrderComplete ? 'جاري تجهيز طلبك بامتياز ✅' : 'إتمام الطلب والدفع'}
                      </motion.button>
                    </form>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-5 group">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 shrink-0 border border-white/10 flex items-center justify-center text-accent/20">
                        <UtensilsCrossed size={24} />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white arabic text-sm">{item.arabicName}</h4>
                          <button 
                            onClick={() => removeFromCart(`${item.id}-${item.selectedSize || 'none'}`)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        {item.selectedSize && (
                          <span className="text-[9px] bg-accent/20 text-accent self-start px-2.5 py-1 rounded-lg font-black uppercase mb-3">
                             {sizeLabels[item.selectedSize]}
                          </span>
                        )}
                        <div className="mt-auto flex justify-between items-center">
                          <span className="font-black text-accent text-lg">{item.finalPrice * item.quantity} <span className="text-[10px]">ج.م</span></span>
                          <div className="flex items-center bg-white/5 rounded-xl p-1 gap-4 border border-white/10">
                            <button 
                              onClick={() => updateQuantity(`${item.id}-${item.selectedSize || 'none'}`, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white"
                            >
                              <Plus size={14} />
                            </button>
                            <span className="font-bold text-sm min-w-[2ch] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(`${item.id}-${item.selectedSize || 'none'}`, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white"
                            >
                              <Minus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && cartStep === 'items' && (
                <div className="p-8 border-t border-white/10 bg-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 arabic text-lg">إجمالي السعر</span>
                    <span className="text-3xl font-black text-accent">{cartTotal} ج.م</span>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCartStep('checkout')}
                    className="w-full bg-accent hover:bg-accent-dark text-black font-black py-5 rounded-[16px] flex items-center justify-center gap-3 arabic shadow-xl transition-all"
                  >
                    أتمم الطلب
                  </motion.button>
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
