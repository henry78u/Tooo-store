import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, OrderRecord, OrderStatus } from '../types';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'accent';
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  addresses: {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    isDefault: boolean;
  }[];
}

interface StoreState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, colour: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  
  // Promo code
  promoCode: string | null;
  discountPercentage: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Search Overlay
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Quick Add / Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // User
  user: UserProfile;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserProfile['addresses'][0], 'id'>) => void;

  // Orders
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  getOrder: (reference: string) => OrderRecord | undefined;
}

export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    orderReference: 'TOOO-84920',
    date: '2026-10-24',
    items: [
      {
        productId: 'prod-01',
        productName: 'Architectural Wool Overcoat',
        size: 'L',
        colour: 'Oatmeal Beige',
        quantity: 1,
        price: 115000,
        image: '/src/assets/images/category_outerwear_streetwear_1793045650285.jpg',
      },
      {
        productId: 'prod-09',
        productName: '300 GSM Heavyweight Box Tee',
        size: 'L',
        colour: 'Vintage Black',
        quantity: 2,
        price: 24000,
        image: '/src/assets/images/editorial_story_campaign_1793045648712.jpg',
      },
    ],
    subtotal: 163000,
    shippingFee: 5000,
    discount: 16300,
    total: 151700,
    address: {
      fullName: 'Chiemeka Davies',
      email: 'c.davies@example.com',
      phone: '+234 803 555 0192',
      street: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      notes: 'Please ring bell upon arrival.',
    },
    paymentMethod: 'Card (Demo)',
    paymentStatus: 'Simulated Paid',
    deliveryStatus: 'Processing',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-10-24 09:32 AM',
        completed: true,
        description: 'Order created with reference TOOO-84920',
      },
      {
        status: 'Confirmed',
        timestamp: '2026-10-24 09:40 AM',
        completed: true,
        description: 'Payment authorized and inventory reserved',
      },
      {
        status: 'Processing',
        timestamp: '2026-10-25 11:15 AM',
        completed: true,
        description: 'Garments steamed, wrapped in recycled tissue, and boxed at Lagos Atelier',
      },
      {
        status: 'Shipped',
        timestamp: 'Estimated Oct 27',
        completed: false,
        description: 'Handover to dedicated courier dispatch',
      },
      {
        status: 'Delivered',
        timestamp: 'Pending Delivery',
        completed: false,
        description: 'Delivery to customer doorstep',
      },
    ],
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: (product, size, colour, quantity = 1) => {
        const cartItemId = `${product.id}-${size}-${colour}`;
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === cartItemId);

        let updatedCart: CartItem[];
        if (existingItem) {
          updatedCart = currentCart.map((i) =>
            i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          updatedCart = [
            ...currentCart,
            {
              id: cartItemId,
              product,
              selectedSize: size,
              selectedColour: colour,
              quantity,
              unitPrice: product.price,
            },
          ];
        }

        set({ cart: updatedCart, isCartOpen: true });

        get().addToast({
          title: 'Added to Bag',
          description: `${product.name} (${size} · ${colour})`,
          type: 'success',
        });
      },

      updateQuantity: (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          ),
        });
      },

      removeFromCart: (cartItemId) => {
        const item = get().cart.find((i) => i.id === cartItemId);
        set({
          cart: get().cart.filter((i) => i.id !== cartItemId),
        });
        if (item) {
          get().addToast({
            title: 'Removed from Bag',
            description: item.product.name,
            type: 'info',
          });
        }
      },

      clearCart: () => set({ cart: [] }),

      promoCode: null,
      discountPercentage: 0,
      applyPromoCode: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'TOOO10') {
          set({ promoCode: clean, discountPercentage: 10 });
          get().addToast({
            title: 'Promo Applied',
            description: '10% discount applied to your order',
            type: 'accent',
          });
          return { success: true, message: '10% discount code applied' };
        }
        if (clean === 'FIRSTLOOK') {
          set({ promoCode: clean, discountPercentage: 15 });
          get().addToast({
            title: 'Promo Applied',
            description: '15% new client discount applied',
            type: 'accent',
          });
          return { success: true, message: '15% new client discount applied' };
        }
        return { success: false, message: 'Invalid promo code. Try "TOOO10"' };
      },
      removePromoCode: () => set({ promoCode: null, discountPercentage: 0 }),

      wishlist: ['prod-01', 'prod-03'],
      toggleWishlist: (productId: string) => {
        const currentWishlist = get().wishlist;
        const exists = currentWishlist.includes(productId);
        if (exists) {
          set({ wishlist: currentWishlist.filter((id) => id !== productId) });
          get().addToast({
            title: 'Removed from Wishlist',
            type: 'info',
          });
        } else {
          set({ wishlist: [...currentWishlist, productId] });
          get().addToast({
            title: 'Saved to Wishlist',
            type: 'success',
          });
        }
      },
      isInWishlist: (productId: string) => get().wishlist.includes(productId),

      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      toasts: [],
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 3200);
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      user: {
        name: 'Chiemeka Davies',
        email: 'c.davies@example.com',
        phone: '+234 803 555 0192',
        isLoggedIn: true,
        addresses: [
          {
            id: 'addr-1',
            label: 'Home (Lekki)',
            street: '14 Admiralty Way, Lekki Phase 1',
            city: 'Lagos',
            state: 'Lagos',
            isDefault: true,
          },
          {
            id: 'addr-2',
            label: 'Atelier / Studio',
            street: '42 Isaac John St, Ikeja GRA',
            city: 'Lagos',
            state: 'Lagos',
            isDefault: false,
          },
        ],
      },
      loginUser: (email, name = 'Valued Customer') =>
        set((state) => ({
          user: {
            ...state.user,
            email,
            name: name || state.user.name,
            isLoggedIn: true,
          },
        })),
      logoutUser: () =>
        set((state) => ({
          user: {
            ...state.user,
            isLoggedIn: false,
          },
        })),
      updateUserProfile: (profile) =>
        set((state) => ({
          user: {
            ...state.user,
            ...profile,
          },
        })),
      addAddress: (address) =>
        set((state) => ({
          user: {
            ...state.user,
            addresses: [
              ...state.user.addresses,
              { ...address, id: `addr-${Date.now()}` },
            ],
          },
        })),

      orders: INITIAL_DEMO_ORDERS,
      addOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders],
        })),
      getOrder: (reference) => {
        return get().orders.find(
          (o) => o.orderReference.toLowerCase() === reference.trim().toLowerCase()
        );
      },
    }),
    {
      name: 'tooo-store-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        promoCode: state.promoCode,
        discountPercentage: state.discountPercentage,
        user: state.user,
        orders: state.orders,
      }),
    }
  )
);
