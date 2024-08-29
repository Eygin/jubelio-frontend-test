import { putApi, putApiForm } from "@/lib/api";
import { URL_BACKEND } from "@/lib/axios";
import { toast } from "sonner";
import { IResultAPI } from ".";
import axios from "axios";
import { usePutStore } from "../store/usePutStore";

export interface UsePutResults<T> {
  loading: boolean;
  updateData: (
    data:
      | Record<string, string | number | Array<object | string | number>>
      | FormData,
  ) => Promise<IResultAPI<T>>;
}

export const usePut = <T>(
  url: string,
  {
    method,
    auth = false,
    success_code = 200,
  }: {
    auth?: boolean;
    method: "json" | "form-data";
    success_code?: 201 | 200;
  },
): UsePutResults<T> => {
  const { loading, setLoading } = usePutStore();

  const updateData = async (
    data:
      | Record<string, string | number | Array<object | string | number>>
      | FormData,
  ) => {
    setLoading(true);
    try {
      let res;

      if (method === "json") {
        res = await putApi({ url: URL_BACKEND + url, data: data, auth: auth });
      } else {
        res = await putApiForm({
          url: URL_BACKEND + url,
          data: data,
          auth: auth,
        });
      }

      setLoading(false);

      if (res.status === success_code) {
        return { data: res.data.data, status: true };
      } else {
        toast.error("Expected error, please try again", {
          description: `Message: ${res.data?.detail_message}`,
        });
        return { data: null, status: false };
      }
    } catch (err: unknown) {
      setLoading(false);

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
  };

  return { updateData, loading };
};
