import { apiClient } from "./client";
import { Blog, BlogResponse, BlogsResponse } from "@/lib/types/blog";

export async function fetchBlogs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}): Promise<BlogsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.category) query.append("category", params.category);
  if (params?.tag) query.append("tag", params.tag);

  const queryString = query.toString();
  const endpoint = `/api/blogs${queryString ? `?${queryString}` : ""}`;

  return apiClient.request<BlogsResponse>(endpoint, {
    method: "GET",
    skipAuth: true,
  });
}

export async function fetchBlogBySlug(slug: string): Promise<Blog> {
  const response = await apiClient.request<BlogResponse>(`/api/blogs/${slug}`, {
    method: "GET",
    skipAuth: true,
  });
  
  if (!response.success || !response.data) {
    throw new Error("Blog post not found");
  }
  
  return response.data;
}
