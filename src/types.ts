/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: "exterior" | "interior" | "ceramic" | "accessories";
  categoryLabel: string;
  icon: string;
  image?: string;
  description: string;
  fullDescription: string;
  rating: number;
  reviewsCount: number;
  benefits: string[];
  instructions: string;
  size: string;
  inStock: boolean;
  isFeatured: boolean;
  stockCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  vehicle: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface DetailingTip {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  steps: string[];
}

export interface DetailingService {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: string;
  description: string;
  includes: string[];
  recommendedFor: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "return_requested" | "returned" | string;
  createdAt: string;
  returnReason?: string;
  returnDetails?: string;
}


