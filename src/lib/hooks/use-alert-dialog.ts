import { create } from "zustand";

interface AlertDialogStore {
  title: string;
  description: string;
  isOpen: boolean;
  itemId: number | null;
  open: (itemId: number) => void;
  close: () => void;
}

export const useAlertDialog = create<AlertDialogStore>((set, get) => ({
  title: "",
  description: "",
  isOpen: false,
  itemId: null,
  open: (itemId) => set({ isOpen: true, itemId }),
  close: () => set({ isOpen: false }),
}));
