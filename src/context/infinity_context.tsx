import { UseGetResult } from "@/module/hooks/useGet";
import { IPagination } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface InfiniteLoadingProps<T> {
  api: UseGetResult<IPagination<T>>;
  children: React.ReactNode;
  initial_page?: number;
  params?: object | null;
  buttonLoadComponent?: React.ReactNode | undefined;
  rerender?: boolean;
  classNameButton?: string;
}

export default function InfiniteLoading<T>({
  api,
  children,
  initial_page = 0,
  params = {},
  buttonLoadComponent,
  rerender = true,
  classNameButton,
}: InfiniteLoadingProps<T>) {
  const [page, setPage] = useState<number>(initial_page);

  const fetchData = async () => {
    console.log("page", api.data);
    const page_count = page + 1;
    if (page_count <= (api.data?.totalPages ?? 2)) {
      const data = await api.fetchData({
        limit: 8,
        page: page_count,
        ...params,
      });

      setPage(page_count);
      console.log(
        "data.data !== null && data.status === true && api.data?.results !== undefined",
        api.data
      );
      if (data.data !== null && data.status === true) {
        const data_before = {
          ...data.data,
          results: [...(api.data?.results || []), ...data.data.results],
        };
        console.log("data_before", data_before);
        api.setData(data_before);
      } else {
        return;
      }
    } else {
      api.setError(true);
    }
  };

//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop !==
//         document.documentElement.offsetHeight ||
//       api.loading
//     ) {
//       return;
//     }
//     fetchData();
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [api.loading]);

  useEffect(() => {
    if (rerender) {
      fetchData();
    }
  }, []);

  return (
    <>
      {children}
      {api.error || api.data?.totalCount === 0 ? (
        <h3 className="text-md text-muted-foreground text-center">
          No data is loaded.
        </h3>
      ) : buttonLoadComponent ? (
        <div className="w-auto h-auto" onClick={fetchData}>
          {buttonLoadComponent}
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={async () => {
              await fetchData();
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
              });
            }}
            variant="outline"
            disabled={api.loading}
            className={cn(classNameButton)}
          >
            {api.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin self-center" />
                Loading
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
