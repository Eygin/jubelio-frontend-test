import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { IComboBox, IResultAPI } from ".";
import { getApi } from "@/lib/api";
import {  URL_BACKEND } from "@/lib/axios";
import { toast } from "sonner";
import axios from "axios";
import _debounce from "lodash/debounce";
import { DebouncedFunc } from "lodash";
import Cookies from "js-cookie";

type NestedObject = Record<
  string,
  string | number | Array<Record<string, string | number>>
>;

export interface UseGetResult<T> {
  loading: boolean;
  data: T | null;
  fetchData: (
    params_get?: Record<string, string | number>,
    options?: {
      get_params_parent?: boolean;
      reset_page_combobox?: boolean;
      path_variable?: string;
    },
  ) => Promise<IResultAPI<T>>;
  combobox: Array<IComboBox>;
  setData: Dispatch<SetStateAction<T | null>>;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  previousPage: () => void;
  nextPage: () => void;
  page: number;
  total_page: number;
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  goLast: () => void;
  goFirst: () => void;
  searchData: DebouncedFunc<(searchTerm: string) => Promise<void>>;
  memorize_combobox: Array<IComboBox>;
}

export interface UseGetOptions {
  key_data: string;
  hit_first?: boolean;
  combobox_schema?: IComboBox;
  params?: Record<string, string | number>;
  show_sonner_error?: boolean;
  behavior_set_data?: "default" | "no-set";
  auth?: boolean;
  is_pagination?: boolean;
  pagination?: {
    size?: number;
  };
  initial_loading?: boolean;
  combobox_options?: {
    key_data?: string;
  };
}

export default function useGet<T>(
  url: string,
  {
    key_data,
    hit_first = false,
    combobox_schema,
    params,
    show_sonner_error = true,
    auth = false,
    behavior_set_data = "default",
    is_pagination = false,
    pagination = {
      size: 10,
    },
    initial_loading = true,
    combobox_options = {
      key_data: "",
    },
  }: UseGetOptions,
): UseGetResult<T> {
  const [loading, setLoading] = useState<boolean>(initial_loading);
  const [data, setData] = useState<T | null>(null);
  const [combobox, setCombobox] = useState<Array<IComboBox>>([]);
  const [error, setError] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total_page, setTotalPage] = useState<number>(0);
  const [memorize_combobox, setMemorizeCombobox] = useState<Array<IComboBox>>(
    [],
  );

  const set_combobox = (
    res: Record<string, string | number | NestedObject>,
  ) => {
    if (combobox_schema && combobox_options) {
      const combobox_key = combobox_options.key_data;
      if (combobox_key) {
        const keyDataValue = res[key_data];
        if (
          typeof keyDataValue === "object" &&
          keyDataValue !== null &&
          !Array.isArray(keyDataValue)
        ) {
          const nestedValue = (keyDataValue as Record<string, unknown>)[
            combobox_key
          ];
          if (Array.isArray(nestedValue)) {
            const data_combo: Array<IComboBox> = (
              nestedValue as Array<Record<string, string | number>>
            ).map((el: Record<string, string | number>) => {
              return {
                label: el[combobox_schema.label] as string,
                value: String(el[combobox_schema.value]),
              };
            });
            setCombobox(data_combo);
            console.log("data_combo", data_combo);
            return data_combo;
          } else {
            console.error("The value at res[key_data] is not array");
          }
        } else {
          console.error(
            "The value at res[key_data][combobox_key] is not an array.",
          );
        }
      } else {
        console.error("You need to add combobox_options.key_data first.");
      }
    }
  };

  const fetchData = async (
    params_get: Record<string, string | number> | undefined,
    {
      get_params_parent = false,
      reset_page_combobox = false,
      path_variable = "",
    }: {
      get_params_parent?: boolean;
      reset_page_combobox?: boolean;
      path_variable?: string;
    } = {},
  ) => {
    setLoading(true);
    setError(false);
    if (reset_page_combobox) {
      setPage(1);
      setTotalPage(0);
      setMemorizeCombobox([]);
    }
    try {
      let url_path = URL_BACKEND + url;

      if (path_variable.length !== 0) {
        url_path = URL_BACKEND + url + path_variable;
      }
      const res = await getApi({
        url: url_path,
        auth: auth,
        params: get_params_parent
          ? {
              ...params,
              size: pagination.size,
            }
          : params_get,
      });
      setLoading(false);

      if (res.status === 200) {
        console.log("DEBUG GET: ", res.data);
        const data_combobox = set_combobox(res.data);
        if (Array.isArray(data_combobox)) {
          setMemorizeCombobox((prevState) => [...prevState, ...data_combobox]);
        }

        if (behavior_set_data === "default") {
          setData(res.data[key_data]);
        }

        if (is_pagination) {
          setPage(res.data[key_data]?.page_info?.current_page || 0);
          setTotalPage(res.data[key_data]?.page_info?.total_pages || 0);
        }

        return { data: res.data[key_data], status: true };
      } else {
        if (show_sonner_error) {
          toast.error("Expected error, please try again", {
            description: `Message: ${res.data?.detail_message}`,
          });
        }
        setError(true);
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

  const nextPage = async () => {
    try {
      if (page >= total_page + 1) {
        return;
      }

      const next_page = page + 1;
      const res = await fetchData({
        page: next_page,
        size: pagination.size || 10,
      });

      if (res.status) {
        setPage(next_page);
        console.log("res.data[key_data]", res.data);
        return;
      }
    } catch (err) {
      return;
    }
  };

  const previousPage = async () => {
    try {
      if (page <= 1) {
        return;
      }

      const previous_page = page - 1;
      const res = await fetchData({
        page: previous_page,
        size: pagination.size || 10,
      });

      if (res.status) {
        setPage(previous_page);
        return;
      }
    } catch (err) {
      return;
    }
  };

  const goFirst = async () => {
    if (page <= 1) {
      return;
    }

    const res = await fetchData({
      page: 1,
      size: pagination.size || 10,
    });

    if (res.status) {
      setPage(1);
      return;
    }
  };

  const goLast = async () => {
    if (page >= total_page + 1) {
      return;
    }

    const res = await fetchData({
      page: total_page,
      size: pagination.size || 10,
    });

    if (res.status) {
      setPage(total_page);
      return;
    }
  };

  const getCanPreviousPage = () => {
    return page === 1;
  };

  const getCanNextPage = () => {
    return page >= total_page;
  };

  const searchData = useCallback(
    _debounce(async (searchTerm: string) => {
      setMemorizeCombobox([]);
      await fetchData({
        ...params,
        keyword: searchTerm,
        size: pagination.size || 10,
      });
    }, 300),
    [],
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
        set_combobox(data[0] as Record<string, string | number | NestedObject>);
      }
    }
  }, [set_combobox]);

  useEffect(() => {
    if (hit_first === true) {
      fetchData({
        ...params,
        size: pagination.size || 0,
      });
    }
  }, [hit_first]);

  return {
    data,
    loading,
    fetchData,
    combobox,
    setData,
    error,
    setError,
    setLoading,
    nextPage,
    previousPage,
    page,
    total_page,
    getCanNextPage,
    getCanPreviousPage,
    goLast,
    goFirst,
    searchData,
    memorize_combobox
  };
}
