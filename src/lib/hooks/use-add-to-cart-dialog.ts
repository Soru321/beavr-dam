import { create } from 'zustand';

interface AddToCartDialogStore {
  isOpen: boolean;
  itemId: number | null;
  open: (itemId: number) => void;
  close: () => void;
}

export const useAddToCartDialog = create<AddToCartDialogStore>((set, get) => ({
  isOpen: false,
  itemId: null,
  open: (itemId) => set({ isOpen: true, itemId }),
  close: () => set({ isOpen: false }),
}));
