"use strict";
"use client";

import React, { useState } from "react";
import {
  Calendar,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ArrowUpDown,
  Search,
  Pin,
} from "lucide-react";
import { AssetFilterState, ImageFormat, OrientationType } from "@/types/asset";

interface FilterBarProps {
  filters: AssetFilterState;
  onFilterChange: (filters: AssetFilterState) => void;
  availableTags: string[];
}

const PRESET_COLORS = [
  { name: "Cam Neon", hex: "#FF5500" },
  { name: "Dark Void", hex: "#09090B" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Electric Blue", hex: "#3B82F6" },
  { name: "Vibrant Rose", hex: "#F43F5E" },
];

export function FilterBar({
  filters,
  onFilterChange,
  availableTags,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.dateRange !== "all" ||
    filters.orientation !== "all" ||
    filters.format !== "all" ||
    Boolean(filters.pinnedOnly) ||
    Boolean(filters.selectedColor) ||
    Boolean(filters.selectedTag);

  const resetFilters = () => {
    onFilterChange({
      searchQuery: "",
      dateRange: "all",
      orientation: "all",
      format: "all",
      pinnedOnly: false,
      selectedColor: undefined,
      selectedTag: undefined,
      sortBy: "newest",
    });
  };

  return (
    <div className="flex flex-col gap-3 py-4">
      {/* Primary Row: Date Presets & Quick Format Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Date Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-[#71717a] mr-1">
            <Calendar className="h-3.5 w-3.5 text-[#ff5500]" />
            <span className="hidden sm:inline">Thời gian:</span>
          </div>

          {[
            { id: "all", label: "Tất cả" },
            { id: "today", label: "Hôm nay" },
            { id: "last7days", label: "7 ngày qua" },
            { id: "last30days", label: "30 ngày qua" },
            { id: "thisMonth", label: "Tháng này" },
          ].map((preset) => {
            const isActive = filters.dateRange === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    dateRange: preset.id as AssetFilterState["dateRange"],
                  })
                }
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]"
                    : "border border-[#27272a] bg-[#121215] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-[#f4f4f5]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}

          <div className="h-4 w-px bg-[#27272a] mx-1" />

          {/* Pinned filter button */}
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                pinnedOnly: !filters.pinnedOnly,
              })
            }
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filters.pinnedOnly
                ? "bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]"
                : "border border-[#27272a] bg-[#121215] text-[#a1a1aa] hover:border-[#ff5500]/50 hover:text-[#ff5500]"
            }`}
          >
            <Pin className={`h-3 w-3 ${filters.pinnedOnly ? "fill-white" : ""}`} />
            <span>Đã ghim</span>
          </button>
        </div>

        {/* Right tools: Sort & Advanced Filter Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#121215] px-2.5 py-1 text-xs text-[#a1a1aa]">
            <ArrowUpDown className="h-3 w-3 text-[#ff5500]" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  sortBy: e.target.value as AssetFilterState["sortBy"],
                })
              }
              aria-label="Sắp xếp danh sách"
              className="bg-transparent text-xs text-[#f4f4f5] focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#18181b]">Mới nhất</option>
              <option value="oldest" className="bg-[#18181b]">Cũ nhất</option>
              <option value="name_asc" className="bg-[#18181b]">Tên A-Z</option>
              <option value="size_desc" className="bg-[#18181b]">Dung lượng lớn</option>
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
              showAdvanced || hasActiveFilters
                ? "border-[#ff5500]/40 bg-[#ff5500]/10 text-[#ff5500]"
                : "border-[#27272a] bg-[#121215] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#ff5500]" />
            )}
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="Xóa toàn bộ bộ lọc"
              className="flex items-center gap-1 rounded-lg border border-[#3f3f46] bg-[#18181b] px-2 py-1 text-xs text-[#a1a1aa] hover:text-white hover:border-[#71717a] transition-all"
            >
              <X className="h-3 w-3 text-[#ff5500]" />
              <span className="hidden sm:inline">Xóa lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Expandable Row: Orientation, Format, Dominant Color, Tags */}
      {showAdvanced && (
        <div className="flex flex-col gap-3 rounded-xl border border-[#27272a] bg-[#121215]/60 p-3.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs">
            {/* Format filter */}
            <div className="flex items-center gap-2">
              <span className="text-[#71717a] font-mono uppercase tracking-wider text-[11px]">Định dạng:</span>
              <div className="flex items-center gap-1">
                {(["all", "png", "svg", "jpg", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        format: fmt as AssetFilterState["format"],
                      })
                    }
                    className={`rounded-md px-2 py-0.5 text-xs font-mono transition-all ${
                      filters.format === fmt
                        ? "bg-[#ff5500] text-white"
                        : "border border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation filter */}
            <div className="flex items-center gap-2">
              <span className="text-[#71717a] font-mono uppercase tracking-wider text-[11px]">Tỷ lệ:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "landscape", label: "Ngang (Desktop)" },
                  { id: "portrait", label: "Dọc (Mobile)" },
                  { id: "square", label: "Vuông" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        orientation: item.id as AssetFilterState["orientation"],
                      })
                    }
                    className={`rounded-md px-2 py-0.5 text-xs transition-all ${
                      filters.orientation === item.id
                        ? "bg-[#ff5500] text-white"
                        : "border border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dominant Color Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[#71717a] font-mono uppercase tracking-wider text-[11px]">Tone màu:</span>
              <div className="flex items-center gap-1.5">
                {PRESET_COLORS.map((c) => {
                  const isSelected = filters.selectedColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          selectedColor: isSelected ? undefined : c.hex,
                        })
                      }
                      title={`Lọc theo tone màu: ${c.name}`}
                      className={`h-4.5 w-4.5 rounded-full border transition-all ${
                        isSelected
                          ? "scale-125 border-[#ff5500] ring-2 ring-[#ff5500]/50"
                          : "border-[#3f3f46] hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
                {filters.selectedColor && (
                  <button
                    onClick={() => onFilterChange({ ...filters, selectedColor: undefined })}
                    className="text-[11px] text-[#ff5500] hover:underline ml-1"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tags list */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#222227]">
              <span className="text-[#71717a] text-[11px] font-mono">Tags:</span>
              {availableTags.map((tag) => {
                const isSelected = filters.selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        selectedTag: isSelected ? undefined : tag,
                      })
                    }
                    className={`rounded-full px-2.5 py-0.5 text-[11px] transition-all ${
                      isSelected
                        ? "bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/50 font-medium"
                        : "border border-[#27272a] bg-[#18181b] text-[#71717a] hover:text-[#a1a1aa]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Active Search / Filter status indicator */}
      {filters.searchQuery && (
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
          <span>
            Kết quả cho từ khóa: <strong className="text-[#ff5500]">&quot;{filters.searchQuery}&quot;</strong>
          </span>
          <button
            onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
            className="rounded p-0.5 hover:bg-[#27272a] text-[#71717a] hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
