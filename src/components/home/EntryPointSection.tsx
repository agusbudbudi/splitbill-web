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

  return (
    <section className="space-y-3">
      {title && (
        <h2 className="px-1 text-md font-bold text-foreground">{title}</h2>
      )}

      <div className="columns-2 gap-3">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="mb-3 break-inside-avoid space-y-2 rounded-md border border-border bg-white p-2.5">
                <Skeleton className="aspect-square w-full rounded-sm" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))
          : items.map((item) => (
              <div key={item.id} className="mb-3 break-inside-avoid">
                <EntryPointCard data={item} />
              </div>
            ))}
      </div>
    </section>
  );
};
