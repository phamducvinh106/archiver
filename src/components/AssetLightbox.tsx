"use strict";
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Maximize,
  HardDrive,
  Palette,
  Tag,
  Pin,
  Edit2,
  Plus,
} from "lucide-react";
import { BaseAsset, ImageAssetMetadata } from "@/types/asset";
import { formatBytes, formatDate } from "@/lib/utils";

interface AssetLightboxProps {
  asset: BaseAsset | null;
  allAssets: BaseAsset[];
  onClose: () => void;
  onSelectAsset: (asset: BaseAsset) => void;
  onRename: (id: string, newName: string) => void;
  onTogglePin?: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
}

export function AssetLightbox({
  asset,
  allAssets,
  onClose,
  onSelectAsset,
  onRename,
  onTogglePin,
  onAddTag,
  onRemoveTag,
}: AssetLightboxProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [newTagInput, setNewTagInput] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (asset) {
      setNameInput(asset.name);
      setIsEditingName(false);
      setNewTagInput("");
    }
  }, [asset]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (!asset) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept arrow keys if user is typing in input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        if (e.key === "Escape") {
          setIsEditingName(false);
        }
        return;
      }

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [asset, allAssets, isEditingName]);

  if (!asset) return null;

  const currentIndex = allAssets.findIndex((a) => a.id === asset.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectAsset(allAssets[currentIndex - 1]);
    } else {
      onSelectAsset(allAssets[allAssets.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allAssets.length - 1) {
      onSelectAsset(allAssets[currentIndex + 1]);
    } else {
      onSelectAsset(allAssets[0]);
    }
  };

  const handleSaveRename = () => {
    if (nameInput.trim() && nameInput.trim() !== asset.name) {
      onRename(asset.id, nameInput.trim());
    } else {
      setNameInput(asset.name);
    }
    setIsEditingName(false);
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim().replace(/^#/, "");
    if (clean) {
      onAddTag?.(asset.id, clean);
      setNewTagInput("");
    }
  };

  const handleCopyHex = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(asset.fileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const meta = asset.metadata as ImageAssetMetadata;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 z-10 flex h-16 items-center justify-between px-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#a1a1aa]">
              {currentIndex + 1} / {allAssets.length}
            </span>
            <span className="text-white/30">•</span>
            <h2 className="font-medium text-sm text-white truncate max-w-md">
              {asset.name}
            </h2>
            {asset.isPinned && (
              <span className="flex items-center gap-1 rounded bg-[#ff5500]/20 border border-[#ff5500]/40 px-2 py-0.5 text-[10px] font-mono text-[#ff5500]">
                <Pin className="h-3 w-3 fill-[#ff5500]" />
                <span>Đã ghim</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Pin Toggle */}
            <button
              onClick={() => onTogglePin?.(asset.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                asset.isPinned
                  ? "border-[#ff5500] bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]"
                  : "border-white/10 bg-white/5 text-[#a1a1aa] hover:border-[#ff5500]/50 hover:text-white"
              }`}
            >
              <Pin className={`h-3.5 w-3.5 ${asset.isPinned ? "fill-white" : ""}`} />
              <span>{asset.isPinned ? "Đã ghim" : "Ghim lên đầu"}</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-[#ff5500] hover:border-[#ff5500] transition-colors"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Đã chép link" : "Sao chép link"}</span>
            </button>

            {/* Figma Link */}
            {asset.figmaUrl && (
              <a
                href={asset.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[#ff5500]/40 bg-[#ff5500]/10 px-3 py-1.5 text-xs text-[#ff5500] hover:bg-[#ff5500] hover:text-white transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Mở trong Figma</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[#a1a1aa] hover:bg-white/10 hover:text-white transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={handlePrev}
          title="Ảnh trước (Phím mũi tên trái)"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/10 bg-black/60 p-3 text-white/70 hover:bg-[#ff5500] hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          title="Ảnh tiếp theo (Phím mũi tên phải)"
          className="absolute right-4 md:right-84 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/10 bg-black/60 p-3 text-white/70 hover:bg-[#ff5500] hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Main Content Area: Image + Details Panel */}
        <div className="flex h-full w-full pt-16">
          {/* Main Stage (Image Preview) */}
          <div className="flex flex-1 items-center justify-center p-6 overflow-hidden">
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-h-full max-w-full flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.fileUrl}
                alt={asset.name}
                className="max-h-[82vh] max-w-[70vw] rounded-lg object-contain shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>

          {/* Right Inspector Sidebar */}
          <div className="hidden md:flex w-84 flex-col border-l border-white/10 bg-[#09090b]/95 p-6 overflow-y-auto">
            <div className="flex flex-col gap-6">
              {/* Asset Identity & Rename */}
              <div className="rounded-xl border border-white/5 bg-[#121215] p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#71717a]">
                    Tên tài nguyên
                  </span>
                  {!isEditingName && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="flex items-center gap-1 text-[11px] text-[#ff5500] hover:underline"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Đổi tên</span>
                    </button>
                  )}
                </div>

                {isEditingName ? (
                  <div className="mt-1 space-y-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename();
                        if (e.key === "Escape") setIsEditingName(false);
                      }}
                      className="w-full rounded-lg border border-[#ff5500] bg-[#09090b] px-2.5 py-1.5 text-xs text-white focus:outline-none shadow-[0_0_12px_rgba(255,85,0,0.25)]"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="rounded px-2 py-1 text-[11px] text-[#a1a1aa] hover:text-white"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveRename}
                        className="rounded bg-[#ff5500] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#ff6a1a]"
                      >
                        Lưu tên
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3
                    onDoubleClick={() => setIsEditingName(true)}
                    title="Bấm đúp để đổi tên"
                    className="text-sm font-semibold text-white break-words cursor-pointer hover:text-[#ff5500] transition-colors"
                  >
                    {asset.name}
                  </h3>
                )}
              </div>

              {/* Tags Management */}
              <div className="rounded-xl border border-white/5 bg-[#121215] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] font-mono">
                    <Tag className="h-3.5 w-3.5 text-[#ff5500]" />
                    <span>Thẻ phân loại (Tags)</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#71717a]">
                    {asset.tags?.length || 0} tags
                  </span>
                </div>

                {/* Tags List */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {asset.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="group inline-flex items-center gap-1 rounded-md border border-[#27272a] bg-[#18181d] px-2 py-1 font-mono text-[11px] text-[#a1a1aa] hover:border-[#ff5500]/50 hover:text-white"
                    >
                      <span>#{tag}</span>
                      {onRemoveTag && (
                        <button
                          onClick={() => onRemoveTag(asset.id, tag)}
                          title={`Xóa tag #${tag}`}
                          className="text-[#71717a] hover:text-rose-400 ml-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {(!asset.tags || asset.tags.length === 0) && (
                    <span className="text-[11px] text-[#71717a] italic">
                      Chưa có tag nào
                    </span>
                  )}
                </div>

                {/* Add Tag Input */}
                <form onSubmit={handleAddTagSubmit} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="Thêm tag mới (vd: LandingPage)..."
                    className="flex-1 rounded-lg border border-[#27272a] bg-[#09090b] px-2.5 py-1.5 text-xs text-white placeholder-[#71717a] focus:border-[#ff5500] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newTagInput.trim()}
                    className="flex items-center justify-center rounded-lg bg-[#ff5500] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#ff6a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

              {/* Dominant Color Palette */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] mb-2 font-mono">
                  <Palette className="h-3.5 w-3.5 text-[#ff5500]" />
                  <span>Bảng màu chủ đạo</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {asset.dominantColors?.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => handleCopyHex(hex)}
                      className="group flex flex-col items-center rounded-lg border border-white/5 bg-[#121215] p-2 hover:border-[#ff5500] transition-colors"
                    >
                      <div
                        className="h-7 w-full rounded-md border border-white/10 mb-1.5 shadow-sm"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="font-mono text-[10px] text-[#a1a1aa] group-hover:text-white">
                        {copiedHex === hex ? "Copied!" : hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#71717a]">
                  Thông số kỹ thuật
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-[#121215] p-2.5 border border-white/5">
                    <span className="text-[10px] text-[#71717a] block">Kích thước</span>
                    <span className="font-mono text-white mt-0.5 block">
                      {meta.width ? `${meta.width} × ${meta.height}` : "Vector"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#121215] p-2.5 border border-white/5">
                    <span className="text-[10px] text-[#71717a] block">Định dạng</span>
                    <span className="font-mono text-[#ff5500] uppercase font-bold mt-0.5 block">
                      {meta.format || "PNG"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#121215] p-2.5 border border-white/5">
                    <span className="text-[10px] text-[#71717a] block">Dung lượng</span>
                    <span className="font-mono text-white mt-0.5 block">
                      {formatBytes(asset.fileSize)}
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#121215] p-2.5 border border-white/5">
                    <span className="text-[10px] text-[#71717a] block">Tỷ lệ khung</span>
                    <span className="capitalize text-white mt-0.5 block">
                      {asset.orientation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-2 border-t border-white/10 pt-4 text-xs">
                <div className="flex items-center justify-between text-[#a1a1aa]">
                  <span className="text-[11px] text-[#71717a]">Tải lên ngày:</span>
                  <span className="font-mono text-white">{formatDate(asset.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
