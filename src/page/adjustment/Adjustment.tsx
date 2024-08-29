import Main from "@/components/Main";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DrawerAdjustment from "@/components/drawer/DrawerAdjusment";
import { IAdjustment, IPagination } from "@/types";
import useGet, { UseGetResult } from "@/module/hooks/useGet";
import InfiniteLoading from "@/context/infinity_context";
import CallbackLoader from "@/context/callback_loader";
import moment from 'moment'
import { useDelete } from "@/module/hooks/useDelete";
import { toast } from "sonner";

function AdjustmentRow({api, data}: {api: UseGetResult<IPagination<IAdjustment>>, data: IAdjustment}) {
  const [open, setOpen] = useState<boolean>(false);
  const delete_adjust = useDelete(`transaction-adjustment/${data.id}`, {
    auth: true
  });

  const handleDelete = async() => {
    if (confirm("Are you sure want to delete?")) {
     const res = await delete_adjust.deleteData();
     if (res.status) {
      toast.success("Delete successfully");
      await api.fetchData({
        limit: 8,
        page: 1
      })
     }
    }
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{data.title}</TableCell>
        <TableCell>{data.qty}</TableCell>
        <TableCell>{data.amount}</TableCell>
        <TableCell>{moment(data.created_at).format("DD/MM/YYYY")}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <DrawerAdjustment open={open} setOpen={setOpen} api={api} data={data} />
    </>
  );
}

export default function Adjustment() {
  const [open, setOpen] = useState<boolean>(false);
  const adjustment = useGet<IPagination<IAdjustment>>("transaction-adjustment", {
    key_data: "adjustmentTransaction",
    hit_first: false,
    params: {
      limit: 10,
      page: 1
    },
    auth: true,
    behavior_set_data: "default",
    show_sonner_error: false,
  });

  return (
    <>
      <Main>
        <Title title="Adjustment">
          <Button size={"sm"} onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 w-4 h-4" /> Add adjusment
          </Button>
        </Title>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>List Adjusments</CardTitle>
            <CardDescription>
              Manage your adjusments and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Product Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              <InfiniteLoading<IAdjustment> api={adjustment}>
          <CallbackLoader
            loading={adjustment.loading}
            data={adjustment.data?.results || []}
            loading_component={
              <div className="flex gap-2">
               <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            }
          >
              {adjustment.data?.results &&
                adjustment.data.results.map((el, i: number) => {
                  return <AdjustmentRow {...el} key={i} api={adjustment} data={el} />;
                })}
          </CallbackLoader>
        </InfiniteLoading>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>
      </Main>
      <DrawerAdjustment open={open} setOpen={setOpen} api={adjustment} />
    </>
  );
}
