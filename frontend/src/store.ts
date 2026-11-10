import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  soldCount?: number;
  image: string;
  secondaryImage?: string;
  color: string;
  description: string;
  stock: number;
  isDarazMall?: boolean;
  freeShipping?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  sizes: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: (CartItem & { product: Product })[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD' | 'Card';
  date: string;
  trackingNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  isVip: boolean;
  vipTier?: 'Silver' | 'Gold' | 'DarazClub';
  joinDate: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Logistics' | 'Marketing' | 'Inventory' | 'Salaries' | 'Packaging' | 'Utilities';
  amount: number;
  date: string;
  note?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
  minPurchase: number;
  isActive: boolean;
  expiryDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isVip?: boolean;
  vipTier?: 'Silver' | 'Gold' | 'DarazClub';
}

interface AppStoreState {
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  expenses: Expense[];
  discounts: DiscountCode[];
  
  cart: CartItem[];
  wishlist: string[];
  activeCurrency: string;
  searchQuery: string;
  
  currentUser: UserProfile | null;
  loginUser: (user: UserProfile, token: string) => void;
  logoutUser: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  addToCart: (productId: string, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber' | 'status'> & { status?: Order['status'] }) => Order;
  setSearchQuery: (query: string) => void;
  upgradeToVip: (tier: 'Silver' | 'Gold' | 'DarazClub') => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  addDiscount: (discount: Omit<DiscountCode, 'id'>) => void;
  toggleDiscount: (id: string) => void;

  toggleCustomerVip: (customerId: string) => void;
  resetToDemoData: () => void;
}

// Category images with precise product matches - 100% Faceless
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: "Women's Fashion",
    slug: 'fashion',
    // Elegant stitched embroidered formal dress on a hanger display
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400',
    itemCount: 142
  },
  {
    id: 'cat-abayas',
    name: "Abayas & Hijabs",
    slug: 'abayas',
    // Pure black modest abaya draped flat-lay / mannequin view without face
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400',
    itemCount: 89
  },
  {
    id: 'cat-unstitched',
    name: "Unstitched Fabric",
    slug: 'unstitched',
    // Rolls of vibrant embroidered Pakistani lawn & silk fabrics
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400',
    itemCount: 65
  },
  {
    id: 'cat-bags',
    name: "Bags & Clutches",
    slug: 'bags',
    // Luxury leather handbag studio product shot
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400',
    itemCount: 48
  },
  {
    id: 'cat-jewelry',
    name: "Jewellery & Watches",
    slug: 'jewelry',
    // Gold necklace, rings, and earrings jewelry presentation
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    itemCount: 120
  },
  {
    id: 'cat-shoes',
    name: "Shoes & Khussa",
    slug: 'shoes',
    // Traditional embroidered footwear & heels
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400',
    itemCount: 52
  },
  {
    id: 'cat-beauty',
    name: "Health & Beauty",
    slug: 'beauty',
    // Skincare cosmetics and perfume bottles
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400',
    itemCount: 94
  },
  {
    id: 'cat-electronics',
    name: "Electronic Accessories",
    slug: 'electronics',
    // Modern wireless headphones & electronics
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    itemCount: 38
  }
];

// Empty products list ready for custom products via Admin
const INITIAL_PRODUCTS: Product[] = [];

const INITIAL_CUSTOMERS: Customer[] = [];
const INITIAL_ORDERS: Order[] = [];
const INITIAL_EXPENSES: Expense[] = [];
const INITIAL_DISCOUNTS: DiscountCode[] = [
  { id: 'disc-1', code: 'DARAZ10', percentage: 10, minPurchase: 2000, isActive: true, expiryDate: '2026-12-31' },
];

