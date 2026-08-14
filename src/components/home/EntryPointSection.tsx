"use client";

import { useEffect, useState } from "react";
import { EntryPointCard } from "@/components/home/EntryPointCard";
import { EntryPointCardData } from "@/lib/types/entryPoint";
import { fetchEntryPoints } from "@/lib/api/entryPoints";
import { Skeleton } from "@/components/ui/Skeleton";

interface EntryPointSectionProps {
  title?: string;
  placement?: string;
}

const SKELETON_COUNT = 4;

export const EntryPointSection = ({
  title,
  placement = "homepage-member",
}: EntryPointSectionProps) => {
  const [items, setItems] = useState<EntryPointCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchEntryPoints(placement)
      .then((data) => {
        if (active) setItems(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [placement]);

  if (!loading && items.length === 0) return null;

  const skeletons = Array.from({ length: SKELETON_COUNT });
  const leftSkeletons = skeletons.filter((_, i) => i % 2 === 0);
  const rightSkeletons = skeletons.filter((_, i) => i % 2 === 1);
  const leftItems = items.filter((_, i) => i % 2 === 0);
  const rightItems = items.filter((_, i) => i % 2 === 1);

  return (
    <section className="space-y-3">
      {title && (
        <h2 className="px-1 text-md font-bold text-foreground">{title}</h2>
      )}

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-3">
          {loading
            ? leftSkeletons.map((_, i) => <EntryPointCardSkeleton key={i} />)
            : leftItems.map((item) => (
              <EntryPointCard key={item.id} data={item} />
            ))}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {loading
            ? rightSkeletons.map((_, i) => <EntryPointCardSkeleton key={i} />)
            : rightItems.map((item) => (
              <EntryPointCard key={item.id} data={item} />
            ))}
        </div>
      </div>
    </section>
  );
};

const EntryPointCardSkeleton = () => (
  <div className="space-y-2 rounded-md border border-border bg-white p-2.5">
    <Skeleton className="aspect-square w-full rounded-sm" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);
