import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IBoxProduct, IPagination } from "@/types";
import { useState } from "react";
import DrawerProduct from "./drawer/DrawerProduct";
import { UseGetResult } from "@/module/hooks/useGet";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useDelete } from "@/module/hooks/useDelete";
import { toast } from "sonner";

interface IPropsProduct extends IBoxProduct {
  api: UseGetResult<IPagination<IBoxProduct>>;
}

export default function BoxProduct(props: IPropsProduct) {
  const [open, setOpen] = useState<boolean>(false);

  const delete_product = useDelete(`product/${props.id}`, {
    auth: true
  });

  const handleDelete = async() => {
    if (confirm("Are you sure want to delete?")) {
     const res = await delete_product.deleteData();
     if (res.status) {
      toast.success("Delete successfully");
      await props.api.fetchData({
        limit: 8,
        page: 1
      })
     }
    }
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-500"
        
      >
        <CardHeader className="p-0" onClick={() => setOpen(true)}>
          <div
            className="w-full h-[200px] bg-cover bg-center repeat-none rounded-t-md"
            style={{ backgroundImage: `url(${props.image})` }}
          />
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col">
            <h3 className="font-semibold" onClick={() => setOpen(true)}>{props.title}</h3>
            <small className="text-xs font-medium text-muted-foreground">
              {props.sku}
            </small>
            <small className="text-xs font-medium text-muted-foreground">
              Stock: {props.stock} items
            </small>
            <div className="flex justify-between">
            <p className="font-semibold mt-2">Rp. {props.price}</p>
              <Button size={"icon"} variant={"destructive"} onClick={handleDelete}><Trash className="w-3 h-3" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <DrawerProduct open={open} setOpen={setOpen} data={props} api={props.api} />
    </>
  );
}