export const useStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      expenses: INITIAL_EXPENSES,
      discounts: INITIAL_DISCOUNTS,
      
      cart: [],
      wishlist: [],
      activeCurrency: 'PKR',
      searchQuery: '',
      
      currentUser: null,

      loginUser: (user, token) => {
        localStorage.setItem('memon_user_token', token);
        localStorage.setItem('memon_user_data', JSON.stringify(user));
        set({ currentUser: user });
      },

      logoutUser: () => {
        localStorage.removeItem('memon_user_token');
        localStorage.removeItem('memon_user_data');
        set({ currentUser: null });
      },

      updateProfile: (updated) => {
        set((state) => {
          if (!state.currentUser) return state;
          const nextUser = { ...state.currentUser, ...updated };
          localStorage.setItem('memon_user_data', JSON.stringify(nextUser));
          return { currentUser: nextUser };
        });
      },

      addToCart: (productId, quantity = 1, selectedSize, selectedColor) => set((state) => {
        const existingIndex = state.cart.findIndex(item => 
          item.productId === productId && item.selectedSize === selectedSize
        );
        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex].quantity += quantity;
          return { cart: newCart };
        }
        return { 
          cart: [...state.cart, { productId, quantity, selectedSize: selectedSize || 'Standard', selectedColor }] 
        };
      }),

      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: quantity <= 0 
          ? state.cart.filter(item => item.productId !== productId)
          : state.cart.map(item => item.productId === productId ? { ...item, quantity } : item)
      })),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId)
      })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),

      placeOrder: (orderData) => {
        const state = get();
        const newOrderId = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
        const tracking = `TCS-${Math.floor(100000 + Math.random() * 900000)}-PK`;

        const newOrder: Order = {
          status: 'Pending',
          ...orderData,
          id: newOrderId,
          date: new Date().toISOString(),
          trackingNumber: tracking,
        };

        const updatedProducts = state.products.map(product => {
          const orderedItem = orderData.items.find(i => i.productId === product.id);
          if (orderedItem) {
            return {
              ...product,
              stock: Math.max(0, product.stock - orderedItem.quantity),
              soldCount: (product.soldCount || 0) + orderedItem.quantity
            };
          }
          return product;
        });

        set((s) => ({
          orders: [newOrder, ...s.orders],
          products: updatedProducts,
          cart: []
        }));

        return newOrder;
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      upgradeToVip: (tier) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, isVip: true, vipTier: tier } : null
      })),

      addProduct: (prod) => set((state) => {
        const newId = `prod-${Date.now()}`;
        return { products: [{ ...prod, id: newId }, ...state.products] };
      }),

      updateProduct: (id, updatedFields) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id),
        cart: state.cart.filter(c => c.productId !== id),
        wishlist: state.wishlist.filter(w => w !== id)
      })),

      updateStock: (id, newStock) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, stock: newStock } : p)
      })),

      addCategory: (cat) => set((state) => ({
        categories: [...state.categories, { ...cat, id: `cat-${Date.now()}` }]
      })),

      updateCategory: (id, catData) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...catData } : c)
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),

      addExpense: (expense) => set((state) => ({
        expenses: [{ ...expense, id: `exp-${Date.now()}` }, ...state.expenses]
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),

      addDiscount: (discount) => set((state) => ({
        discounts: [{ ...discount, id: `disc-${Date.now()}` }, ...state.discounts]
      })),

      toggleDiscount: (id) => set((state) => ({
        discounts: state.discounts.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d)
      })),

      toggleCustomerVip: (customerId) => set((state) => ({
        customers: state.customers.map(c => c.id === customerId ? { ...c, isVip: !c.isVip } : c)
      })),

      resetToDemoData: () => set({
        categories: INITIAL_CATEGORIES,
        products: INITIAL_PRODUCTS,
        orders: INITIAL_ORDERS,
        customers: INITIAL_CUSTOMERS,
        expenses: INITIAL_EXPENSES,
        discounts: INITIAL_DISCOUNTS,
        cart: [],
        wishlist: [],
        activeCurrency: 'PKR',
      })
    }),
    {
      name: 'memon_traders_karachi_v9',
    }
  )
);
