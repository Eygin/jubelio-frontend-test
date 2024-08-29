export interface IResultAPI<T> {
  status: boolean;
  data: T | null;
}

export interface IComboBox {
  label: string;
  value: string | number;
}
