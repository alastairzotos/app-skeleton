
export type AsTable<T extends Object> = T & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
