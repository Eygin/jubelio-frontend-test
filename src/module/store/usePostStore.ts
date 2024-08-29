import create from "zustand";

interface PostStore {
  loading: boolean;
  error: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  loading: false,
  error: false,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
