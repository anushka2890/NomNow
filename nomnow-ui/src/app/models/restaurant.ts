export interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  imageUrl: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
  imageUrl: string;
  category: string;
}

export interface RestaurantDTO {
  id: number;
  name: string;
  address: string;
  rating: number;
  imageUrl: string;
}

export interface MenuItemDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
}