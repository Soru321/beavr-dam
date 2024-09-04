import { inferRouterOutputs } from "@trpc/server";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AppRouter } from "@/server/routers";

export type CartItem = {
  id: string;
  product: inferRouterOutputs<AppRouter>["product"]["getById"];
  quantity: number;
  amount: number;
};

interface CartStore {
  items: CartItem[];
  amount: number;
  addItem: (item: CartItem) => void;
  addItems: (items: CartItem[]) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateAmount: () => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  // calculateItemPrice: (item: Item) => number;
  // calculateAmount: () => number;
  // set: (
  //   partial:
  //     | CartStore
  //     | Partial<CartStore>
  //     | ((state: CartStore) => CartStore | Partial<CartStore>),
  //   replace?: boolean | undefined,
  // ) => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      amount: 0,

      addItem: (item) => {
        set({ items: [...get().items, item] });
        get().updateAmount();
        toast.success("Product added to the cart!");
      },

      addItems: (items) => {
        set({ items: [...get().items, ...items] });
        get().updateAmount();
        toast.success("Products added to the cart!");
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        get().updateAmount();
        toast.success("Product removed from the cart!");
      },

      removeAll: () => {
        set({ items: [] });
        get().updateAmount();
      },

      updateAmount: () => {
        set({
          amount: get().items.reduce((total, item) => total + item.amount, 0),
        });
      },

      decrementQuantity: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.quantity > 1 && !!item.product
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                  amount: +item.product.price * (item.quantity - 1),
                }
              : item,
          ),
        });
        get().updateAmount();
      },

      incrementQuantity: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id && !!item.product
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  amount: +item.product.price * (item.quantity + 1),
                }
              : item,
          ),
        });
        get().updateAmount();
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// export function useCart() {
//   const authStatus = useSession().status;
//   const router = useRouter();
//   const store = useStore();
//   const { set } = store;

//   const getItems = trpcClient.cart.get.useQuery(undefined, {
//     enabled: authStatus === "authenticated",
//   });

//   const addItem = trpcClient.cart.add.useMutation({
//     onSuccess({ message }) {
//       getItems.refetch();
//       toast.success(message);
//       router.replace(homeRoute, { scroll: false });
//     },
//     onError(error) {
//       toast.error(error.message);
//     },
//   });

//   const addItems = trpcClient.cart.addMultiple.useMutation({
//     onSuccess({ message }) {
//       getItems.refetch();
//       toast.success(message);
//       router.replace(homeRoute, { scroll: false });
//     },
//     onError(error) {
//       toast.error(error.message);
//     },
//   });

//   const removeItem = trpcClient.cart.remove.useMutation({
//     onSuccess({ message }) {
//       getItems.refetch();
//       toast.success(message);
//     },
//     onError(error) {
//       toast.error(error.message);
//     },
//   });

//   const removeAllItems = trpcClient.cart.removeAll.useMutation();

//   const updateItemQuantity = trpcClient.cart.updateQuantity.useMutation({
//     onSuccess({ message }) {
//       getItems.refetch();
//       toast.success(message);
//     },
//     onError(error) {
//       toast.error(error.message);
//     },
//   });

//   useLayoutEffect(() => {
//     if (!!getItems.data) {
//       set({ items: getItems.data });
//     }
//   }, [set, getItems.data]);

//   return {
//     ...store,
//     getItems,
//     addItem,
//     addItems,
//     removeItem,
//     removeAllItems,
//     updateItemQuantity,
//   };
// }
