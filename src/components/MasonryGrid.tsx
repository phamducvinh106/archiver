"use strict";
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, Sparkles } from "lucide-react";
import { BaseAsset } from "@/types/asset";
import { AssetCard } from "./AssetCard";

interface MasonryGridProps {
  assets: BaseAsset[];
  onPreview: (asset: BaseAsset) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
  onSelectColor?: (color: string) => void;
  onSelectTag?: (tag: string) => void;
  onClearFilters?: () => void;
}

export function MasonryGrid({
  assets,
  onPreview,
  onRename,
  onDelete,
  onTogglePin,
  onAddTag,
  onRemoveTag,
  onSelectColor,
  onSelectTag,
  onClearFilters,
}: MasonryGridProps) {
  if (assets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#27272a] bg-[#121215]/30 p-8 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c1c22] text-[#71717a] mb-3">
          <ImageOff className="h-6 w-6 text-[#ff5500]/60" />
        </div>
        <h3 className="text-sm font-semibold text-white">Không tìm thấy asset nào</h3>
        <p className="mt-1 max-w-sm text-xs text-[#71717a]">
          Không có tài nguyên nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 rounded-lg border border-[#ff5500]/40 bg-[#ff5500]/10 px-3 py-1.5 text-xs font-medium text-[#ff5500] hover:bg-[#ff5500] hover:text-white transition-all"
          >
            Xóa toàn bộ bộ lọc
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* CSS Column Masonry Layout */}
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onPreview={onPreview}
              onRename={onRename}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onSelectColor={onSelectColor}
              onSelectTag={onSelectTag}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
