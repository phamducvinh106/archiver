"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { MasonryGrid } from "@/components/MasonryGrid";
import { AssetLightbox } from "@/components/AssetLightbox";
import { UploadModal } from "@/components/UploadModal";
import { CommandPalette } from "@/components/CommandPalette";
import { BaseAsset, AssetFilterState, OrientationType, ImageFormat } from "@/types/asset";
import {
  getStoredAssets,
  createAssetFromFile,
  renameAsset,
  deleteAsset,
  togglePinAsset,
  addAssetTag,
  removeAssetTag,
} from "@/lib/storage";
import { UploadCloud, Sparkles } from "lucide-react";

export default function Home() {
  const [assets, setAssets] = useState<BaseAsset[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<BaseAsset | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [windowDragActive, setWindowDragActive] = useState(false);

  const [filters, setFilters] = useState<AssetFilterState>({
    searchQuery: "",
    dateRange: "all",
    orientation: "all",
    format: "all",
    sortBy: "newest",
  });

  // Load stored assets on mount
  useEffect(() => {
    setAssets(getStoredAssets());
    setMounted(true);
  }, []);

  // Global paste handler (Ctrl + V) from Figma or clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          e.preventDefault();
          const newAsset = await createAssetFromFile(file, `Figma Paste ${new Date().toLocaleTimeString("vi-VN")}`);
          setAssets((prev) => [newAsset, ...prev]);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Global window drag & drop
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes("Files")) {
        setWindowDragActive(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setWindowDragActive(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setWindowDragActive(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          const newAsset = await createAssetFromFile(file);
          setAssets((prev) => [newAsset, ...prev]);
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Collect all unique tags for filter suggestions
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    assets.forEach((a) => a.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [assets]);

  // Filter and sort computation
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Search query filter (name, tags)
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = asset.name.toLowerCase().includes(q);
          const matchesTag = asset.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesTag) return false;
        }

        // Date range filter
        if (filters.dateRange !== "all") {
          const assetDate = new Date(asset.createdAt).getTime();
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;

          if (filters.dateRange === "today") {
            const todayStart = new Date().setHours(0, 0, 0, 0);
            if (assetDate < todayStart) return false;
          } else if (filters.dateRange === "last7days") {
            if (now - assetDate > 7 * oneDay) return false;
          } else if (filters.dateRange === "last30days") {
            if (now - assetDate > 30 * oneDay) return false;
          } else if (filters.dateRange === "thisMonth") {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const d = new Date(asset.createdAt);
            if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return false;
          }
        }

        // Orientation filter
        if (filters.orientation !== "all" && asset.orientation !== filters.orientation) {
          return false;
        }

        // Format filter
        if (filters.format !== "all") {
          const format = (asset.metadata as { format?: string }).format?.toLowerCase();
          if (format !== filters.format) return false;
        }

        // Dominant Color filter
        if (filters.selectedColor) {
          if (!asset.dominantColors?.includes(filters.selectedColor)) return false;
        }

        // Pinned only filter
        if (filters.pinnedOnly && !asset.isPinned) {
          return false;
        }

        // Tag filter
        if (filters.selectedTag) {
          if (!asset.tags?.includes(filters.selectedTag)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned assets float to the top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (filters.sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (filters.sortBy === "size_desc") {
          return b.fileSize - a.fileSize;
        }
        return 0;
      });
  }, [assets, filters]);

  // Handlers
  const handleRename = useCallback((id: string, newName: string) => {
    const updated = renameAsset(id, newName);
    setAssets(updated);
    if (selectedAsset && selectedAsset.id === id) {
      setSelectedAsset((prev) => (prev ? { ...prev, name: newName } : null));
    }
  }, [selectedAsset]);

  const handleTogglePin = useCallback((id: string) => {
    const updated = togglePinAsset(id);
    setAssets(updated);
    if (selectedAsset && selectedAsset.id === id) {
      setSelectedAsset((prev) => (prev ? { ...prev, isPinned: !prev.isPinned } : null));
    }
  }, [selectedAsset]);

  const handleAddTag = useCallback((id: string, tag: string) => {
    const updated = addAssetTag(id, tag);
    setAssets(updated);
    if (selectedAsset && selectedAsset.id === id) {
      const target = updated.find((a) => a.id === id);
      if (target) setSelectedAsset(target);
    }
  }, [selectedAsset]);

  const handleRemoveTag = useCallback((id: string, tag: string) => {
    const updated = removeAssetTag(id, tag);
    setAssets(updated);
    if (selectedAsset && selectedAsset.id === id) {
      const target = updated.find((a) => a.id === id);
      if (target) setSelectedAsset(target);
    }
  }, [selectedAsset]);

  const handleDelete = useCallback((id: string) => {
    const updated = deleteAsset(id);
    setAssets(updated);
    if (selectedAsset && selectedAsset.id === id) {
      setSelectedAsset(null);
    }
  }, [selectedAsset]);

  const handleUploadFile = async (file: File, customName?: string) => {
    const newAsset = await createAssetFromFile(file, customName);
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleFilterPreset = (preset: "today" | "last7days" | "svg" | "neon" | "reset") => {
    if (preset === "today") {
      setFilters((f) => ({ ...f, dateRange: "today" }));
    } else if (preset === "last7days") {
      setFilters((f) => ({ ...f, dateRange: "last7days" }));
    } else if (preset === "svg") {
      setFilters((f) => ({ ...f, format: "svg" }));
    } else if (preset === "neon") {
      setFilters((f) => ({ ...f, selectedColor: "#FF5500" }));
    } else if (preset === "reset") {
      setFilters({
        searchQuery: "",
        dateRange: "all",
        orientation: "all",
        format: "all",
        sortBy: "newest",
      });
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-[#ff5500]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff5500] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-[#ff5500] selection:text-white">
      {/* Full-window Drag Overlay */}
      {windowDragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md border-4 border-dashed border-[#ff5500] pointer-events-none animate-in fade-in duration-150">
          <div className="flex flex-col items-center text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff5500]/20 text-[#ff5500] mb-4 shadow-[0_0_30px_rgba(255,85,0,0.4)]">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Thả ảnh vào đây</h2>
            <p className="mt-1 text-sm text-[#a1a1aa]">
              Hệ thống sẽ tự động tối ưu hóa tên và lưu trữ ngay lập tức
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        totalAssets={assets.length}
        filteredCount={filteredAssets.length}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCommand={() => setIsCommandOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter & Search Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableTags={availableTags}
        />

        {/* Masonry Grid Gallery */}
        <div className="mt-4">
          <MasonryGrid
            assets={filteredAssets}
            onPreview={setSelectedAsset}
            onRename={handleRename}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onSelectColor={(color) => setFilters((f) => ({ ...f, selectedColor: color }))}
            onSelectTag={(tag) => setFilters((f) => ({ ...f, selectedTag: tag }))}
            onClearFilters={() => handleFilterPreset("reset")}
          />
        </div>
      </main>

      {/* Lightbox Modal */}
      <AssetLightbox
        asset={selectedAsset}
        allAssets={filteredAssets}
        onClose={() => setSelectedAsset(null)}
        onSelectAsset={setSelectedAsset}
        onRename={handleRename}
        onTogglePin={handleTogglePin}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadFile={handleUploadFile}
      />

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        assets={assets}
        onSelectAsset={setSelectedAsset}
        onOpenUpload={() => setIsUploadOpen(true)}
        onFilterPreset={handleFilterPreset}
      />
    </div>
  );
}
