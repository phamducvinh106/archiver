import { BaseAsset, ImageFormat, OrientationType } from "@/types/asset";
import { INITIAL_MOCK_ASSETS } from "./mock-data";
import { cleanFileName } from "./utils";

const STORAGE_KEY = "archiver_design_assets_v1";

export function getStoredAssets(): BaseAsset[] {
  if (typeof window === "undefined") {
    return INITIAL_MOCK_ASSETS;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ASSETS));
      return INITIAL_MOCK_ASSETS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load assets from storage", err);
    return INITIAL_MOCK_ASSETS;
  }
}

export function saveStoredAssets(assets: BaseAsset[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch (err) {
    console.error("Failed to save assets to storage", err);
  }
}

export function renameAsset(id: string, newName: string): BaseAsset[] {
  const current = getStoredAssets();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          name: newName.trim() || item.name,
          updatedAt: new Date().toISOString(),
        }
      : item
  );
  saveStoredAssets(updated);
  return updated;
}

export function togglePinAsset(id: string): BaseAsset[] {
  const current = getStoredAssets();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          isPinned: !item.isPinned,
          updatedAt: new Date().toISOString(),
        }
      : item
  );
  saveStoredAssets(updated);
  return updated;
}

export function updateAssetTags(id: string, newTags: string[]): BaseAsset[] {
  const current = getStoredAssets();
  // Clean and unique tags
  const cleanedTags = Array.from(
    new Set(
      newTags
        .map((t) => t.trim().replace(/^#/, ""))
        .filter((t) => t.length > 0)
    )
  );

  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          tags: cleanedTags,
          updatedAt: new Date().toISOString(),
        }
      : item
  );
  saveStoredAssets(updated);
  return updated;
}

export function addAssetTag(id: string, tag: string): BaseAsset[] {
  const clean = tag.trim().replace(/^#/, "");
  if (!clean) return getStoredAssets();

  const current = getStoredAssets();
  const target = current.find((item) => item.id === id);
  if (!target) return current;

  const existingTags = target.tags || [];
  if (existingTags.includes(clean)) return current;

  return updateAssetTags(id, [...existingTags, clean]);
}

export function removeAssetTag(id: string, tag: string): BaseAsset[] {
  const current = getStoredAssets();
  const target = current.find((item) => item.id === id);
  if (!target || !target.tags) return current;

  return updateAssetTags(
    id,
    target.tags.filter((t) => t !== tag)
  );
}

export function deleteAsset(id: string): BaseAsset[] {
  const current = getStoredAssets();
  const updated = current.filter((item) => item.id !== id);
  saveStoredAssets(updated);
  return updated;
}

export async function createAssetFromFile(
  file: File,
  customName?: string
): Promise<BaseAsset> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      // Extract image dimensions
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || 1200;
        const height = img.naturalHeight || 800;
        const aspectRatio = +(width / height).toFixed(2);

        let orientation: OrientationType = "landscape";
        if (aspectRatio < 0.9) orientation = "portrait";
        else if (aspectRatio >= 0.9 && aspectRatio <= 1.1) orientation = "square";

        const extension = file.name.split(".").pop()?.toLowerCase() || "png";
        const format = (["png", "jpg", "jpeg", "svg", "webp", "gif"].includes(extension)
          ? extension === "jpeg"
            ? "jpg"
            : extension
          : "png") as ImageFormat;

        const baseTitle = customName?.trim() || cleanFileName(file.name);

        const newAsset: BaseAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: baseTitle,
          type: "IMAGE",
          fileUrl: dataUrl,
          fileSize: file.size,
          orientation,
          dominantColors: ["#FF5500", "#09090B", "#FAFAFA"], // neon orange + dark + light
          tags: ["Upload", format.toUpperCase(), orientation === "portrait" ? "Mobile" : "Desktop"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: {
            width,
            height,
            aspectRatio,
            format,
          },
        };

        const current = getStoredAssets();
        const updated = [newAsset, ...current];
        saveStoredAssets(updated);
        resolve(newAsset);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
