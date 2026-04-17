export interface MenuItem {
  id: string;
  name: string;
  arabicName: string;
  price?: number;
  prices?: {
    quarter?: number;
    third?: number;
    half?: number;
    kilo?: number;
  };
  description?: string;
  arabicDescription?: string;
  category: string;
  arabicCategory: string;
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: 'quarter' | 'third' | 'half' | 'kilo';
  finalPrice: number;
}
