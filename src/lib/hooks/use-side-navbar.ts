import { create } from 'zustand';

interface SideNavbarStore {
  isExpanded: boolean;
  toggleExpanded: () => void;
  expand: () => void;
  collapse: () => void;
}

export const useSideNavbar = create<SideNavbarStore>((set, get) => ({
  isExpanded: false,
  toggleExpanded: () => set({ isExpanded: !get().isExpanded }),
  expand: () => set({ isExpanded: true }),
  collapse: () => set({ isExpanded: false }),
}));
