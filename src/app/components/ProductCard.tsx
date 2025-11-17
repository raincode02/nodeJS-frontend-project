"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/domain/product/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
    <div
      className="border p-4 cursor-pointer hover:shadow-lg"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <h2 className="font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
}
