import { Product } from '../../products';

export interface SalesManagerOrder {
  id: number;
  salesManagerId: number;
  quantity: number;
  created_at: number;
  product: Product;
}
