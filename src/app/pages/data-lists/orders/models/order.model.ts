import { Product } from '../../products';

export interface Order {
  sales_manager_id: number;
  total_price: number;
  id: number;
  quantity: number;
  product: Product;
  created_at: Date;
}
