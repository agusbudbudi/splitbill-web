"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Contact, Plus } from "lucide-react";
import { cn, getFriendAvatarUrl } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { useFriendStore } from "@/lib/stores/friendStore";
import { isContactPickerSupported, pickContact } from "@/lib/utils/contactPicker";

interface FriendComboboxInputProps {
  /** Names already added to the current list (used for dedupe + hiding from suggestions) */
  people: string[];
  /** Called with a name to add — either an existing saved friend's name or a brand new one */
  onAdd: (name: string) => void;
  /** Called when the resolved name is already in `people` */
  onDuplicate?: (name: string) => void;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

const normalize = (s: string) => s.trim().toLowerCase();

export const FriendComboboxInput = ({
  people,
  onAdd,
  onDuplicate,
  placeholder = "Cari teman atau tambah teman baru...",
  helperText = "Cari dari daftar teman tersimpan atau tekan Enter untuk menambahkan teman baru.",
  className,
}: FriendComboboxInputProps) => {
  const { friends } = useFriendStore();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [contactPickerSupported, setContactPickerSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContactPickerSupported(isContactPickerSupported());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const updateRect = () => {
      const el = inputRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDropdownRect({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [isOpen]);

  const normalizedQuery = normalize(query);
  const availableFriends = friends.filter(
    (f) => !people.some((p) => normalize(p) === normalize(f.name)),
  );
  const matches = normalizedQuery
    ? availableFriends.filter((f) => normalize(f.name).includes(normalizedQuery))
    : availableFriends;
  const exactMatch = availableFriends.find(
    (f) => normalize(f.name) === normalizedQuery,
  );
  const showCreateRow = normalizedQuery.length > 0 && !exactMatch;
  const createRowIndex = matches.length;

  const resetInput = () => {
    setQuery("");
    setIsOpen(false);
    setHighlightIndex(0);
    inputRef.current?.focus();
  };

  const selectFriend = (name: string) => {
    if (people.some((p) => normalize(p) === normalize(name))) {
      onDuplicate?.(name);
    } else {
      onAdd(name);
    }
    resetInput();
  };

  const resolveAndAdd = (rawName: string) => {
    const trimmed = rawName.trim().replace(/\s+/g, " ");
    if (!trimmed) return;
    const match = availableFriends.find(
      (f) => normalize(f.name) === normalize(trimmed),
    );
    if (match) {
      selectFriend(match.name);
      return;
    }
    if (people.some((p) => normalize(p) === normalize(trimmed))) {
      onDuplicate?.(trimmed);
      resetInput();
      return;
    }
    onAdd(trimmed);
    resetInput();
  };

  const createNew = () => resolveAndAdd(query);

  const handlePickContact = async () => {
    const contact = await pickContact();
    if (!contact?.name) return;
    resolveAndAdd(contact.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    const totalOptions = matches.length + (showCreateRow ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (totalOptions ? (i + 1) % totalOptions : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (totalOptions ? (i - 1 + totalOptions) % totalOptions : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex < matches.length && matches[highlightIndex]) {
        selectFriend(matches[highlightIndex].name);
      } else if (showCreateRow) {
        createNew();
      } else if (exactMatch) {
        selectFriend(exactMatch.name);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setHighlightIndex(0);
        }}
        onFocus={() => query.trim() && setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        className={cn("h-12", query.trim() ? "pr-24" : contactPickerSupported && "pr-11")}
      />

      {query.trim() ? (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={createNew}
          title="Tambah teman baru"
          className="absolute right-1.5 top-1.5 h-9 px-3 flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah
        </button>
      ) : (
        contactPickerSupported && (
          <button
            type="button"
            onClick={handlePickContact}
            title="Pilih dari Kontak"
            className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-primary/70 hover:text-primary"
          >
            <Contact className="w-4 h-4" />
          </button>
        )
      )}

      {helperText && (
        <p className="text-[11px] text-muted-foreground/70 px-1 pt-1.5">{helperText}</p>
      )}

      {isOpen && dropdownRect && createPortal(
        <div
          onMouseDown={(e) => e.preventDefault()}
          style={{ top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
          className="fixed z-[60] bg-white border border-primary/10 rounded-sm shadow-lg overflow-hidden max-h-[200px] overflow-y-auto"
        >
          {matches.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => selectFriend(f.name)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors cursor-pointer",
                highlightIndex === i ? "bg-primary/10" : "hover:bg-primary/5",
              )}
            >
              <img
                src={getFriendAvatarUrl(f.name)}
                alt={f.name}
                className="w-6 h-6 rounded-full bg-white shrink-0"
              />
              <span className="font-medium text-foreground">{f.name}</span>
            </button>
          ))}
          {showCreateRow && (
            <button
              type="button"
              onClick={createNew}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left font-semibold text-primary transition-colors cursor-pointer",
                matches.length > 0 && "border-t border-primary/10",
                highlightIndex === createRowIndex ? "bg-primary/10" : "hover:bg-primary/5",
              )}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Tambah &quot;{query.trim()}&quot; sebagai teman baru</span>
            </button>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
};
