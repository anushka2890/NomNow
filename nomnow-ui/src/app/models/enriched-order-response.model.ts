export interface EnrichedOrderItem {
  name: string;
  quantity: number;
}

export interface EnrichedOrder {
  orderId: number;
  status: string;
  items: EnrichedOrderItem[];
  restaurantName: string;
  orderTime: string;
  totalAmount: number;
}