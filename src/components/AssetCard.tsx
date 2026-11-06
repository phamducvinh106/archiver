"use strict";
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ExternalLink,
  Maximize2,
  Trash2,
  Edit2,
  Tag,
  Pin,
  Plus,
  X,
} from "lucide-react";
import { BaseAsset, ImageAssetMetadata } from "@/types/asset";
import { formatBytes, formatDate } from "@/lib/utils";

interface AssetCardProps {
  asset: BaseAsset;
  onPreview: (asset: BaseAsset) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
  onSelectColor?: (color: string) => void;
  onSelectTag?: (tag: string) => void;
}

export function AssetCard({
  asset,
  onPreview,
  onRename,
  onDelete,
  onTogglePin,
  onAddTag,
  onRemoveTag,
  onSelectColor,
  onSelectTag,
}: AssetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(asset.name);
  const [copied, setCopied] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isAddingTag && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [isAddingTag]);

  const handleSaveRename = () => {
    if (nameInput.trim() && nameInput.trim() !== asset.name) {
      onRename(asset.id, nameInput.trim());
    } else {
      setNameInput(asset.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      setNameInput(asset.name);
      setIsEditing(false);
    }
  };

  const handleSaveTag = () => {
    const clean = tagInput.trim().replace(/^#/, "");
    if (clean) {
      onAddTag?.(asset.id, clean);
    }
    setTagInput("");
    setIsAddingTag(false);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTag();
    } else if (e.key === "Escape") {
      setTagInput("");
      setIsAddingTag(false);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(asset.fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const meta = asset.metadata as ImageAssetMetadata;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className={`group relative mb-4 break-inside-avoid rounded-xl border bg-[#121215] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
        asset.isPinned
          ? "border-[#ff5500]/70 shadow-[0_0_20px_rgba(255,85,0,0.15)]"
          : "border-[#222227] hover:border-[#ff5500]/50"
      }`}
    >
      {/* Permanent Pinned Badge if asset is pinned */}
      {asset.isPinned && (
        <div
          title="Đã ghim lên đầu"
          className="absolute top-2.5 left-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-lg bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.5)]"
        >
          <Pin className="h-3.5 w-3.5 fill-white" />
        </div>
      )}

      {/* Image Preview Container */}
      <div
        onClick={() => onPreview(asset)}
        className="relative w-full overflow-hidden rounded-t-xl bg-[#09090b] cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.fileUrl}
          alt={asset.name}
          loading="lazy"
          className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
          {/* Top Bar inside Overlay: Badges, Pin & Actions */}
          <div className="flex items-center justify-between">
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-white backdrop-blur-md border border-white/10 ${
                asset.isPinned ? "ml-7" : ""
              } bg-black/60`}
            >
              {meta.format || "IMG"}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Pin Toggle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin?.(asset.id);
                }}
                title={asset.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}
                className={`rounded-lg p-1.5 backdrop-blur-md transition-all ${
                  asset.isPinned
                    ? "bg-[#ff5500] text-white"
                    : "bg-black/60 text-white hover:bg-[#ff5500]"
                }`}
              >
                <Pin className={`h-3.5 w-3.5 ${asset.isPinned ? "fill-white" : ""}`} />
              </button>

              {/* Figma Link */}
              {asset.figmaUrl && (
                <a
                  href={asset.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Mở trong Figma"
                  className="rounded-lg bg-black/60 p-1.5 text-white backdrop-blur-md transition-all hover:bg-[#ff5500] hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                title="Sao chép liên kết"
                className="rounded-lg bg-black/60 p-1.5 text-white backdrop-blur-md transition-all hover:bg-[#ff5500] hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>

              {/* Lightbox Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(asset);
                }}
                title="Xem chi tiết"
                className="rounded-lg bg-black/60 p-1.5 text-white backdrop-blur-md transition-all hover:bg-[#ff5500] hover:text-white"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Bar inside Overlay */}
          <div className="flex items-center justify-between text-[11px] text-[#e4e4e7]">
            {meta.width && meta.height ? (
              <span className="font-mono text-[10px] text-[#a1a1aa] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">
                {meta.width} × {meta.height}
              </span>
            ) : <span />}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Bạn có chắc muốn xóa "${asset.name}"?`)) {
                  onDelete(asset.id);
                }
              }}
              title="Xóa asset này"
              className="rounded p-1 text-[#a1a1aa] hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-3">
        {/* Name with Inline Rename support */}
        <div className="mb-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-[#ff5500] bg-[#18181b] px-2 py-0.5 text-xs font-medium text-white shadow-[0_0_10px_rgba(255,85,0,0.3)] focus:outline-none"
            />
          ) : (
            <div
              onDoubleClick={() => setIsEditing(true)}
              className="flex items-center justify-between group/title"
            >
              <span
                title={`${asset.name} (Bấm đúp để đổi tên)`}
                className="truncate text-xs font-semibold text-[#f4f4f5] transition-colors group-hover/title:text-[#ff5500] cursor-pointer"
              >
                {asset.name}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                title="Đổi tên tài nguyên"
                className="ml-1 opacity-0 group-hover:opacity-100 p-0.5 text-[#71717a] hover:text-[#ff5500] transition-all"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Tags & Dominant Colors Row */}
        <div className="flex items-center justify-between pt-1 border-t border-[#1c1c22]">
          {/* Dominant color swatches */}
          <div className="flex items-center gap-1">
            {asset.dominantColors?.slice(0, 3).map((hex, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectColor?.(hex);
                }}
                title={`Tone màu: ${hex} (Click để lọc)`}
                className="h-2.5 w-2.5 rounded-full border border-black/30 transition-transform hover:scale-125"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>

          {/* Date & Size */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#71717a]">
            <span>{formatDate(asset.createdAt)}</span>
            <span>•</span>
            <span>{formatBytes(asset.fileSize)}</span>
          </div>
        </div>

        {/* Editable Tags Row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          {asset.tags?.map((tag) => (
            <span
              key={tag}
              className="group/tag inline-flex items-center gap-1 rounded bg-[#18181d] px-1.5 py-0.5 text-[9px] font-mono text-[#a1a1aa] hover:bg-[#ff5500]/10 hover:text-[#ff5500] transition-colors"
            >
              <button onClick={() => onSelectTag?.(tag)}>#{tag}</button>
              {onRemoveTag && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTag(asset.id, tag);
                  }}
                  title={`Xóa tag #${tag}`}
                  className="opacity-0 group-hover/tag:opacity-100 text-[#71717a] hover:text-rose-400"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          ))}

          {/* Add Tag Inline Form */}
          {isAddingTag ? (
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onBlur={handleSaveTag}
              onKeyDown={handleTagKeyDown}
              placeholder="Tag..."
              className="w-16 rounded border border-[#ff5500] bg-[#18181d] px-1 py-0.2 text-[9px] font-mono text-white focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              title="Thêm tag mới"
              className="inline-flex items-center gap-0.5 rounded border border-dashed border-[#27272a] px-1.5 py-0.5 text-[9px] text-[#71717a] hover:border-[#ff5500] hover:text-[#ff5500] transition-colors"
            >
              <Plus className="h-2.5 w-2.5" />
              <span>Tag</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
