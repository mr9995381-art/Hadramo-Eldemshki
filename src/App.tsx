import React, { useState, useMemo, useEffect } from 'react';
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
  Phone,
  Instagram,
  Facebook,
  Home,
  Sparkles,
  Info,
  Share2,
  Trash2,
  PhoneCall,
  Smartphone,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { MENU_DATA, CATEGORIES } from './data/menu';
import { MenuItem, CartItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'contact'>('home');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[1].arabicName); 
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'items' | 'checkout'>('items');
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [menuData] = useState<MenuItem[]>(MENU_DATA);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [selectedItemForOptions, setSelectedItemForOptions] = useState<MenuItem | null>(null);

  // Desktop Simulator state
  const [useSimulator, setUseSimulator] = useState(true);

  // Device mode state (support both Android and iOS simulator)
  const [deviceType, setDeviceType] = useState<'android' | 'ios'>('android');

  // Android and iOS interactive states
  const [androidInstallStatus, setAndroidInstallStatus] = useState<'not_installed' | 'installing' | 'installed'>('not_installed');
  const [iosInstallStatus, setIosInstallStatus] = useState<'not_installed' | 'installing' | 'installed'>('not_installed');
  const [installProgress, setInstallProgress] = useState(0);
  const [showAndroidHome, setShowAndroidHome] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Digital Clock state for simulated status bar
  const [currentTime, setCurrentTime] = useState('10:43');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      setCurrentTime(`${hours}:${minutesStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  // Set up sequential push notifications after checkout
  useEffect(() => {
    if (isOrderComplete) {
      // Trigger checkout notification
      setActiveNotification('🛒 تم إرسال طلبك لواتساب بنجاح! جاري التجهيز... 🔥');
      
      const timer = setTimeout(() => {
        setActiveNotification('🛵 مندوب حضرموت الدمشقي استلم طلبك وهو في طريقه لعنوانك بطنطا! 🌟');
      }, 7000);

      const closeTimer = setTimeout(() => {
        setActiveNotification(null);
      }, 15000);

      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOrderComplete]);

  const startAndroidInstallation = () => {
    setAndroidInstallStatus('installing');
    setInstallProgress(0);
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAndroidInstallStatus('installed');
          setIsInstallModalOpen(false);
          setActiveNotification('🎉 تم تثبيت تطبيق حضرموت الأندرويد بنجاح! تم استلام رمز الخصم 10% 🌟');
          setTimeout(() => {
            setActiveNotification(null);
          }, 6000);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const startIosInstallation = () => {
    setIosInstallStatus('installing');
    setInstallProgress(0);
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIosInstallStatus('installed');
          setIsInstallModalOpen(false);
          setActiveNotification('🍏 تم تثبيت تطبيق حضرموت للآيفون بنجاح! كود خصم 10% نشط الآن 🎟️');
          setTimeout(() => {
            setActiveNotification(null);
          }, 6000);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const triggerMockNotification = () => {
    const randomNotifications = [
      '🔥 عرض الساعة السعيدة: اطلب الآن صينية السعادة واحصل على لتر كولا ملكي مجاناً! 🥤',
      '🛵 التوصيل الملكي سريع ومستمر لشارع البحر، استاد طنطا، والمنطقة الصناعية! ✨',
      '🍖 لحوم طازجة بلدي يومياً - مندي ومطبي كبسة على أصوله من حفرتنا لطاولتك!',
      '📱 استخدم تطبيق الأندرويد الخاص بنا لتحصل على تحديثات فورية لحالة تحضير طعامك.'
    ];
    const randomIndex = Math.floor(Math.random() * randomNotifications.length);
    setActiveNotification(randomNotifications[randomIndex]);
    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  // Auto welcome greeting based on hour
  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'صباح الخير والبركة ☀️';
    if (hr < 18) return 'أهلاً بك في غدائك الملكي ✨';
    return 'مساء الخير والأنوار 🌙';
  }, []);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return menuData.filter(item => {
      const matchesCategory = item.arabicCategory === activeCategory;
      const matchesSearch = 
        item.arabicName.includes(searchQuery) || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.arabicDescription && item.arabicDescription.includes(searchQuery));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, menuData]);

  // Search over entire menu (for quick global search in mobile view)
  const globalSearchResults = useMemo(() => {
    if (!searchQuery) return [];
    return menuData.filter(item => 
      item.arabicName.includes(searchQuery) || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.arabicDescription && item.arabicDescription.includes(searchQuery))
    ).slice(0, 5);
  }, [searchQuery, menuData]);

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
    setSelectedItemForOptions(null);
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
    
    const restaurantPhone = '201000520345';
    
    const message = `🌟 *طلب جديد من مطعم حضرموت الدمشقي* 🌟
━━━━━━━━━━━━━━━━━━━
👤 *بيانات العميل:*
• الاسم: ${customerInfo.name}
• الهاتف: ${customerInfo.phone}
• العنوان: ${customerInfo.address}

🍱 *تفاصيل الطلب:*
${cart.map(item => `📦 ${item.arabicName} ${item.selectedSize ? `«${sizeLabels[item.selectedSize]}»` : ''}
   🔢 الكمية: ${item.quantity} 
   💰 السعر: ${item.finalPrice * item.quantity} ج.م`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━
💵 *الإجمالي النهائي:* ${cartTotal} ج.م
━━━━━━━━━━━━━━━━━━━
✨ شكراً لاختياركم حضرموت الدمشقي! ✨`;

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
    quarter: 'ربع كيلو',
    third: 'ثلث كيلو',
    half: 'نصف كيلو',
    kilo: 'كيلو كامل'
  };

  // Mobile App Core UI Component to minimize repetition
  const AppContent = () => (
    <div className="flex flex-col h-full bg-sand text-ink select-none overflow-hidden relative" dir="rtl">
      
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center noble-border shadow-sm">
            <UtensilsCrossed size={16} className="text-accent" />
          </div>
          <div className="text-right">
            <h1 className="text-base font-black text-ink arabic leading-tight">حضرموت الدمشقي</h1>
            <p className="text-[8px] text-accent font-bold tracking-widest uppercase">The Royal Mandi</p>
          </div>
        </div>

        {/* Floating stats / top actions */}
        <div className="flex items-center gap-3">
          <a 
            href="tel:01000520345"
            className="w-9 h-9 bg-sand rounded-xl flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
          >
            <PhoneCall size={15} />
          </a>
          
          <button 
            onClick={() => {
              setCartStep('items');
              setIsCartOpen(true);
            }}
            className="w-10 h-10 bg-ink text-white rounded-xl relative flex items-center justify-center shadow-lg transform active:scale-90 transition-transform"
          >
            <ShoppingCart size={16} className="text-accent" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-accent text-ink text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Tab View Viewports */}
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-5 space-y-6"
            >
              {/* Profile Card & Custom Welcome Greeting */}
              <div className="bg-gradient-to-br from-ink to-primary-dark text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden noble-border">
                <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none">
                  <svg width="200" height="200" viewBox="0 0 100 100" className="text-accent">
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
                  </svg>
                </div>
                
                <p className="text-amber-400 text-xs font-bold arabic">{greeting}</p>
                <h2 className="text-2xl font-black mt-2 arabic leading-tight">جاهز لأشهى مندي ببلدك طنطا؟</h2>
                <p className="text-white/60 text-[10px] arabic mt-1">توصيل ملكي وسريع أينما كنت بشارع البحر ومناطق طنطا</p>
                
                <div className="mt-5 flex gap-2">
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="bg-accent text-ink text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transform active:scale-95 transition-transform"
                  >
                    اطلب وجبتك الآن
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>

              {/* Device-Specific App Installer Access Banners */}
              {(!useSimulator || deviceType === 'android') && androidInstallStatus !== 'installed' && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-3xl p-5 flex items-center justify-between text-right gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-emerald-800 text-xs font-black arabic flex items-center gap-1.5 justify-end">
                      تطبيق الأندرويد متوفر للتحميل المباشر 📲
                    </h4>
                    <p className="text-neutral-600 text-[10px] arabic leading-relaxed">
                      ثبّت التطبيق الملكي (APK) الخصم الحصري 10% بانتظارك مع خدمة التوصيل الفائق!
                    </p>
                    <button 
                      onClick={() => { setDeviceType('android'); setIsInstallModalOpen(true); }}
                      className="mt-3 bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all arabic"
                    >
                      تنزيل وتثبيت تطبيق الأندرويد 📥
                    </button>
                  </div>
                  <div className="w-11 h-11 bg-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.523 15.3414C17.0783 15.3414 16.7118 14.9749 16.7118 14.5302C16.7118 14.0855 17.0782 13.7226 17.523 13.7226C17.9678 13.7226 18.3343 14.0855 18.3343 14.5302C18.3343 14.9749 17.9642 15.3414 17.523 15.3414ZM6.47702 15.3414C6.03223 15.3414 5.66572 14.9749 5.66572 14.5302C5.66572 14.0855 6.03223 13.7226 6.47702 13.7226C6.9218 13.7226 7.28827 14.0855 7.28827 14.5302C7.28827 14.9749 6.91823 15.3414 6.47702 15.3414ZM17.9159 10.3705L19.7895 7.12602C19.9216 6.89745 19.843 6.60423 19.6144 6.47214C19.3858 6.34005 19.0926 6.41865 18.9605 6.64722L17.0564 9.94829C15.5898 9.28014 13.8966 8.90518 12.0018 8.90518C10.107 8.90518 8.41378 9.28014 6.94721 9.94829L5.04306 6.64722C4.91101 6.41865 4.61778 6.34005 4.38921 6.47214C4.16064 6.60423 4.08204 6.89745 4.21413 7.12602L6.08771 10.3705C3.0782 12.0673 1.01188 15.1114 0.697415 18.7772H23.3026C22.9881 15.1114 20.9218 12.0673 17.9159 10.3705Z"/>
                    </svg>
                  </div>
                </div>
              )}

              {(!useSimulator || deviceType === 'ios') && iosInstallStatus !== 'installed' && (
                <div className="bg-blue-500/10 border border-blue-500/25 rounded-3xl p-5 flex items-center justify-between text-right gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-blue-800 text-xs font-black arabic flex items-center gap-1.5 justify-end">
                      تطبيق الآيفون متوفر على App Store 🍏
                    </h4>
                    <p className="text-neutral-600 text-[10px] arabic leading-relaxed">
                      حمّل تطبيق المندي والمشوي لأجهزة iOS واستمتع بخصم 10% وتجربة سريعة للطلب بطنطا!
                    </p>
                    <button 
                      onClick={() => { setDeviceType('ios'); setIsInstallModalOpen(true); }}
                      className="mt-3 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition-all arabic"
                    >
                      تنزيل وتثبيت تطبيق الآيفون 📥
                    </button>
                  </div>
                  <div className="w-11 h-11 bg-blue-500/20 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.07.08 2.21-.55 2.95-1.39"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Instant Search Bar */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="ابحث سريعاً عن وجبتك المفضلة..."
                  className="w-full bg-white border border-border/60 rounded-2xl py-3.5 pr-11 pl-4 text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-accent/40"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'menu') {
                      setActiveTab('menu');
                    }
                  }}
                />
                <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/60" size={16} />
              </div>

              {/* Royal Quick Promos / Highlights */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black text-ink arabic flex items-center gap-1.5">
                    <Sparkles size={14} className="text-accent" />
                    صواني السعادة والعزائم الأكثر طلباً
                  </h3>
                  <button onClick={() => { setActiveCategory('صواني ومندي'); setActiveTab('menu'); }} className="text-[10px] text-accent font-bold arabic uppercase">عرض الكل</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x">
                  {/* Promo Card 1 */}
                  <div 
                    onClick={() => {
                      const trayItem = menuData.find(i => i.id === 'tray-1');
                      if (trayItem) addToCart(trayItem);
                    }}
                    className="bg-white p-4 rounded-3xl border border-border/40 w-72 flex-shrink-0 snap-center space-y-3 relative overflow-hidden active:scale-98 transition-transform cursor-pointer"
                  >
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg">الأكثر مبيعاً</div>
                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-ink arabic">صينية السعادة (لمة العائلة)</h4>
                      <p className="text-[10px] text-muted/70 arabic leading-relaxed line-clamp-2">
                        فرخة + 1/2 كفته + سرفيس أرز مندي + 4 سمبوسك + السلطات + العيش
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-sand">
                      <span className="text-xs font-black text-accent arabic">شامل السلطات والشوربة</span>
                      <span className="text-sm font-black text-ink font-mono text-luxury">680 ج.م</span>
                    </div>
                  </div>

                  {/* Promo Card 2 */}
                  <div 
                    onClick={() => {
                      const trayItem = menuData.find(i => i.id === 'tray-3');
                      if (trayItem) addToCart(trayItem);
                    }}
                    className="bg-white p-4 rounded-3xl border border-border/40 w-72 flex-shrink-0 snap-center space-y-3 relative overflow-hidden active:scale-98 transition-transform cursor-pointer"
                  >
                    <div className="absolute top-3 left-3 bg-accent text-ink text-[8px] font-black px-2 py-1 rounded-lg">عروض العائلة</div>
                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-ink arabic">صينية العائلة الكريمة (ثمن تيس)</h4>
                      <p className="text-[10px] text-muted/70 arabic leading-relaxed line-clamp-2">
                        ثمن تيس مندي + فرخة مشوي أو مندي + نص كفته + سرفيس أرز مندي + السلطات + العيش
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-sand">
                      <span className="text-xs font-black text-accent arabic">لعدد 4 إلى 6 أفراد</span>
                      <span className="text-sm font-black text-ink font-mono text-luxury">1500 ج.م</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Sellers and Recommendations */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black text-ink arabic">وجبات المندي الفردية الموصى بها</h3>
                  <button onClick={() => { setActiveCategory('ركن المندي والكبسة'); setActiveTab('menu'); }} className="text-[10px] text-accent font-bold arabic">عرض القائمة</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {menuData.filter(i => i.arabicCategory === 'ركن المندي والكبسة').slice(0, 4).map(item => (
                    <div 
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="bg-white p-4 rounded-3xl border border-border/30 flex flex-col justify-between space-y-3 relative active:scale-95 transition-transform duration-300 cursor-pointer noble-border"
                    >
                      <button 
                        onClick={(e) => toggleLike(item.id, e)} 
                        className="absolute top-3 left-3 text-muted hover:text-red-500 transition-colors"
                      >
                        <Heart size={14} className={likedItems[item.id] ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                      <div className="space-y-1 text-right mt-2">
                        <span className="text-[8px] font-bold text-accent px-1.5 py-0.5 bg-accent/10 rounded-lg arabic">طبق مندي ملكي</span>
                        <h4 className="font-black text-xs text-ink arabic leading-tight">{item.arabicName}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-sand">
                        <span className="text-xs font-black text-ink font-mono">{item.price} ج.م</span>
                        <div className="w-6 h-6 bg-ink text-accent rounded-lg flex items-center justify-center font-black text-lg">+</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Map & Quick Contact */}
              <div className="bg-white p-5 rounded-[32px] border border-border/40 text-right space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-ink arabic">زيارة الديوان الملكي بطنطا</h4>
                    <p className="text-[11px] text-muted arabic">شارع البحر - بجوار صيدناوي ومطافيء طنطا</p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-muted arabic font-bold">مفتوح الآن لتلبية طلباتكم حتى 1 صباحاً</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="tab-menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Category Quick Selector Slider */}
              <div className="bg-white/80 backdrop-blur-md border-b border-border/20 py-3.5 sticky top-[72px] z-20 flex overflow-x-auto no-scrollbar gap-2.5 px-5 scroll-smooth pointer-events-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.arabicName}
                    onClick={() => {
                      setActiveCategory(cat.arabicName);
                      // Clear query if navigating proper categories
                      setSearchQuery('');
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-black transition-all ease-out duration-300 arabic ${
                      activeCategory === cat.arabicName && !searchQuery
                        ? 'bg-ink text-accent shadow-md scale-105'
                        : 'bg-sand text-muted hover:text-ink hover:bg-white/90'
                    }`}
                  >
                    {cat.arabicName}
                  </button>
                ))}
              </div>

              {/* Specific Listing Content */}
              <div className="p-5 space-y-5">
                <div className="text-right">
                  <h3 className="text-base font-black text-ink arabic">
                    {searchQuery ? `نتائج البحث عن: "${searchQuery}"` : activeCategory}
                  </h3>
                  <p className="text-[9px] text-accent font-black tracking-widest uppercase mt-0.5">Fresh Gourmet Selections</p>
                </div>

                <div className="space-y-4">
                  {filteredItems.length === 0 ? (
                    <div className="bg-white/50 border border-dashed border-border/60 py-12 rounded-[28px] text-center space-y-3">
                      <p className="text-xs text-muted font-bold arabic">لم نجد وجبات مطابقة للبحث</p>
                      <button onClick={() => { setSearchQuery(''); setActiveCategory(CATEGORIES[1].arabicName); }} className="text-[10px] text-accent font-black underline arabic">عرض بقية المنيو</button>
                    </div>
                  ) : (
                    filteredItems.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          if (item.prices) {
                            setSelectedItemForOptions(item);
                          } else {
                            addToCart(item);
                          }
                        }}
                        className="bg-white p-4.5 rounded-[28px] border border-border/40 flex flex-col justify-between text-right relative active:scale-99 transition-transform cursor-pointer noble-border shadow-sm group"
                      >
                        <button 
                          onClick={(e) => toggleLike(item.id, e)} 
                          className="absolute top-4 left-4 text-muted/60 hover:text-red-500 transition-colors"
                        >
                          <Heart size={14} className={likedItems[item.id] ? 'fill-red-500 text-red-500 animate-pulse' : ''} />
                        </button>

                        <div className="space-y-2">
                          <span className="text-[8px] font-bold text-accent/80 border-b border-accent/20 pb-0.5 inline-block arabic">
                            {item.arabicCategory}
                          </span>
                          <h4 className="text-lg font-black text-ink arabic leading-tight group-hover:text-amber-600 transition-colors">
                            {item.arabicName}
                          </h4>
                          {item.arabicDescription && (
                            <p className="text-[10px] text-muted leading-relaxed font-semibold">
                              {item.arabicDescription}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-sand flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {!item.prices ? (
                              <>
                                <span className="text-base font-black text-ink font-mono">{item.price}</span>
                                <span className="text-[8px] font-bold text-muted arabic">ج.م</span>
                              </>
                            ) : (
                              <span className="text-[10px] font-black text-accent arabic">اختيار الحجم • ربع / نص / كيلو</span>
                            )}
                          </div>

                          <div className="bg-ink text-white px-3.5 py-2 rounded-xl text-[10px] font-black group-hover:bg-accent group-hover:text-ink transition-all flex items-center gap-2 arabic">
                            {item.prices ? 'اختر الحجم' : 'أضف للطلب'}
                            <Plus size={10} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="tab-contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-5 space-y-6 text-right"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-accent text-ink rounded-[28px] mx-auto flex items-center justify-center noble-border shadow-md rotate-3">
                  <UtensilsCrossed size={28} />
                </div>
                <h3 className="text-xl font-black text-ink arabic">حضرموت الدمشقي</h3>
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none">أصل المندي والمشوي من طنطا لقلبك</p>
              </div>

              {/* Location Card */}
              <div className="bg-white p-5 rounded-[28px] border border-border/40 space-y-4 shadow-sm">
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right">
                    <h4 className="font-black text-xs text-muted arabic uppercase tracking-widest opacity-60">العنوان الرسمي</h4>
                    <p className="text-sm font-black text-ink arabic mt-1">طنطا - شارع البحر - لفة صيدناوي</p>
                  </div>
                  <div className="w-10 h-10 bg-sand rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                </div>
                <p className="text-[10px] text-accent font-bold arabic text-center bg-sand/40 py-2 rounded-lg">ليس للمطعم أي فروع أخرى بمدينة طنطا</p>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white p-5 rounded-[28px] border border-border/40 space-y-3 shadow-sm">
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right flex-1">
                    <h4 className="font-black text-xs text-muted arabic uppercase tracking-widest opacity-60">ساعات الخدمة والكرم</h4>
                    <p className="text-sm font-black text-ink arabic mt-1">يومياً من ١٢ ظهراً حتى ١ بعد منتصف الليل</p>
                  </div>
                  <div className="w-10 h-10 bg-sand rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                    <Clock size={18} />
                  </div>
                </div>
              </div>

              {/* Phones and Social connections */}
              <div className="bg-white p-5 rounded-[28px] border border-border/40 space-y-4 shadow-sm">
                <h4 className="font-black text-[10px] text-accent uppercase tracking-widest border-b border-sand pb-2 arabic">خط الساق الملكي</h4>
                <div className="space-y-3">
                  <a 
                    href="tel:01000520345" 
                    className="flex justify-between items-center p-3 bg-sand/30 rounded-xl hover:bg-sand transition-colors font-bold text-sm text-ink group"
                  >
                    <span className="text-xs text-accent">اضغط للاتصال مروحة 📞</span>
                    <span className="font-mono">٠١٠٠٠٥٢٠٣٤٥</span>
                  </a>
                  <a 
                    href="tel:01271194944" 
                    className="flex justify-between items-center p-3 bg-sand/30 rounded-xl hover:bg-sand transition-colors font-bold text-sm text-ink"
                  >
                    <span className="text-xs text-accent">اضغط للاتصال مروحة 📞</span>
                    <span className="font-mono">٠١٢٧١١٩٤٩٤٤</span>
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-3 justify-center">
                <a 
                  href="https://www.facebook.com/hadrmotdemshky/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white border border-border/50 px-6 py-3.5 rounded-2xl flex items-center gap-2 text-xs font-black hover:text-accent transition-colors shadow-sm arabic"
                >
                  <Facebook size={16} className="text-blue-600" />
                  حساب الملك بالفيس بوك
                </a>
              </div>

              {/* Developer signature */}
              <div className="pt-2 text-center text-muted/30 hover:text-accent text-[9px] font-bold duration-300">
                <a href="https://wa.me/201000520345" target="_blank" rel="noopener noreferrer">
                  تصميم وتطوير عمر احمد ٠١٠٠٠٥٢٠٣٤٥
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Nav Taskbar */}
      <nav className="absolute bottom-0 left-0 right-0 h-18 bg-white/95 backdrop-blur-md border-t border-border/40 px-6 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home' ? 'text-accent scale-105' : 'text-muted/60 hover:text-ink'
          }`}
        >
          <Home size={18} />
          <span className="text-[10px] font-black arabic">الرئيسية</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('menu');
            setSearchQuery(''); 
          }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'menu' ? 'text-accent scale-105' : 'text-muted/60 hover:text-ink'
          }`}
        >
          <UtensilsCrossed size={18} />
          <span className="text-[10px] font-black arabic">قائمة الطعام</span>
        </button>

        <button
          onClick={() => {
            setCartStep('items');
            setIsCartOpen(true);
          }}
          className="relative -top-5 w-14 h-14 bg-ink hover:bg-accent text-white hover:text-ink rounded-full flex items-center justify-center shadow-lg hover:shadow-accent/20 transition-all duration-300"
        >
          <ShoppingCart size={20} className="w-5.5 h-5.5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-white">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'contact' ? 'text-accent scale-105' : 'text-muted/60 hover:text-ink'
          }`}
        >
          <Info size={18} />
          <span className="text-[10px] font-black arabic">عنا</span>
        </button>
      </nav>

      {/* Item Options Select Modal Sheet (iOS Side Up Drawer) */}
      <AnimatePresence>
        {selectedItemForOptions && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemForOptions(null)}
              className="absolute inset-0 bg-black z-50 pointer-events-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-[32px] p-6 text-right z-50 pointer-events-auto shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedItemForOptions(null)}
                  className="p-1 bg-sand rounded-full"
                >
                  <X size={18} />
                </button>
                <div className="space-y-0.5">
                  <h4 className="font-black text-lg text-ink arabic">{selectedItemForOptions.arabicName}</h4>
                  <p className="text-[10px] text-accent font-bold arabic">اختر الكمية والحجم المفضل للطلب</p>
                </div>
              </div>

              {selectedItemForOptions.prices && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {Object.entries(selectedItemForOptions.prices).map(([size, p]) => (
                    <button
                      key={size}
                      onClick={() => addToCart(selectedItemForOptions, size as any)}
                      className="flex flex-col items-center justify-center p-4 bg-sand rounded-2xl hover:bg-accent/10 border border-transparent hover:border-accent/40 active:scale-95 transition-all text-center"
                    >
                      <span className="text-[9px] font-bold text-muted arabic uppercase">{sizeLabels[size]}</span>
                      <span className="text-base font-black text-ink mt-1 font-mono">{p} ج.م</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sheet Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 pointer-events-auto"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="absolute inset-y-0 right-0 left-0 top-12 bg-white rounded-t-[32px] z-50 pointer-events-auto flex flex-col justify-between overflow-hidden text-right"
            >
              {/* Header */}
              <div className="p-5 border-b border-border/40 flex justify-between items-center bg-sand/30">
                <div className="flex items-center gap-3">
                  {cartStep === 'checkout' && (
                    <button 
                      onClick={() => setCartStep('items')}
                      className="p-1.5 bg-sand rounded-lg text-ink"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-black arabic leading-none">
                      {cartStep === 'items' ? 'حقيبة الطلبات' : 'إتمام الطلب'}
                    </h2>
                    <p className="text-[8px] text-accent font-bold uppercase tracking-widest mt-0.5">
                      {cartStep === 'items' ? 'Your Gourmet Bag' : 'Shipping Details'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-sand rounded-lg text-muted"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 bg-sand rounded-[24px] flex items-center justify-center text-accent/30 rotate-12">
                      <ShoppingCart size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-ink arabic">حقيبة الطلبات فارغة</h3>
                      <p className="text-[10px] text-muted arabic">استكشف منيو طنطا الفاخر الآن واطلب وجبتك</p>
                    </div>
                  </div>
                ) : cartStep === 'checkout' ? (
                  <div className="space-y-6">
                    <div className="bg-sand/40 p-5 rounded-2xl border border-border/50 space-y-4">
                      <h4 className="text-[10px] font-black text-accent uppercase tracking-widest border-b border-border/40 pb-2 arabic">ملخص سريع للطلب</h4>
                      <div className="space-y-2">
                        {cart.map(item => (
                          <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center text-xs font-bold">
                            <span className="font-mono">{item.finalPrice * item.quantity} ج.م</span>
                            <span className="arabic text-muted">{item.arabicName} {item.selectedSize ? `(${sizeLabels[item.selectedSize]})` : ''} × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-muted arabic mr-1">اسم العميل</label>
                          <input required type="text" placeholder="الاسم الكامل" className="w-full bg-sand/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent/40 text-xs text-right" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-muted arabic mr-1">رقم الهاتف</label>
                          <input required type="tel" placeholder="01xxxxxxxxx" className="w-full bg-sand/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent/40 text-xs text-center font-bold font-mono" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-muted arabic mr-1">عنوان التوصيل بتفصيل (طنطا)</label>
                          <textarea required placeholder="الشارع، الدور، رقم العمارة، علامة مميزة..." rows={2} className="w-full bg-sand/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent/40 text-xs text-right" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
                        </div>
                      </div>
                      
                      <button type="submit" className="w-full bg-ink text-white py-4.5 rounded-xl font-black text-sm shadow-lg hover:bg-accent hover:text-ink transform active:scale-95 transition-all text-center arabic pb-4">
                        إرسال لخدمة عملاء واتساب مروحة 📱
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="bg-sand/10 border border-border/40 p-4 rounded-2xl flex items-center gap-4 text-right">
                        <div className="flex-1 space-y-1">
                          <h4 className="font-black text-sm text-ink arabic leading-tight">{item.arabicName}</h4>
                          <p className="text-[9px] font-bold text-accent/80 ml-auto">
                            {item.selectedSize ? sizeLabels[item.selectedSize] : 'وجبة كاملة'} — {item.finalPrice} ج.م
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <button onClick={() => updateQuantity(`${item.id}-${item.selectedSize || 'none'}`, -1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center bg-white"><Minus size={12}/></button>
                            <span className="font-black text-xs w-4 text-center font-mono">{item.quantity}</span>
                            <button onClick={() => updateQuantity(`${item.id}-${item.selectedSize || 'none'}`, 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center bg-white"><Plus size={12}/></button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(`${item.id}-${item.selectedSize || 'none'}`)} className="text-muted/60 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total actions */}
              {cart.length > 0 && cartStep === 'items' && (
                <div className="p-5 border-t border-border/40 bg-sand/20 space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xl font-black font-mono text-ink">{cartTotal} ج.م</span>
                    <span className="text-[10px] font-black text-muted arabic uppercase">الإجمالي التقريبي</span>
                  </div>
                  <button 
                    onClick={() => setCartStep('checkout')}
                    className="w-full bg-ink text-white py-4.5 rounded-xl font-black text-xs hover:bg-accent hover:text-ink transform active:scale-95 transition-transform shadow-md text-center arabic"
                  >
                    متابعة عملية الطلب
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating alert on successful order */}
      <AnimatePresence>
        {isOrderComplete && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute inset-[24px] rounded-3xl bg-ink/95 backdrop-blur-md text-white z-[80] flex flex-col items-center justify-center p-6 text-center shadow-2xl space-y-4"
          >
            <div className="w-16 h-16 bg-accent text-ink rounded-[24px] flex items-center justify-center shadow-lg">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-xl text-accent arabic">تم تجهيز طلبك الملكي!</h3>
              <p className="text-[11px] text-white/70 arabic leading-relaxed">
                لقد فتحنا نافذة المحادثة عبر واتساب لإرسال طلبك. نشكرك على اختيار عراقة حضرموت الدمشقي.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Package Installer Modal (Android APK vs iOS App Store / TestFlight) */}
      <AnimatePresence>
        {isInstallModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => { 
                if (deviceType === 'android' && androidInstallStatus !== 'installing') setIsInstallModalOpen(false);
                if (deviceType === 'ios' && iosInstallStatus !== 'installing') setIsInstallModalOpen(false);
              }}
              className="absolute inset-0 bg-neutral-950/80 z-[100] pointer-events-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 180 }}
              className="absolute bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 rounded-t-[36px] p-6 text-right z-[110] pointer-events-auto shadow-2xl text-white space-y-6"
            >
              {deviceType === 'android' ? (
                <>
                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <h3 className="text-sm font-black arabic leading-tight font-sans">أداة تثبيت حزم أندرويد</h3>
                      <p className="text-[9px] text-emerald-400 font-bold arabic">تم فحصه بواسطة Play Protect ✓</p>
                    </div>
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 font-bold text-accent">
                      <UtensilsCrossed size={16} />
                    </div>
                  </div>

                  <div className="bg-zinc-950/50 p-4 rounded-2xl space-y-3 border border-zinc-800 text-[11px]">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span className="font-mono text-zinc-300">14.2 MB</span>
                      <span className="arabic font-bold text-white">تفاصيل التطبيق:</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span className="font-mono text-zinc-300">v3.5.2 (Android APK)</span>
                      <span className="arabic font-bold text-white">الإصدار والترخيص:</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 arabic leading-relaxed text-right mt-1">
                      يتطلب هذا التطبيق أندرويد 8.0+ ويأتي مبرمجاً لتسريع عمليات الطلب وتلقي إشعارات التوصيل الفورية بشارع البحر ومناطق طنطا.
                    </p>
                  </div>

                  {androidInstallStatus === 'installing' ? (
                    <div className="space-y-3 py-2">
                      <div className="flex justify-between items-center text-xs text-zinc-300">
                        <span className="font-mono font-bold text-emerald-400">{installProgress}%</span>
                        <span className="arabic font-bold">جاري تنزيل الفايل ومزامنة الملفات...</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${installProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsInstallModalOpen(false)}
                        className="flex-1 bg-zinc-800 text-zinc-300 py-3 rounded-xl font-black text-xs hover:bg-zinc-750 transition-all arabic"
                      >
                        إلغاء للاحقاً
                      </button>
                      <button 
                        onClick={startAndroidInstallation}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black text-xs hover:bg-emerald-500 shadow-lg transition-all arabic"
                      >
                        تثبيت الآن (APK) 📲
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <h3 className="text-sm font-black arabic leading-tight font-sans">تثبيت التطبيق من Apple App Store</h3>
                      <p className="text-[9px] text-[#4285F4] font-bold arabic">تثبيت آمن عبر حساب Apple Secure ID ✓</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md text-zinc-950 font-bold shrink-0">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.07.08 2.21-.55 2.95-1.39"/>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-zinc-950/50 p-4 rounded-2xl space-y-3 border border-zinc-800 text-[11px]">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span className="font-mono text-emerald-400 font-bold">مجاني (FREE)</span>
                      <span className="arabic font-bold text-white">السعر والترخيص:</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span className="font-mono text-zinc-300">Apple Silicon / iOS App</span>
                      <span className="arabic font-bold text-white">التوافق:</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 arabic leading-relaxed text-right mt-1">
                      يدعم تطبيق طنطا للآيفون ميزة Live Activities لتتبع دقيق لمرور المندوب بشارع البحر والاستاد لحظة بلحظة.
                    </p>
                  </div>

                  {iosInstallStatus === 'installing' ? (
                    <div className="space-y-3 py-2">
                      <div className="flex justify-between items-center text-xs text-zinc-300">
                        <span className="font-mono font-bold text-blue-400">{installProgress}%</span>
                        <span className="arabic font-bold">جاري فحص Face ID وتحميل تطبيق iOS...</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${installProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsInstallModalOpen(false)}
                        className="flex-1 bg-zinc-800 text-zinc-300 py-3 rounded-xl font-black text-xs hover:bg-zinc-750 transition-all arabic"
                      >
                        إلغاء للاحقاً
                      </button>
                      <button 
                        onClick={startIosInstallation}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs hover:bg-blue-500 shadow-lg transition-all arabic"
                      >
                        تثبيت عبر App Store 🍏
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Simulated Premium Platform-Specific Push Notification Banner */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 24, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            className={`absolute top-12 inset-x-4 border rounded-[24px] p-4 z-[200] flex items-start gap-3 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)] text-white text-right select-none pointer-events-auto ${
              deviceType === 'android' 
                ? 'bg-zinc-900 border-zinc-800' 
                : 'bg-zinc-950/90 backdrop-blur-md border-white/10 rounded-[28px]'
            }`}
            onClick={() => setActiveNotification(null)}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              deviceType === 'android' ? 'bg-accent text-zinc-950' : 'bg-white text-zinc-950'
            }`}>
              <UtensilsCrossed size={16} />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  deviceType === 'android' ? 'text-[#C5A059] bg-[#C5A059]/10' : 'text-blue-400 bg-blue-500/10'
                }`}>
                  {deviceType === 'android' ? 'إشعار أندرويد • الآن' : 'iOS Notification • Now'}
                </span>
                <span className="text-[8px] text-zinc-500 font-bold arabic cursor-pointer">سحب لإخفاء ×</span>
              </div>
              <h4 className="font-black text-[11px] text-zinc-100 arabic">حضرموت الدمشقي</h4>
              <p className="text-[10px] text-zinc-300 arabic leading-relaxed">{activeNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleAndroidBack = () => {
    if (isCartOpen) {
      setIsCartOpen(false);
    } else if (selectedItemForOptions) {
      setSelectedItemForOptions(null);
    } else if (activeTab !== 'home') {
      setActiveTab('home');
    } else {
      setShowAndroidHome(true);
    }
  };

  const IosHomeScreen = () => (
    <div className="w-full h-full bg-cover bg-center flex flex-col justify-between p-5 relative select-none animate-in fade-in duration-200" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600')" }}>
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[1px] pointer-events-none" />
      
      {/* iOS Time & Date Widget */}
      <div className="text-center text-white space-y-1 pt-10 relative z-10">
        <h2 className="text-4xl font-semibold tracking-tight font-sans drop-shadow-md">
          {currentTime}
        </h2>
        <p className="text-[9px] font-black tracking-wide text-zinc-100 bg-black/40 border border-white/5 px-3 py-1.5 rounded-full inline-block arabic uppercase drop-shadow">
          طنطا • الأحد ٣١ مايو 🌙
        </p>
      </div>

      {/* Grid of iOS Squircle Launcher icons */}
      <div className="grid grid-cols-4 gap-y-5 pt-4 text-center text-white text-[9px] font-bold relative z-10">
        {/* App 1: Hadramout Damashqi App */}
        {iosInstallStatus === 'installed' ? (
          <button 
            onClick={() => setShowAndroidHome(false)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-13 h-13 bg-neutral-900 border border-[#C5A059]/40 rounded-[20px] flex items-center justify-center shadow-lg relative ring-1 ring-white/10">
              <UtensilsCrossed size={20} className="text-[#C5A059]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center text-white border border-neutral-950 animate-pulse">
                1
              </span>
            </div>
            <span className="font-extrabold arabic shadow-sm drop-shadow-md truncate w-full">حضرموت</span>
          </button>
        ) : (
          <button 
            onClick={() => { setDeviceType('ios'); setIsInstallModalOpen(true); }}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-13 h-13 bg-neutral-950/40 border border-dashed border-white/50 rounded-[20px] flex items-center justify-center shadow-lg backdrop-blur-md">
              <Plus size={18} className="text-white/85" />
            </div>
            <span className="font-bold arabic shadow-sm drop-shadow-md truncate w-full">تثبيت التطبيق</span>
          </button>
        )}

        {/* WhatsApp App Mock */}
        <a 
          href="https://wa.me/201000520345" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-13 h-13 bg-[#25D366] rounded-[20px] flex items-center justify-center shadow-md border border-white/5 hover:scale-105 duration-200">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.011-5.11-2.861-6.963C16.63 1.93 14.156.918 11.536.918c-5.436 0-9.86 4.418-9.863 9.863-.002 1.762.481 3.479 1.4 4.996l-1.026 3.746 3.835-1.002c1.503.82 3.12 1.253 4.765 1.253z"/>
            </svg>
          </div>
          <span className="font-extrabold arabic shadow-sm drop-shadow-md truncate w-full">الواتساب</span>
        </a>

        {/* Maps */}
        <div className="flex flex-col items-center gap-1 opacity-95 cursor-default">
          <div className="w-13 h-13 bg-white rounded-[20px] flex items-center justify-center shadow-lg border border-zinc-100">
            <MapPin size={20} className="text-emerald-500" />
          </div>
          <span className="font-bold arabic shadow-sm drop-shadow-md">الخريطة</span>
        </div>

        {/* FaceTime / Phone support */}
        <a 
          href="tel:01000520345" 
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-13 h-13 bg-emerald-500 rounded-[20px] flex items-center justify-center shadow-md border border-white/5">
            <Phone size={18} className="text-white" />
          </div>
          <span className="font-bold arabic shadow-sm drop-shadow-md">الاتصال الملكي</span>
        </a>
      </div>

      {/* iOS styled visual widget */}
      <div className="flex-1 text-center py-8">
        <div className="bg-neutral-900/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-sm inline-block max-w-[200px] text-right">
          <p className="text-xs text-[#C5A059] font-black arabic mb-1 flex items-center justify-end gap-1">
            <Sparkles size={11} className="text-amber-400" /> عرض اليوم الخاص
          </p>
          <p className="text-[10px] text-white/90 arabic leading-relaxed">
            اطلب صينية السعادة واحصل على لتر كولا كولا مجاناً من التطبيق 🥤
          </p>
        </div>
      </div>

      {/* iOS App Dock */}
      <div className="bg-white/15 backdrop-blur-xl rounded-[28px] p-3 flex justify-around items-center gap-2 border border-white/10 shadow-xl relative z-10 mb-2">
        <div className="w-12 h-12 bg-emerald-600 rounded-[18px] flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform"><Smartphone size={18} /></div>
        <div className="w-12 h-12 bg-white rounded-[18px] flex items-center justify-center text-neutral-800 font-extrabold text-sm shadow-sm active:scale-95 transition-transform border border-zinc-100">G</div>
        <div className="w-12 h-12 bg-neutral-900 rounded-[18px] flex items-center justify-center text-accent shadow-sm active:scale-95 transition-transform"><Sparkles size={18} /></div>
        {iosInstallStatus === 'installed' && (
          <button 
            onClick={() => setShowAndroidHome(false)} 
            className="w-12 h-12 bg-neutral-950 border border-[#C5A059]/40 rounded-[18px] flex items-center justify-center text-accent active:scale-95 transition-transform shadow-md animate-bounce"
          >
            <UtensilsCrossed size={18} />
          </button>
        )}
      </div>
    </div>
  );

  const AndroidHomeScreen = () => (
    <div className="w-full h-full bg-cover bg-center flex flex-col justify-between p-5 relative select-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600')" }}>
      {/* Dark tint glass overlay */}
      <div className="absolute inset-0 bg-neutral-950/25 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Upper widget */}
      <div className="text-center text-white space-y-1 pt-10 relative z-10">
        <h2 className="text-4xl font-extrabold tracking-wider font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {currentTime}
        </h2>
        <p className="text-[9px] uppercase font-bold tracking-widest text-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] bg-black/45 px-3.5 py-1.5 rounded-full inline-block arabic border border-white/5">
          طنطا • الأحد ٣١ مايو 🌙
        </p>
      </div>

      {/* Grid of Launcher Apps */}
      <div className="grid grid-cols-4 gap-y-5 pt-4 text-center text-white text-[9px] font-bold relative z-10">
        {/* App 1: Hadramout Damashqi App */}
        {androidInstallStatus === 'installed' ? (
          <button 
            onClick={() => setShowAndroidHome(false)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-13 h-13 bg-neutral-900 border border-[#C5A059]/40 rounded-2xl flex items-center justify-center shadow-lg relative">
              <UtensilsCrossed size={20} className="text-[#C5A059]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center text-white border border-neutral-900 animate-pulse">
                1
              </span>
            </div>
            <span className="font-extrabold arabic shadow-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate w-full">حضرموت</span>
          </button>
        ) : (
          <button 
            onClick={() => setIsInstallModalOpen(true)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-13 h-13 bg-neutral-950/40 border border-dashed border-white/40 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-md">
              <Plus size={18} className="text-white/60" />
            </div>
            <span className="font-bold arabic shadow-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate w-full">ثبّت التطبيق</span>
          </button>
        )}

        {/* WhatsApp App Mock */}
        <a 
          href="https://wa.me/201000520345" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-13 h-13 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 duration-200">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.011-5.11-2.861-6.963C16.63 1.93 14.156.918 11.536.918c-5.436 0-9.86 4.418-9.863 9.863-.002 1.762.481 3.479 1.4 4.996l-1.026 3.746 3.835-1.002c1.503.82 3.12 1.253 4.765 1.253z"/>
            </svg>
          </div>
          <span className="font-extrabold arabic shadow-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate w-full">واتساب طنطا</span>
        </a>

        {/* Maps */}
        <div className="flex flex-col items-center gap-1 opacity-95 cursor-default">
          <div className="w-13 h-13 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin size={20} className="text-emerald-500" />
          </div>
          <span className="font-bold arabic shadow-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">اللوكيشن</span>
        </div>

        {/* Call support */}
        <a 
          href="tel:01000520345" 
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-13 h-13 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Phone size={18} className="text-white" />
          </div>
          <span className="font-bold arabic shadow-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">اتصال سريع</span>
        </a>
      </div>

      {/* Center Filler - Spacer */}
      <div className="flex-1 text-center py-8">
        <p className="text-[10px] text-white/50 bg-black/20 backdrop-blur-xs py-1 px-3 rounded-full inline-block font-mono">
          Android Flagship Pixel Mode
        </p>
      </div>

      {/* Dynamic Android Google Search Bar / Dock Accent */}
      <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center gap-2.5 mb-5 border border-white/5 shadow-sm relative z-10">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5.04c1.5 0 2.85.51 3.91 1.52l2.91-2.91C17.07 1.95 14.73 1 12 1 7.35 1 3.4 3.65 1.51 7.5l3.86 3C6.27 7.54 8.92 5.04 12 5.04z" />
          <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.47c-.28 1.48-1.11 2.73-2.35 3.57v2.96h3.8c2.22-2.04 3.6-5.05 3.6-8.66z" />
          <path fill="#FBBC05" d="M5.37 14.5c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.51 7.5C.54 9.4 0 11.55 0 13.8s.54 4.4 1.51 6.3l3.86-3z" />
          <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.8-2.96c-1.05.7-2.4 1.13-4.16 1.13-3.08 0-5.73-2.5-6.63-5.46l-3.86 3C3.4 20.35 7.35 23 12 23z" />
        </svg>
        <div className="flex-1 text-right text-[10px] text-white/60 arabic">ابحث سريعاً في منيو طنطا الملكي...</div>
      </div>

      {/* Bottom Dock */}
      <div className="bg-neutral-900/70 backdrop-blur-md rounded-3xl p-3.5 flex justify-around items-center gap-2 border border-white/5 shadow-xl relative z-10 mb-2">
        <div className="w-12 h-12 bg-[#128C7E] rounded-xl flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform"><Smartphone size={18} /></div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-800 font-extrabold text-sm shadow-sm active:scale-95 transition-transform">G</div>
        <div className="w-12 h-12 bg-neutral-800 border border-white/10 rounded-xl flex items-center justify-center text-accent shadow-sm active:scale-95 transition-transform"><Sparkles size={18} /></div>
        {androidInstallStatus === 'installed' && (
          <button 
            onClick={() => setShowAndroidHome(false)} 
            className="w-12 h-12 bg-zinc-950 border border-[#C5A059]/40 rounded-xl flex items-center justify-center text-accent ring-1 ring-accent/30 active:scale-95 transition-transform shadow-md animate-bounce"
          >
            <UtensilsCrossed size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 dots-pattern flex flex-col items-center justify-center p-0 md:p-6" dir="rtl">
      
      {/* Upper Desktop Layout Switch Controller */}
      <div className="hidden md:flex flex-col sm:flex-row justify-between items-center max-w-2xl w-full mx-auto mb-4 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl z-50 text-white select-none shadow-xl gap-3">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-extrabold arabic tracking-wider uppercase pr-1 text-zinc-400">
            {deviceType === 'android' ? 'محاكي الأندرويد التفاعلي 🤖' : 'محاكي الآيفون التفاعلي 🍎'}
          </p>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          
          {/* Dual platform quick toggle pill */}
          <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850 ml-2">
            <button
              onClick={() => { setDeviceType('android'); setUseSimulator(true); }}
              className={`px-2.5 py-1 rounded-md text-[9px] font-black transition-all ${
                deviceType === 'android' && useSimulator
                  ? 'bg-[#C5A059] text-zinc-950 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              أندرويد
            </button>
            <button
              onClick={() => { setDeviceType('ios'); setUseSimulator(true); }}
              className={`px-2.5 py-1 rounded-md text-[9px] font-black transition-all ${
                deviceType === 'ios' && useSimulator
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              آيفون
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={triggerMockNotification}
            className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-zinc-800 border border-zinc-750 hover:bg-zinc-750 hover:text-[#C5A059] transition-all text-zinc-300 arabic flex items-center gap-1.5"
          >
            إشعار تجريبي 🔔
          </button>
          <div className="w-px h-6 bg-zinc-800 self-center" />
          <button
            onClick={() => { setUseSimulator(true); setShowAndroidHome(false); }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
              useSimulator && !showAndroidHome
                ? 'bg-[#C5A059] text-zinc-950 font-bold shadow-sm' 
                : 'text-zinc-400 hover:text-white bg-zinc-950'
            }`}
          >
            داخل التطبيق 📱
          </button>
          <button
            onClick={() => { setUseSimulator(true); setShowAndroidHome(true); }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
              useSimulator && showAndroidHome
                ? 'bg-[#C5A059] text-zinc-950 font-bold shadow-sm' 
                : 'text-zinc-400 hover:text-white bg-zinc-950'
            }`}
          >
            {deviceType === 'android' ? 'شاشة أندرويد 🏠' : 'شاشة آيفون 🏠'}
          </button>
          <button
            onClick={() => setUseSimulator(false)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
              !useSimulator 
                ? 'bg-[#C5A059] text-zinc-950 font-bold shadow-sm' 
                : 'text-zinc-400 hover:text-white bg-zinc-950'
            }`}
          >
            الويب كاملاً 🖥️
          </button>
        </div>
      </div>

      {/* Actual Responsive Body Wrapper */}
      <div className="w-full max-w-7xl mx-auto flex justify-center items-center h-full">
        {useSimulator ? (
          /* Phone Simulator */
          <div className={`relative mx-auto w-full max-w-[410px] aspect-[9/19.2] h-[866px] bg-neutral-950 overflow-hidden flex flex-col scale-95 md:scale-100 ring-4 shadow-[0_45px_90px_-25px_rgba(0,0,0,0.95)] ${
            deviceType === 'android' 
              ? 'rounded-[56px] border-[12px] border-neutral-800 ring-neutral-900' 
              : 'rounded-[60px] border-[14px] border-zinc-850 ring-zinc-900'
          }`}>
            
            {/* Conditionalized Top camera or Interactive Dynamic Island */}
            {deviceType === 'ios' ? (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-50 flex items-center justify-between px-3 text-[9px] text-white/90 shadow-inner group cursor-pointer hover:w-36 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full border border-zinc-800 shrink-0" />
                <span className="font-mono text-[8.5px] opacity-85 select-none tracking-tight text-white">Hadramout</span>
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shrink-0" />
              </div>
            ) : (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-black rounded-full border-2 border-neutral-800 z-50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-950/90 rounded-full" />
              </div>
            )}

            {/* Smart Frame Header Status Area */}
            {deviceType === 'ios' ? (
              /* iOS Status Bar */
              <div className="absolute top-0 inset-x-0 h-9 bg-neutral-950/85 backdrop-blur-xs z-40 flex justify-between items-center px-7 pointer-events-none text-[10px] font-bold text-white/95">
                <div className="flex items-center gap-1 font-sans">
                  <span className="mt-0.5">{currentTime}</span>
                </div>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-[8px] mt-0.5 tracking-tight font-black">5G</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c3.9 3.51 10.1 3.51 14 0l1.38-1.79C21.26 16.07 22 14.12 22 12c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                  </svg>
                  <div className="w-5.5 h-3 border border-white/60 rounded-[4px] p-0.5 flex relative">
                    <div className="h-full w-4 bg-emerald-500 rounded-[2px]" />
                    <div className="absolute top-0.5 -right-0.5 w-[2px] h-1.5 bg-white/60 rounded-r-sm" />
                  </div>
                </div>
              </div>
            ) : (
              /* Android Elegant Status Bar Area */
              <div className="absolute top-0 inset-x-0 h-9 bg-neutral-950/85 backdrop-blur-xs z-40 flex justify-between items-center px-6 pointer-events-none text-[10px] font-bold text-white/95">
                <div className="flex items-center gap-1">
                  <span className="font-mono mt-0.5">{currentTime}</span>
                </div>
                
                {/* Dynamic Notification Mini Icons on the Left side of bar */}
                <div className="flex items-center gap-1.5 mr-auto pl-3">
                  <svg className="w-3.5 h-3.5 fill-[#C5A059] opacity-80" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/></svg>
                  {androidInstallStatus === 'installed' && (
                    <svg className="w-3 h-3 text-emerald-400 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.3414C16.1414 15.3414 15 14.2 15 12.82C15 11.44 16.1414 10.3 17.523 10.3C18.9046 10.3 20 11.44 20 12.82C20 14.2 18.9046 15.3414 17.523 15.3414Z"/>
                    </svg>
                  )}
                </div>

                {/* Classic Android Material Indicators */}
                <div className="flex items-center gap-1.5 font-mono">
                  {/* 5G */}
                  <span className="text-[8px] font-sans mr-0.5 opacity-90 tracking-tighter">LTE+</span>
                  
                  {/* Signal Bars */}
                  <svg className="w-3.5 h-3.5 text-white/95" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 22h20V2z" />
                  </svg>

                  {/* Battery with percentage */}
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-normal opacity-85">91%</span>
                    <div className="w-5.5 h-3 border border-white/60 rounded-[4px] p-0.5 flex relative">
                      <div className="h-full w-4 bg-emerald-500 rounded-[2px]" />
                      <div className="absolute top-0.5 -right-0.5 w-[2px] h-1.5 bg-white/60 rounded-r-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Virtual Simulated App Content or Interactive Launcher HomeScreen */}
            <div className="flex-1 mt-9 h-full text-right overflow-hidden relative">
              {showAndroidHome ? (
                deviceType === 'ios' ? <IosHomeScreen /> : <AndroidHomeScreen />
              ) : (
                <AppContent />
              )}
            </div>
            
            {/* Platform-Specific Bottom Navigation Bar */}
            {deviceType === 'ios' ? (
              /* iOS Elegant Bottom Home grab bar pill */
              <div className="h-10 bg-neutral-950 flex items-center justify-center relative select-none shrink-0 border-t border-neutral-900">
                <button 
                  onClick={() => { setShowAndroidHome(true); setIsCartOpen(false); setSelectedItemForOptions(null); }} 
                  className="w-32 h-1 bg-white/70 rounded-full hover:bg-white active:scale-95 transition-all duration-150"
                  title="iOS Home"
                />
              </div>
            ) : (
              /* Simulated Android Bottom Navigation Bar (Back, Home, Recents) */
              <div className="h-12 bg-neutral-950 border-t border-neutral-900 flex items-center justify-around px-8 z-55 select-none text-neutral-450 shrink-0">
                <button 
                  onClick={handleAndroidBack} 
                  className="hover:text-[#C5A059] transition-colors p-3 w-12 flex justify-center items-center active:scale-75 duration-100"
                  title="Back"
                >
                  {/* Triangled back button */}
                  <svg width="12" height="12" viewBox="0 0 24 24" className="fill-none stroke-current stroke-[3] rotate-180">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => { setShowAndroidHome(true); setIsCartOpen(false); setSelectedItemForOptions(null); }} 
                  className="hover:text-[#C5A059] transition-colors p-3 w-12 flex justify-center items-center active:scale-75 duration-100"
                  title="Home Launcher"
                >
                  {/* Soft circle button */}
                  <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-current" />
                </button>
                
                <button 
                  onClick={() => {
                    setActiveNotification('⚙️ ذاكرة الوصول العشوائي: 4.8 جيجابايت متوفرة من أصل 8 جيجابايت لتجربة ذكية فائقة السرعة! ✨');
                    setTimeout(() => setActiveNotification(null), 5000);
                  }} 
                  className="hover:text-[#C5A059] transition-colors p-3 w-12 flex justify-center items-center active:scale-75 duration-100"
                  title="Recents"
                >
                  {/* Rounded square button */}
                  <div className="w-3 h-3 rounded-[3px] border-[2.2px] border-current" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Full Screen Responsive Layout (Translates cleanly on native viewports) */
          <div className="w-full min-h-[90vh] bg-white rounded-[32px] overflow-hidden shadow-2xl relative border-4 border-zinc-100">
            <AppContent />
          </div>
        )}
      </div>
    </div>
  );
}
