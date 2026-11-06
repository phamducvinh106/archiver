export type AssetType = "IMAGE" | "PALETTE" | "TOKEN" | "FIGMA_FRAME" | "MODEL_3D";

export type ImageFormat = "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";

export type OrientationType = "portrait" | "landscape" | "square";

export interface ImageAssetMetadata {
  width: number;
  height: number;
  aspectRatio: number;
  format: ImageFormat;
  blurhash?: string;
  figmaNodeId?: string;
  figmaFileKey?: string;
}

export interface PaletteAssetMetadata {
  colors: Array<{
    name: string;
    hex: string;
    rgb?: string;
    hsl?: string;
  }>;
}

export interface TokenAssetMetadata {
  version: string;
  standard: "W3C_DTCG" | "CUSTOM";
  tokensCount: number;
  rawJson?: string;
}

export interface FigmaFrameMetadata {
  fileKey: string;
  nodeId: string;
  pageName: string;
  frameName: string;
  lastSyncedAt: string;
}

export interface BaseAsset {
  id: string;
  name: string;
  type: AssetType;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number; // in bytes
  orientation: OrientationType;
  dominantColors: string[]; // array of hex colors, e.g. ["#FF5500", "#121215"]
  tags: string[];
  createdAt: string; // ISO String
  updatedAt: string;
  isPinned?: boolean;
  figmaUrl?: string;
  // Polymorphic metadata payload for future types
  metadata: ImageAssetMetadata | PaletteAssetMetadata | TokenAssetMetadata | FigmaFrameMetadata | Record<string, unknown>;
}

export interface AssetFilterState {
  searchQuery: string;
  dateRange: "all" | "today" | "last7days" | "last30days" | "thisMonth" | "custom";
  customStartDate?: string;
  customEndDate?: string;
  orientation: "all" | OrientationType;
  format: "all" | ImageFormat;
  selectedColor?: string;
  selectedTag?: string;
  pinnedOnly?: boolean;
  sortBy: "newest" | "oldest" | "name_asc" | "size_desc";
}
