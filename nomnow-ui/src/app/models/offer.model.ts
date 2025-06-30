export interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  restaurantId?: number;
}
