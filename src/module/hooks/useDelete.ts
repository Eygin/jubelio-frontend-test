import { deleteApi } from "@/lib/api";
import { URL_BACKEND } from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface DeleteResult<T> {
  status: boolean;
  data: T | null;
}

interface DeleteStore<T> {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  deleteData: (
    url: string,
    id?: string,
    params?: object,
    auth?: boolean,
  ) => Promise<DeleteResult<T>>;
}

export const useDeleteStore = create<DeleteStore<unknown>>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

  deleteData: async (url: string, id = "", params = {}, auth = false) => {
    set({ loading: true });
    try {
      const res = await deleteApi({
        url: URL_BACKEND + url,
        auth: auth,
        params: { id: id, ...params },
      });

      set({ loading: false });

      if (res.status === 200) {
        return { status: true, data: res.data.data };
      } else {
        toast.error("Expected error, please try again", {
          description: `Message: ${res.data?.detail_message}`,
        });
        return { status: false, data: null };
      }
    } catch (err: unknown) {
      set({ loading: false });

      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.detail_message ||
          err.response?.statusText ||
          "An Api Request error occurred.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Expected error, please try again", {
        description: `Message: ${errorMessage}`,
      });

      return { data: null, status: false };
    }
  },
}));

export const useDelete = (
  url: string,
  { auth = false }: { auth?: boolean },
) => {
  const { loading, setLoading, deleteData } = useDeleteStore();

  const deleteHandler = async (id?: string, params?: object) => {
    return await deleteData(url, id, params, auth);
  };

  return { deleteData: deleteHandler, loading, setLoading };
};
