"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

export const BlogCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="w-full h-full block">
        <Card className="w-full min-w-full h-full flex flex-col overflow-hidden border border-border/50 shadow-soft bg-white">
          {/* Thumbnail Skeleton */}
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Skeleton className="w-full h-full rounded-none" />
            {/* Badge Skeleton overlay */}
            <div className="absolute top-2 left-2 z-10">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-1 w-1 rounded-full" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>

            <div className="space-y-3 mb-4">
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-[85%] rounded-lg" />
            </div>

            <div className="space-y-2 mb-6">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-[70%] rounded-md" />
            </div>

            <div className="mt-auto">
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
