export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  items: OrderItem[];
  deliveryAddress: string;
  orderTime: string;
  restaurantId: number;
  totalAmount: number;
}