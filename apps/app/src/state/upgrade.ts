import { create } from "zustand";

type UpgradeModalReason = 'upgrade' | 'limits-exceeded';

interface UpgradeState {
  isUpgradeModalOpen: boolean;
  reason?: UpgradeModalReason;
  setUpdateModalOpen: (open: boolean, reason?: UpgradeModalReason) => void;
}

export const useUpgradeState = create<UpgradeState>((set) => ({
  isUpgradeModalOpen: false,

  setUpdateModalOpen: (open, reason) => set({ isUpgradeModalOpen: open, reason }),
}));
