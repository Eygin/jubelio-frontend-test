import { DrawerDefaultProps, IBoxProduct, IPagination } from "@/types";
import { DrawerDialog } from "../DrawerDialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { usePost } from "@/module/hooks/usePost";
import { toast } from "sonner";
import { UseGetResult } from "@/module/hooks/useGet";
import { usePut } from "@/module/hooks/usePut";

const productValidation = z.object({
  title: z.string().min(1, { message: "Title required" }),
  sku: z.string().min(1, { message: "SKU required" }),
  image: z.string().min(1, { message: "Image required" }),
  price: z.string().min(1, { message: "Price required" }),
  description: z.string().min(1, { message: "Description required" }),
  stock: z.string().min(1, { message: "Stock required" }),
});

type ProductValidation = z.infer<typeof productValidation>;

interface IDrawerProduct extends DrawerDefaultProps {
  data?: IBoxProduct;
  api: UseGetResult<IPagination<IBoxProduct>>;
}

export default function DrawerProduct({ open, setOpen, data, api }: IDrawerProduct) {
  const form = useForm<ProductValidation>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      title: "",
      sku: "",
      image: "",
      price: "",
      description: "",
      stock: "",
    },
    mode: "onBlur",
  });

  const product = usePost<{message: string}>('product', {method: 'json', success_code: 201, auth: true,})
  const product_update = usePut<{message: string}>(`product/${data?.id}`, {method: 'json', success_code: 200, auth: true,})


  const onSubmit = async (values: ProductValidation) => {
    let res;

    if (!data) {
      res = await product.sendData(values)
    } else {
      res = await product_update.updateData(values)
    }

    if (res.status)
    {
      toast.success(res.data?.message);
      setOpen(false);
      await api.fetchData({
        limit: 8,
        page: 1
      })
    }
  };

  useEffect(() => {
    if (data?.title) {
      form.setValue("title", data.title);
      form.setValue("sku", data.sku);
      form.setValue("image", data.image);
      form.setValue("price", data.price);
      form.setValue("description", data?.description || "");
      form.setValue("stock", (data.stock || 0).toString());
    }
  }, [data]);


  return (
    <>
      <DrawerDialog
        open={open}
        setOpen={setOpen}
        title={data?.title ? "Edit Products" : "Add Products"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <Button size={"sm"}>{data?.title ? "Edit" : "Add"}</Button>
              <Button
                size={"sm"}
                type="button"
                variant={"outline"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DrawerDialog>
    </>
  );
}
