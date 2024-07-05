export interface SalesManager {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  created_at: Date;
  orders: SalesManagerOrderItems[]
}

export interface SalesManagerDto {
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export interface SalesManagerOrderItems {
  sales_manager_id: number;
  total_price: number;
  id: number;
  quantity: number;
}
