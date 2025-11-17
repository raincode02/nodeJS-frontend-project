import { Product } from "./types";

export class ProductEntity {
  constructor(private product: Product) {}

  getId() {
    return this.product.id;
  }

  getName() {
    return this.product.name;
  }

  getPrice() {
    return this.product.price;
  }

  getLikeCount() {
    return this.product.likeCount;
  }

  isLikedByUser() {
    return this.product.isLiked ?? false;
  }

  toJSON() {
    return { ...this.product };
  }
}
export type { Product };
