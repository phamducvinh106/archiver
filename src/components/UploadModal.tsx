"use strict";
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Image as ImageIcon, Sparkles, Check } from "lucide-react";
import { cleanFileName } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadFile: (file: File, customName?: string) => Promise<void>;
}

export function UploadModal({ isOpen, onClose, onUploadFile }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [assetName, setAssetName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up preview url
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh (PNG, JPG, SVG, WebP, GIF)!");
      return;
    }
    setSelectedFile(file);
    setAssetName(cleanFileName(file.name));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onUploadFile(selectedFile, assetName);
      setSelectedFile(null);
      setPreviewUrl(null);
      setAssetName("");
      onClose();
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg rounded-2xl border border-[#27272a] bg-[#121215] p-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222227]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5500]/10 text-[#ff5500]">
              <UploadCloud className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Tải Lên Tài Nguyên Thiết Kế</h3>
              <p className="text-[11px] text-[#71717a]">
                Hỗ trợ PNG, JPG, WebP, SVG hoặc dán trực tiếp (`Ctrl + V`)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#71717a] hover:bg-[#18181d] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {!selectedFile ? (
            /* Dropzone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? "border-[#ff5500] bg-[#ff5500]/10 shadow-[0_0_25px_rgba(255,85,0,0.15)]"
                  : "border-[#27272a] bg-[#09090b]/50 hover:border-[#ff5500]/50 hover:bg-[#18181d]"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
                className="hidden"
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18181b] text-[#71717a] mb-3 group-hover:text-[#ff5500]">
                <ImageIcon className="h-6 w-6 text-[#ff5500]" />
              </div>
              <p className="text-xs font-medium text-white">
                Kéo thả file vào đây hoặc <span className="text-[#ff5500] underline">chọn từ máy tính</span>
              </p>
              <p className="mt-1 text-[11px] text-[#71717a]">
                Độ phân giải tối đa không giới hạn • Tự động trích xuất bảng màu
              </p>
            </div>
          ) : (
            /* File Preview & Smart Name Input */
            <div className="space-y-4">
              <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#27272a] bg-[#09090b] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 rounded-md bg-black/70 p-1 text-white hover:bg-rose-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#ff5500]" />
                    <span>Tên tài nguyên (Tự động tối ưu hóa)</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#71717a]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Nhập tên asset..."
                  required
                  className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:border-[#ff5500] focus:outline-none focus:ring-1 focus:ring-[#ff5500]"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#27272a] bg-transparent px-4 py-2 text-xs font-medium text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-1.5 rounded-lg bg-[#ff5500] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(255,85,0,0.3)] hover:bg-[#ff6a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? "Đang xử lý..." : "Lưu vào Kho"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
