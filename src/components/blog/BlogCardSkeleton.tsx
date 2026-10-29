"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export const BlogCardSkeleton = () => {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <Skeleton className="w-full aspect-[16/9] rounded-none" />

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>

        <div className="space-y-2 mb-3">
          <Skeleton className="h-5 w-full rounded-sm" />
          <Skeleton className="h-5 w-[80%] rounded-sm" />
        </div>

        <div className="space-y-2 mb-6">
          <Skeleton className="h-3.5 w-full rounded-sm" />
          <Skeleton className="h-3.5 w-[70%] rounded-sm" />
        </div>

        <Skeleton className="mt-auto h-4 w-32 rounded-full" />
      </div>
    </Card>
  );
};
