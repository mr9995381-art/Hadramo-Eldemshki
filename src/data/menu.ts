import { MenuItem } from '../types';

export const MENU_DATA: MenuItem[] = [
  // وجبة الشياكة
  {
    id: 'shiyaka-1',
    name: 'Shiyaka Meal',
    arabicName: 'وجبة الشياكة',
    price: 230,
    arabicDescription: 'ربع فرخة + ثمن طرب + ثمن كفتة + أرز كبير + السلطات',
    arabicCategory: 'وجبات جديدة',
    category: 'New Meals'
  },
  // الوجبات الفردية
  {
    id: 'ind-1',
    name: 'Quarter Chicken Leg Meal',
    arabicName: 'ربع فرخة ورك + الأرز + السلطات',
    price: 90,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-2',
    name: 'Quarter Chicken Leg + 2 Kofta Meal',
    arabicName: 'ربع فرخة ورك + 2 كفتة + الأرز + السلطات',
    price: 130,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-3',
    name: 'Quarter Chicken Breast Meal',
    arabicName: 'ربع فرخة صدر + الأرز + السلطات',
    price: 100,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-4',
    name: 'Quarter Chicken Breast + 2 Kofta Meal',
    arabicName: 'ربع فرخة صدر + 2 كفتة + الأرز + السلطات',
    price: 140,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-5',
    name: 'Quarter Chicken Leg + Mixed Veg Meal',
    arabicName: 'ربع فرخة ورك + خضار مشكل + الأرز + السلطات',
    price: 130,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-6',
    name: 'Quarter Chicken Leg + 2 Tarb Meal',
    arabicName: 'ربع فرخة ورك + 2 طرب + الأرز + السلطات',
    price: 170,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-7',
    name: 'Quarter Chicken Leg + Quarter Kofta Meal',
    arabicName: 'ربع فرخة ورك + ربع كفتة + الأرز + السلطات',
    price: 210,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-8',
    name: 'Quarter Chicken Leg + Quarter Tarb Meal',
    arabicName: 'ربع فرخة ورك + ربع طرب كبير + الأرز + السلطات',
    price: 260,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-9',
    name: 'Quarter Kofta + Quarter Tarb Meal',
    arabicName: 'ربع كفتة + ربع طرب كبير + الأرز + السلطات',
    price: 300,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-10',
    name: 'Quarter Kofta Meal',
    arabicName: 'ربع كفتة + الأرز + السلطات',
    price: 140,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-11',
    name: 'Eighth Kofta Meal',
    arabicName: 'ثمن كفتة + الأرز + السلطات',
    price: 80,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-12',
    name: 'Quarter Tarb Meal',
    arabicName: 'ربع طرب + الأرز + السلطات',
    price: 190,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  {
    id: 'ind-13',
    name: 'Quarter Shish Tawook Meal',
    arabicName: 'ربع شيش طاووق + الأرز + السلطات',
    price: 180,
    arabicCategory: 'الوجبات الفردية',
    category: 'Individual Meals'
  },
  // وجبات النص المميزة
  {
    id: 'half-1',
    name: 'Half Grilled Chicken Meal',
    arabicName: 'نص فرخة مشوية + الأرز + السلطات',
    price: 175,
    arabicCategory: 'وجبات النص المميزة',
    category: 'Half Meals'
  },
  {
    id: 'half-2',
    name: 'Half Chicken + 3 Kofta Meal',
    arabicName: 'نص فرخة + 3 كفتة + الأرز + السلطات',
    price: 230,
    arabicCategory: 'وجبات النص المميزة',
    category: 'Half Meals'
  },
  {
    id: 'half-3',
    name: 'Half Chicken + Quarter Kofta Meal',
    arabicName: 'نص فرخة + ربع كفتة + الأرز + السلطات',
    price: 300,
    arabicCategory: 'وجبات النص المميزة',
    category: 'Half Meals'
  },
  {
    id: 'half-4',
    name: 'Half Chicken + Quarter Tarb Meal',
    arabicName: 'نص فرخة + ربع طرب + الأرز + السلطات',
    price: 340,
    arabicCategory: 'وجبات النص المميزة',
    category: 'Half Meals'
  },
  {
    id: 'half-5',
    name: 'Half Chicken + Eighth Tarb Meal',
    arabicName: 'نص فرخة + ثمن طرب + الأرز + السلطات',
    price: 260,
    arabicCategory: 'وجبات النص المميزة',
    category: 'Half Meals'
  },
  // وجبات جديدة
  {
    id: 'new-1',
    name: 'Quarter Sausage + Quarter Shish',
    arabicName: 'ربع سجق + ربع شيش طاووق + أرز كبير',
    price: 300,
    arabicCategory: 'وجبات جديدة',
    category: 'New Meals'
  },
  {
    id: 'new-2',
    name: 'Quarter Steak + Quarter Chicken + Eighth Kofta',
    arabicName: 'ربع ستيك + ربع ورك + ثمن كفتة + أرز كبير',
    price: 350,
    arabicCategory: 'وجبات جديدة',
    category: 'New Meals'
  },
  {
    id: 'new-3',
    name: 'Quarter Steak + Quarter Shish',
    arabicName: 'ربع ستيك + ربع شيش طاووق + أرز كبير',
    price: 350,
    arabicCategory: 'وجبات جديدة',
    category: 'New Meals'
  },
  // ركن المندي والكبسة
  {
    id: 'm-ind-1',
    name: 'Quarter Chicken Leg Mandi',
    arabicName: 'ربع فراخ ورك + أرز ص + سلطه',
    price: 90,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-2',
    name: 'Quarter Chicken Breast Mandi',
    arabicName: 'ربع فراخ صدر + أرز ص + سلطه',
    price: 100,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-3',
    name: 'Half Chicken Mandi',
    arabicName: 'نصف فراخ + أرز ك + سلطه',
    price: 175,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-4',
    name: 'Whole Chicken Mandi',
    arabicName: 'فرخة + 2 أرز ك + سلطه',
    price: 350,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-5',
    name: 'Chicken + Salad + Bread',
    arabicName: 'فرخة + سلطة + عيش',
    price: 310,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-6',
    name: 'Meat Serving + Rice',
    arabicName: 'نفر لحم + أرز + سلطه',
    price: 450,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-7',
    name: 'Moza + Rice',
    arabicName: 'موزة + أرز + سلطه',
    price: 420,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-8',
    name: 'Eighth Teis Mandi',
    arabicName: 'ثمن تيس + أرز + سلطه',
    price: 900,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-9',
    name: 'Quarter Teis Mandi',
    arabicName: 'ربع تيس + أرز + سلطه',
    price: 1800,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  {
    id: 'm-ind-10',
    name: 'Half Teis Mandi',
    arabicName: 'نصف تيس + أرز + سلطه',
    price: 3600,
    arabicCategory: 'ركن المندي والكبسة',
    category: 'Mandi & Kabsa'
  },
  // ركن العزائم والتسويات
  {
    id: 'ban-1',
    name: 'Mandi Duck',
    arabicName: 'بطه مندي',
    price: 700,
    arabicCategory: 'ركن العزائم والتسويات',
    category: 'Banquets'
  },
  {
    id: 'ban-2',
    name: 'Mandi Lamb',
    arabicName: 'خروف مندي + أرز',
    price: 14500,
    arabicCategory: 'ركن العزائم والتسويات',
    category: 'Banquets'
  },
  {
    id: 'ban-3',
    name: 'Mandi Teis',
    arabicName: 'تيس مندي + أرز',
    price: 7200,
    arabicCategory: 'ركن العزائم والتسويات',
    category: 'Banquets'
  },
  {
    id: 'ban-4',
    name: 'Mandi Turkey',
    arabicName: 'ديك رومي + أرز',
    price: 3000,
    arabicCategory: 'ركن العزائم والتسويات',
    category: 'Banquets'
  },
  // ركن المشويات
  {
    id: 'grill-1',
    name: 'Kofta',
    arabicName: 'كفته + عيش + سلطات',
    prices: { quarter: 120, third: 170, half: 230, kilo: 450 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-2',
    name: 'Kebab',
    arabicName: 'كباب + عيش + سلطات',
    prices: { quarter: 300, third: 430, half: 600, kilo: 1200 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-3',
    name: 'Mixed Grill',
    arabicName: 'كباب مشكل + عيش + سلطات',
    prices: { quarter: 220, third: 300, half: 450, kilo: 900 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-4',
    name: 'Tarb',
    arabicName: 'طرب + عيش + سلطات',
    prices: { quarter: 170, third: 220, half: 330, kilo: 650 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-5',
    name: 'Ribs',
    arabicName: 'ريش + عيش + سلطات',
    prices: { quarter: 320, third: 425, half: 625, kilo: 1250 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-6',
    name: 'Grilled Steak',
    arabicName: 'استيك مشوي + سلطات',
    prices: { quarter: 200, third: 270, half: 350, kilo: 700 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-7',
    name: 'Grilled Liver',
    arabicName: 'كبدة مشوي + عيش + سلطات',
    prices: { quarter: 150, third: 210, half: 310, kilo: 600 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },
  {
    id: 'grill-8',
    name: 'Shish Taouk',
    arabicName: 'شيش طاووق + عيش + سلطات',
    prices: { quarter: 160, third: 190, half: 280, kilo: 550 },
    arabicCategory: 'ركن المشويات',
    category: 'Grills'
  },

  // وجبات الأسرة
  {
    id: 'family-1',
    name: 'Family Meal 1',
    arabicName: 'وجبة الأسرة 1',
    price: 400,
    arabicDescription: 'نص فرخة + نص كفته + 2 أرز + السلطات + العيش',
    arabicCategory: 'وجبات الأسرة',
    category: 'Family Meals'
  },
  {
    id: 'family-2',
    name: 'Family Meal 2',
    arabicName: 'وجبة الأسرة 2',
    price: 480,
    arabicDescription: 'فرخة + ربع كفته + 3 أرز بسمتي + السلطات + العيش',
    arabicCategory: 'وجبات الأسرة',
    category: 'Family Meals'
  },
  {
    id: 'family-3',
    name: 'Family Meal 3',
    arabicName: 'وجبة الأسرة 3',
    price: 550,
    arabicDescription: 'فرخة مشوية + نص كفته + 3 أرز + السلطات + العيش',
    arabicCategory: 'وجبات الأسرة',
    category: 'Family Meals'
  },
  {
    id: 'family-4',
    name: 'Family Meal 4',
    arabicName: 'وجبة الأسرة 4',
    price: 640,
    arabicDescription: 'كيلو كفته + نص فرخة + 3 أرز + السلطات + العيش',
    arabicCategory: 'وجبات الأسرة',
    category: 'Family Meals'
  },

  // صواني ومندي
  {
    id: 'tray-1',
    name: 'Happiness Tray',
    arabicName: 'صينية السعادة (لمة العائلة)',
    price: 680,
    arabicDescription: 'فرخة + 1/2 كفته + سرفيس أرز مندي + 4 سمبوسك + السلطات + العيش',
    arabicCategory: 'صواني ومندي',
    category: 'Mandi & Trays'
  },
  {
    id: 'tray-2',
    name: 'Gathering Tray',
    arabicName: 'صينية اللمة (ربع تيس)',
    price: 3000,
    arabicDescription: 'ربع تيس مندي + فرخة مشوي أو مندي + كيلو كفته + نص طرب + أرز مندي + السلطات + العيش',
    arabicCategory: 'صواني ومندي',
    category: 'Mandi & Trays'
  },
  {
    id: 'tray-3',
    name: 'Generous Family Tray',
    arabicName: 'صينية العائلة الكريمة (ثمن تيس)',
    price: 1500,
    arabicDescription: 'ثمن تيس مندي + فرخة مشوي أو مندي + نص كفته + سرفيس أرز مندي + السلطات + العيش',
    arabicCategory: 'صواني ومندي',
    category: 'Mandi & Trays'
  },
  {
    id: 'mandi-1',
    name: 'Half Chicken Mandi',
    arabicName: 'نصف فرخة مندي',
    price: 130,
    arabicDescription: 'نصف فرخة مندي مطبوخة بعناية مع أرز مندي طويل الحبة والسلطات',
    arabicCategory: 'صواني ومندي',
    category: 'Mandi & Trays'
  },

  // ركن المطبخ
  {
    id: 'kitchen-1',
    name: 'Stuffed Pigeon',
    arabicName: 'فرد حمام محشي + بطاطس',
    price: 180,
    arabicCategory: 'ركن المطبخ',
    category: 'Kitchen'
  },
  {
    id: 'kitchen-2',
    name: 'Pasta Bechamel',
    arabicName: 'مكرونة فرن',
    price: 60,
    arabicCategory: 'ركن المطبخ',
    category: 'Kitchen'
  },
  {
    id: 'kitchen-3',
    name: 'Basmati Rice Small',
    arabicName: 'أرز بسمتي صغير',
    price: 30,
    arabicCategory: 'ركن المطبخ',
    category: 'Kitchen'
  },
  {
    id: 'kitchen-4',
    name: 'Basmati Rice Large',
    arabicName: 'أرز بسمتي كبير',
    price: 45,
    arabicCategory: 'ركن المطبخ',
    category: 'Kitchen'
  },
  {
    id: 'kitchen-5',
    name: 'Molokhia',
    arabicName: 'ملوخية',
    price: 40,
    arabicCategory: 'ركن المطبخ',
    category: 'Kitchen'
  },
  {
    id: 'kitchen-6',
    name: 'Mixed Vegetables Tagine',
    arabicName: 'طاجن خضار تورلي باللحمه',
    price: 230,
    arabicCategory: 'ركن المطبخ',
    category: 'Kitchen'
  },

  // سندوتشات
  {
    id: 'sand-1',
    name: 'Kofta Sandwich',
    arabicName: 'ساندوتش كفتة',
    price: 50,
    arabicCategory: 'ركن السندوتشات',
    category: 'Sandwiches'
  },
  {
    id: 'sand-2',
    name: 'Hawawshi Sandwich',
    arabicName: 'ساندوتش حواوشي',
    price: 60,
    arabicCategory: 'ركن السندوتشات',
    category: 'Sandwiches'
  },
  {
    id: 'sand-3',
    name: 'Shish Taouk Sandwich',
    arabicName: 'ساندوتش شيش طاووق',
    price: 55,
    arabicCategory: 'ركن السندوتشات',
    category: 'Sandwiches'
  },
  {
    id: 'sand-4',
    name: 'Kebab Sandwich',
    arabicName: 'ساندوتش كباب',
    price: 80,
    arabicCategory: 'ركن السندوتشات',
    category: 'Sandwiches'
  },
  {
    id: 'sand-5',
    name: 'Tarb Sandwich',
    arabicName: 'ساندوتش طرب',
    price: 65,
    arabicCategory: 'ركن السندوتشات',
    category: 'Sandwiches'
  },

  // سلطات
  {
    id: 'salad-1',
    name: 'Green Salad',
    arabicName: 'سلطة خضراء',
    price: 10,
    arabicCategory: 'ركن السلطات',
    category: 'Salads'
  },
  {
    id: 'salad-2',
    name: 'Tahini',
    arabicName: 'طحينه',
    price: 10,
    arabicCategory: 'ركن السلطات',
    category: 'Salads'
  },
  {
    id: 'salad-3',
    name: 'Tomiya',
    arabicName: 'ثومية',
    price: 15,
    arabicCategory: 'ركن السلطات',
    category: 'Salads'
  },
  {
    id: 'salad-4',
    name: 'Baba Ghanoush',
    arabicName: 'بابا غنوج',
    price: 15,
    arabicCategory: 'ركن السلطات',
    category: 'Salads'
  },
  {
    id: 'salad-5',
    name: 'Coleslaw',
    arabicName: 'كول سلو',
    price: 20,
    arabicCategory: 'ركن السلطات',
    category: 'Salads'
  },
  {
    id: 'salad-6',
    name: 'Pickled Vegetables',
    arabicName: 'مخلل مشكل',
    price: 10,
    arabicCategory: 'ركن السلطات',
    category: 'Salads'
  }
];

export const CATEGORIES = [
  { name: 'Individual Meals', arabicName: 'الوجبات الفردية' },
  { name: 'Half Meals', arabicName: 'وجبات النص المميزة' },
  { name: 'Mandi & Kabsa', arabicName: 'ركن المندي والكبسة' },
  { name: 'Banquets', arabicName: 'ركن العزائم والتسويات' },
  { name: 'New Meals', arabicName: 'وجبات جديدة' },
  { name: 'Grills', arabicName: 'ركن المشويات' },
  { name: 'Family Meals', arabicName: 'وجبات الأسرة' },
  { name: 'Sandwiches', arabicName: 'ركن السندوتشات' },
  { name: 'Salads', arabicName: 'ركن السلطات' }
];
