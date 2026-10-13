"use client";

import React, { useEffect, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import { fetchBlogs } from "@/lib/api/blog";
import { Blog } from "@/lib/types/blog";
import { Search, X } from "lucide-react";

import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCategoryNav } from "@/components/blog/BlogCategoryNav";

import { Footer } from "@/components/layout/Footer";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const BLOGS_PER_PAGE = 12;

interface BlogListClientProps {
  /** First page fetched on the server so the post list is in the initial HTML. */
  initialBlogs?: Blog[];
  initialTotalPages?: number;
  categories?: string[];
}

export default function BlogListClient({
  initialBlogs,
  initialTotalPages = 1,
  categories = [],
}: BlogListClientProps) {
  const hasInitial = !!initialBlogs && initialBlogs.length > 0;
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs ?? []);
  const [isLoading, setIsLoading] = useState(!hasInitial);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(hasInitial ? initialTotalPages : 1);

  useEffect(() => {
    // Server already provided page 1; only fetch client-side as a fallback
    // (e.g. the backend was unreachable at build/revalidate time).
    if (hasInitial) return;
    const loadBlogs = async () => {
      try {
        const response = await fetchBlogs({ page: 1, limit: BLOGS_PER_PAGE });
        setBlogs(response.data || []);
        setPage(response.pagination?.page || 1);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, [hasInitial]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetchBlogs({ page: nextPage, limit: BLOGS_PER_PAGE });
      setBlogs((prev) => [...prev, ...(response.data || [])]);
      setPage(response.pagination?.page || nextPage);
      setTotalPages(response.pagination?.totalPages || totalPages);
    } catch (error) {
      console.error("Failed to fetch more blogs:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query),
  );

  // Newest post gets the featured slot only on the unfiltered list.
  const featuredBlog = isSearching ? undefined : filteredBlogs[0];
  const gridBlogs = isSearching ? filteredBlogs : filteredBlogs.slice(1);

  return (
    <div className="w-full min-h-screen bg-background pb-0 flex flex-col items-center pt-16 lg:pt-18">
      <HomepageNavbar />

      <BlogHero
        eyebrow="Blog SplitBill"
        title={
          <>
            Cerita & Tips <span className="text-primary">Seputar Split Bill</span>
          </>
        }
        description="Inspirasi bagi tagihan yang adil, tips atur keuangan bareng teman, dan update fitur terbaru."
      >
        <div className="flex flex-col gap-5">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <Input
              type="text"
              enterKeyHint="search"
              aria-label="Cari artikel"
              placeholder="Cari artikel..."
              className="pl-11 pr-11 shadow-soft"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <BlogCategoryNav categories={categories} />
        </div>
      </BlogHero>

      <main className="w-full max-w-[600px] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="flex flex-col gap-10">
            {featuredBlog && <BlogCard blog={featuredBlog} variant="featured" priority />}

            {gridBlogs.length > 0 && (
              <section className="flex flex-col gap-5">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-lg font-bold text-foreground">
                    {isSearching ? `Hasil pencarian "${searchQuery.trim()}"` : "Artikel Terbaru"}
                  </h2>
                  {isSearching && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {filteredBlogs.length} artikel
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gridBlogs.map((blog, index) => (
                    <BlogCard key={blog._id} blog={blog} priority={isSearching && index === 0} />
                  ))}
                </div>
              </section>
            )}

            {!isSearching && page < totalPages && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleLoadMore} loading={isLoadingMore} className="bg-card">
                  {isLoadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <IllustratedEmptyState
            illustration="/img/empty-state/empty-search-image.png"
            title="Artikel Tidak Ditemukan"
            description="Coba gunakan kata kunci lain atau telusuri semua artikel."
            ctaText="Hapus Filter"
            onCtaClick={(e) => {
              e.preventDefault();
              setSearchQuery("");
            }}
          />
        )}
      </main>

      <BlogCTA />

      <HomepageFooter />

      {/* Mobile Navigation Footer */}
      <Footer />
    </div>
  );
}
