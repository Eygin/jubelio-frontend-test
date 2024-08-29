import BoxProduct from "@/components/BoxProduct";
import Main from "@/components/Main";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { CloudUpload, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import DrawerProduct from "@/components/drawer/DrawerProduct";
import ProductLoader from "@/components/loader/ProductLoader";
import { IBoxProduct, IPagination } from "@/types";
import useGet from "@/module/hooks/useGet";
import InfiniteLoading from "@/context/infinity_context";
import CallbackLoader from "@/context/callback_loader";
import { toast } from "sonner";

export default function Product() {
  const [open, setOpen] = useState<boolean>(false);

  const products = useGet<IPagination<IBoxProduct>>("product", {
    key_data: "product",
    hit_first: false,
    params: {
      limit: 10,
    },
    behavior_set_data: "default",
    show_sonner_error: false,
    auth: true
  });

  const fetch_product = useGet("product/fetch-data", {
    params: {
      page: 1,
      limit: 100
    },
    key_data: "",
    behavior_set_data: "no-set",
    auth: true
  })

  const handleFetch = async() => {
    const res = await fetch_product.fetchData();
    if (res.status) {
      toast.success("Fetch product successfully")
      await products.fetchData({
        limit: 8,
        page: 1
      })
    }
   
  }

  return (
    <>
      <Main>
        <Title title="Products">
          <Button size={"sm"} variant={"outline"} onClick={handleFetch}>
            <CloudUpload className="mr-2 w-4 h-4" /> Fetch product
          </Button>
          <Button size={"sm"} onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 w-4 h-4" /> Add new product
          </Button>
        </Title>
        <InfiniteLoading<IBoxProduct> api={products}>
          <CallbackLoader
            loading={products.loading}
            data={products.data?.results || []}
            loading_component={
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  return <ProductLoader key={i} />;
                })}
              </div>
            }
          >
            <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
              {products.data?.results &&
                products.data.results.map((el, i: number) => {
                  return <BoxProduct {...el} key={i} api={products} />;
                })}
            </div>
          </CallbackLoader>
        </InfiniteLoading>
      </Main>
      <DrawerProduct open={open} setOpen={setOpen} api={products} />
    </>
  );
}
