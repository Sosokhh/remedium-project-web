export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ProductDto {
  name: string;
  price: number;
  quantity: number;
}

export interface ProductOrderSell {
  productId: number | undefined;
  quantity: number;
}
