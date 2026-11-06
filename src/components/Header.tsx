"use strict";
"use client";

import React from "react";
import { Search, Plus, Sparkles, Layers } from "lucide-react";

interface HeaderProps {
  totalAssets: number;
  filteredCount: number;
  onOpenUpload: () => void;
  onOpenCommand: () => void;
}

export function Header({
  totalAssets,
  filteredCount,
  onOpenUpload,
  onOpenCommand,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222227] bg-[#09090b]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Figma Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5500] shadow-[0_0_16px_rgba(255,85,0,0.4)] transition-transform hover:scale-105">
              <Layers className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-white">
                DESIGN<span className="text-[#ff5500]">VAULT</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#71717a]">
                Figma Archiver
              </span>
            </div>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenCommand}
            className="group flex w-full items-center justify-between rounded-lg border border-[#27272a] bg-[#121215] px-3.5 py-2 text-sm text-[#71717a] transition-all hover:border-[#ff5500]/50 hover:bg-[#18181d] hover:text-[#f4f4f5]"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-[#71717a] group-hover:text-[#ff5500] transition-colors" />
              <span>Tìm kiếm assets, #tag, màu sắc...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#71717a] group-hover:text-[#a1a1aa]">
              <kbd className="rounded border border-[#27272a] bg-[#18181d] px-1.5 py-0.5">⌘K</kbd>
            </div>
          </button>
        </div>

        {/* Right: Asset Counter & Upload Action */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block font-mono text-xs text-[#71717a]">
            {filteredCount !== totalAssets ? (
              <span>
                <span className="text-[#ff5500] font-semibold">{filteredCount}</span> / {totalAssets} mục
              </span>
            ) : (
              <span>
                <span className="text-white font-medium">{totalAssets}</span> assets
              </span>
            )}
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 rounded-lg bg-[#ff5500] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,85,0,0.3)] transition-all hover:bg-[#ff6a1a] hover:shadow-[0_0_25px_rgba(255,85,0,0.5)] active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tải ảnh lên</span>
          </button>
        </div>
      </div>
    </header>
  );
}
