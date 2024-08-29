import { Dispatch, SetStateAction } from "react";

export interface IBoxProduct {
  title: string;
  sku: string;
  image: string;
  price: string;
  description?: string;
  stock: number;
  id: number;
}

export interface DrawerDefaultProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IAdjustment {
  product_id: number;
  title: string;
  qty: string;
  amount: number;
  created_at: string;
  id: number;
  sku: string;
}

export interface IPagination<T> {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  results: Array<T>;
}
