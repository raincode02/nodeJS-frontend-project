"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/domain/article/types";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();

  return (
    <div
      className="border p-4 cursor-pointer hover:shadow-lg"
      onClick={() => router.push(`/articles/${article.id}`)}
    >
      <h2 className="font-bold">{article.title}</h2>
      <p>{article.content.slice(0, 100)}...</p>
      <p>좋아요: {article.likeCount}</p>
    </div>
  );
}
