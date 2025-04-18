export interface BaseItem {
  id: number;
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

export type Item = BaseItem;

export interface CartItem extends BaseItem {
  count: number;
}