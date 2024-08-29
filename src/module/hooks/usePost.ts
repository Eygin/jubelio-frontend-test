import { postApi, postApiForm } from "@/lib/api";
import { URL_BACKEND } from "@/lib/axios";
import { toast } from "sonner";
import { IResultAPI } from ".";
import axios from "axios";
import { usePostStore } from "../store/usePostStore";

export interface UsePostsResult<T> {
  sendData: (
    data:
      | Record<string, string | number | Array<object | string | number>>
      | FormData,
  ) => Promise<IResultAPI<T>>;
  error: boolean;
  loading: boolean;
}

export const usePost = <T>(
  url: string,
  {
    method,
    auth = false,
    success_code = 200,
  }: {
    auth?: boolean;
    success_code?: 201 | 200;
    method: "json" | "form-data";
  },
): UsePostsResult<T> => {
  const { loading, error, setLoading, setError } = usePostStore();

  const sendData = async (
    data:
      | Record<string, string | number | Array<object | string | number>>
      | FormData,
  ) => {
    setLoading(true);
    setError(false);
    try {
      let res;

      if (method === "json") {
        res = await postApi({ url: URL_BACKEND + url, data: data, auth: auth });
      } else {
        res = await postApiForm({
          url: URL_BACKEND + url,
          data: data,
          auth: auth,
        });
      }

      setLoading(false);

      if (res.status === success_code) {
        return { data: res.data, status: true };
      } else {
        setError(true);
        toast.error("Expected error, please try again", {
          description: `Message: ${res.data?.detail_message}`,
        });
        return { data: null, status: false };
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(true);

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

  return { sendData, loading, error };
};
