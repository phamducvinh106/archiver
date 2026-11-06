"use strict";
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Upload,
  Calendar,
  Tag,
  Palette,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BaseAsset } from "@/types/asset";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  assets: BaseAsset[];
  onSelectAsset: (asset: BaseAsset) => void;
  onOpenUpload: () => void;
  onFilterPreset: (preset: "today" | "last7days" | "svg" | "neon" | "reset") => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
  onOpenUpload,
  onFilterPreset,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = query.trim()
    ? assets.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : assets.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#27272a] bg-[#121215] shadow-2xl"
      >
        {/* Search input field */}
        <div className="flex items-center px-4 border-b border-[#222227]">
          <Search className="h-4.5 w-4.5 text-[#ff5500]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tài nguyên hoặc gõ lệnh..."
            className="w-full bg-transparent px-3.5 py-4 text-sm text-white placeholder-[#71717a] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-[#71717a] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="font-mono text-[10px] text-[#71717a] border border-[#27272a] px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div className="max-h-80 overflow-y-auto p-2">
          {/* Quick Actions */}
          {!query && (
            <div className="mb-2">
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
                Hành động nhanh
              </span>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    onOpenUpload();
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-[#a1a1aa] hover:bg-[#18181d] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-[#ff5500]" />
                    <span>Tải ảnh thiết kế mới</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#71717a]">Action</span>
                </button>

                <button
                  onClick={() => {
                    onFilterPreset("today");
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-[#a1a1aa] hover:bg-[#18181d] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>Lọc: Thiết kế tạo Hôm nay</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#71717a]">Filter</span>
                </button>

                <button
                  onClick={() => {
                    onFilterPreset("neon");
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-[#a1a1aa] hover:bg-[#18181d] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-[#ff5500]" />
                    <span>Lọc: Thiết kế mang tone Cam Neon</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#71717a]">Filter</span>
                </button>
              </div>
            </div>
          )}

          {/* Asset matches */}
          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
              {query ? `Kết quả tìm kiếm (${filteredAssets.length})` : "Gần đây"}
            </span>

            {filteredAssets.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#71717a]">
                Không tìm thấy tài nguyên nào phù hợp với &quot;{query}&quot;
              </div>
            ) : (
              <div className="mt-1 space-y-0.5">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-white hover:bg-[#18181d] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.fileUrl}
                        alt=""
                        className="h-7 w-7 rounded object-cover border border-white/10"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-medium group-hover:text-[#ff5500] transition-colors truncate max-w-xs">
                          {asset.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#71717a]">
                          <span>{asset.tags?.[0] ? `#${asset.tags[0]}` : asset.type}</span>
                          <span>•</span>
                          <span>{asset.orientation}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#71717a] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
