export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    nickname: string;
  } | null;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  productImages?: ProductImage[];
}

export interface ToggleProductLikePayload {
  productId: number;
  userId: number;
}

export type ProductImage = {
  image: {
    url: string;
  };
};

export type GetProductByIdInput = { id: number };
export type GetProductByIdResult = Product;

export type ToggleProductLikeInput = number;
export type ToggleProductLikeResult = {
  isLiked: boolean;
  likeCount: number;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  imageUrls?: string[];
};

export type UpdateProductInput = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  imageUrls?: string[];
};
