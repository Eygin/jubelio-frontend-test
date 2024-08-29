import create from "zustand";

interface PutStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const usePutStore = create<PutStore>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
