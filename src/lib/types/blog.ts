export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  thumbnailAlt?: string;
  author: string;
  category: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: "draft" | "published";
  publishedAt?: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
}
