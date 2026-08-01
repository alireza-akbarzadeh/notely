import { create } from "zustand";
import { persist } from "zustand/middleware";

type FocusModeState = {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
};

export const useFocusMode = create<FocusModeState>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "notely-focus-mode" },
  ),
);
