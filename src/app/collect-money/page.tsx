"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCollectMoneyStore } from "@/store/useCollectMoneyStore";
import { Button } from "@/components/ui/Button";
import { CollectionDashboard } from "@/components/collect-money/CollectionDashboard";
import { CollectionCard } from "@/components/collect-money/CollectionCard";
import { FeatureBanner } from "@/components/ui/FeatureBanner";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Wallet, Clock, Archive } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

export default function CollectMoneyPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CollectMoneyContent />
    </React.Suspense>
  );
}

function CollectMoneyContent() {
  const router = useRouter(); // Added router for back button consistency
  const {
    collections,
    activeCollectionId,
    setActiveCollection,
    createCollection,
  } = useCollectMoneyStore();

  const searchParams = useSearchParams();
  const [isDetailView, setIsDetailView] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const activeCollections = collections.filter((c) => !c.isArchived);
  const archivedCollections = collections.filter((c) => c.isArchived);

  const displayedCollections =
    activeTab === "active" ? activeCollections : archivedCollections;

  const activeCollection = collections.find((c) => c.id === activeCollectionId);

  // Effect to handle auto-opening from Split Bill redirection
  useEffect(() => {
    const autoOpen = searchParams.get("autoOpen");
    if (autoOpen === "true" && activeCollectionId) {
      setIsDetailView(true);
    }
  }, [searchParams, activeCollectionId]);

  // If showing detail view and we have a valid collection
  if (isDetailView && activeCollection) {
    return (
      <CollectionDashboard
        collection={activeCollection}
        onBack={() => setIsDetailView(false)}
      />
    );
  }

  const handleCreate = () => {
    if (!newTitle.trim()) {
      toast.error("Nama patungan wajib diisi");
      return;
    }
    createCollection(newTitle, []);
    setNewTitle("");
    setIsCreating(false);
    setIsDetailView(true); // Automatically go to detail
  };

  const handleSelectCollection = (id: string) => {
    setActiveCollection(id);
    setIsDetailView(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Purple background behind header and top banner */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[150px] bg-primary z-0 rounded-b-[20px]" />

      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative z-10">
        <Header
          title="Collect Money"
          showBackButton
          onBack={() => router.push("/")}
        />

        <div className="flex-1 p-4 pb-20 space-y-6">
          {/* Feature Banner */}
          <FeatureBanner
            title="Tagih Tanpa Ribet! 💸"
            description={
              <>
                Pantau status bayar dari teman & <br />
                <span className="font-bold text-primary">
                  Share buktinya ke grup!
                </span>
              </>
            }
            ctaText="Buat Patungan"
            ctaHref="#"
            illustration="/img/feature-collect-money.png" // Using the new requested image
            variant="secondary"
            onCtaClick={(e) => {
              e.preventDefault();
              setIsCreating(true);
            }}
          />

          {/* Create New Form (shown when needed) */}
          {isCreating && (
            <div className="bg-card border border-border/50 p-4 rounded-lg  space-y-3 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-foreground px-1">
                Judul Patungan
              </label>
              <Input
                placeholder="Contoh: Trip ke Bandung"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsCreating(false)}
                >
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleCreate}>
                  Mulai
                </Button>
              </div>
            </div>
          )}

          {/* List of Collections */}
          <div className="space-y-4">
            <SegmentedControl
              options={[
                {
                  id: "active",
                  label: "Aktif",
                  icon: Clock,
                  badge:
                    activeCollections.length > 0
                      ? activeCollections.length.toString()
                      : undefined,
                },
                {
                  id: "archive",
                  label: "Selesai",
                  icon: Archive,
                  badge:
                    archivedCollections.length > 0
                      ? archivedCollections.length.toString()
                      : undefined,
                },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
            />

            <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2 px-1">
              {activeTab === "active" ? (
                <>
                  <Wallet className="w-4 h-4 text-primary" />
                  Daftar Patungan Aktif
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 text-primary" />
                  Arsip Patungan
                </>
              )}
            </h3>

            {displayedCollections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-muted/40 rounded-2xl bg-muted/5">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <Wallet className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Belum ada Patungan
                </h3>
                <p className="text-sm text-muted-foreground max-w-[300px] mb-6">
                  Buat patungan baru atau import langsung dari Split Bill!
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Buat Baru
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {displayedCollections.map((c) => (
                  <CollectionCard
                    key={c.id}
                    collection={c}
                    onClick={() => handleSelectCollection(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
