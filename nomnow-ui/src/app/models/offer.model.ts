export interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  restaurantId?: number;
  discountAmount: number;
  offerType: 'FLAT' | 'PERCENTAGE';
}
