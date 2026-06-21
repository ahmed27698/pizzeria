export type PizzaSize = "SMALL" | "MEDIUM" | "LARGE";
export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "BAKING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";
export type UserRole = "USER" | "ADMIN";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface Pizza {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  basePrice: number;
  smallPrice?: number | null;
  mediumPrice?: number | null;
  largePrice?: number | null;
  categoryId: string;
  ingredients: string[];
  tags: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  reviews?: Review[];
  _count?: { reviews: number; favorites: number };
  avgRating?: number;
}

export interface Review {
  id: string;
  userId: string;
  pizzaId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  user?: { name?: string | null; image?: string | null };
}

export interface CartItemWithDetails {
  id: string;
  pizzaId: string;
  size: PizzaSize;
  quantity: number;
  price: number;
  pizza: Pizza;
  toppings: { topping: Topping }[];
}

export interface OrderItemWithDetails {
  id: string;
  pizzaId: string;
  size: PizzaSize;
  quantity: number;
  price: number;
  name: string;
  image: string;
  toppings: { topping: Topping }[];
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  deliveryAddress: string;
  phone: string;
  notes?: string | null;
  couponCode?: string | null;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemWithDetails[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}
