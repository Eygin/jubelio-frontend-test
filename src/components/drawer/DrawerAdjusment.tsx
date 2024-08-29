import { DrawerDefaultProps, IAdjustment, IBoxProduct, IPagination } from "@/types";
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
import { Button } from "../ui/button";
import { Combobox, ComboboxType } from "../Combobox";
import { toast } from "sonner";
import { usePost } from "@/module/hooks/usePost";
import { usePut } from "@/module/hooks/usePut";
import { useEffect, useState } from "react";
import useGet, { UseGetResult } from "@/module/hooks/useGet";
interface IDrawerAdjustment extends DrawerDefaultProps {
  data?: IAdjustment;
  api: UseGetResult<IPagination<IAdjustment>>
}



const adjustmentValidation = z.object({
  qty: z.string().min(1, { message: "Qty required" }),
  sku: z.string().min(1, { message: "SKU required" }),
});

type AdjustmentValidation = z.infer<typeof adjustmentValidation>;

export default function DrawerAdjustment({
  open,
  setOpen,
  data,
  api
}: IDrawerAdjustment) {
  const [combobox, setCombobox] = useState<Array<ComboboxType>>([])
  const form = useForm<AdjustmentValidation>({
    resolver: zodResolver(adjustmentValidation),
    defaultValues: {
      qty: "",
      sku: "",
    },
    mode: "onBlur",
  });

  const sku = useGet<Array<IBoxProduct>>("sku-list", {
    key_data: "sku",
    hit_first: false,
    auth: true,
    behavior_set_data: "no-set"
  });

  useEffect(() => {
    const get_sku = async() => {
      if (open === true) {
        const data_sku = await sku.fetchData();
       const combo =  (data_sku?.data || []).map((el, i) => {
        return {
          label: el.title,
          value: el.sku
        }
        })
        setCombobox(combo)
        return;
      }
    }

    get_sku();
  }, [open]);


  const adjusment = usePost<{message: string}>('transaction-adjustment', {method: 'json', success_code: 201, auth: true,})
  const adjusment_update = usePut<{message: string}>(`transaction-adjustment/${data?.id}`, {method: 'json', success_code: 201, auth: true,})


  const onSubmit = async (values: AdjustmentValidation) => {
    let res;

    if (!data) {
      res = await adjusment.sendData(values)
    } else {
      res = await adjusment_update.updateData(values)
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
    if (data?.sku) {
      form.setValue("sku", data.sku);
      form.setValue("qty", data.qty);
    }
  }, [data]);

  return (
    <>
      <DrawerDialog
        open={open}
        setOpen={setOpen}
        title={data?.title ? "Edit Adjustment" : "Add Adjustment"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Combobox
                      data={combobox || []}
                      label="product"
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="0" />
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
