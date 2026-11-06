<div align="center">

# ⚡ DESIGNVAULT (ARCHIVER)
### Kho Lưu Trữ Tài Nguyên Thiết Kế Tối Giản Dành Riêng Cho Figma Team

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Smooth_Physics-black?style=for-the-badge&logo=framer&logoColor=%23FF5500)](https://www.framer.com/motion/)

<br />

**DesignVault** là một web app quản lý và lưu trữ tài nguyên thiết kế (Design Assets) tinh gọn, hiệu năng cao. Lấy cảm hứng từ phong cách thẩm mỹ của *Linear, Raycast và Cosmos*, ứng dụng kết hợp giữa nền tối sâu thẳm (**Dark Studio `#09090B`**) và điểm nhấn **Cam Neon rực rỡ (`#FF5500`)** mang đậm DNA sáng tạo của designer.

[Tính Năng Nổi Bật](#-tính-năng-nổi-bật) • [Kiến Trúc Đa Hình](#-kiến-trúc-dữ-liệu-đa-hình) • [Cài Đặt & Chạy](#-cài-đặt--khởi-chạy) • [Phím Tắt](#-phím-tắt-hữu-ích) • [Lộ Trình](#-lộ-trình-phát-triển)

</div>

---

## 🎨 Triết Lý Thiết Kế & Trải Nghiệm (Aesthetic & UX)

* **Phong cách Minimalist Studio**: Loại bỏ hoàn toàn sự rườm rà. Nền tối sâu `#09090B`, viền mờ 1px tinh tế `#222227`, để các tác phẩm thiết kế của bạn luôn là tâm điểm của sự chú ý.
* **Điểm Nhấn Cam Neon (`#FF5500`)**: Tạo sự tập trung thị giác vào các nút hành động, trạng thái active và viền glowing khi chỉnh sửa.
* **Chuyển động Spring Physics**: Tích hợp **Framer Motion** để mỗi tương tác (khi lọc ảnh, chuyển vị trí trên Grid, mở Lightbox) đều diễn ra mượt mà, tự nhiên và không gây giật lag.

---

## ✨ Tính Năng Nổi Bật

### 1. ⚡ Dán Trực Tiếp Từ Figma & Kéo Thả Toàn Cửa Sổ
* **Paste từ Clipboard (`Ctrl + V`)**: Copy bất kỳ frame nào trong Figma hoặc ảnh chụp màn hình, nhấn `Ctrl + V` ngay trên ứng dụng để lưu trữ trong vòng 1 giây.
* **Global Dropzone**: Kéo ảnh từ máy tính thả vào bất kỳ đâu trên màn hình để tải lên.
* **Smart Auto-Naming**: Tự động dọn dẹp tên file gốc (bỏ extension, chuyển `_`, `-` thành khoảng trắng, format Title Case chuẩn).

### 2. 📌 Tính Năng Ghim Ưu Tiên (Pinning)
* Bấm ghim 1-chạm ngay trên card ảnh hoặc trong Lightbox.
* Tài nguyên được ghim sẽ hiển thị huy hiệu Cam Neon `[📌]` và **tự động đẩy lên vị trí đầu tiên** của kho ảnh.
* Nút lọc riêng **`[📌 Đã ghim]`** giúp xem nhanh những thiết kế quan trọng.

### 3. ✏️ Đổi Tên Tại Chỗ (Inline Quick Rename)
* Bấm đúp vào tên file trên thẻ ảnh hoặc bấm icon cây bút để đổi tên trực tiếp với hiệu ứng viền Cam Neon phát sáng mượt mà.
* Hỗ trợ đổi tên chuyên sâu trong bảng thông số Lightbox.

### 4. 🏷️ Quản Lý Thẻ Phân Loại (Tags Management)
* Thêm/xóa thẻ tag linh hoạt ngay trên thẻ ảnh hoặc thanh Inspector.
* Tự động đồng bộ các tag mới vào thanh bộ lọc để tìm kiếm tức thời.

### 5. 🔍 Bộ Lọc & Tìm Kiếm Đa Chiều (Search & Filter Engine)
* **Instant Fuzzy Search**: Tìm theo tên và thẻ tag tức thì khi gõ.
* **Command Palette (`⌘K` / `Ctrl + K`)**: Bật thanh tìm kiếm phong cách Raycast/Linear thao tác không cần chuột.
* **Lọc theo Thời gian**: Presets chọn nhanh (*Hôm nay, 7 ngày qua, 30 ngày qua, Tháng này*).
* **Lọc theo Tỷ lệ khung hình**: Dọc (*Mobile/Story*), Ngang (*Desktop/Web*), Vuông (*Social Post*).
* **Lọc theo Định dạng**: PNG, SVG, JPG, WebP.
* **Lọc theo Tone Màu Chủ Đạo (Dominant Colors)**: Bấm chọn ô màu để lọc ra tất cả các ấn phẩm có cùng gam màu tương ứng.

### 6. 🖼️ Masonry Grid & Fullscreen Lightbox
* Bố cục Masonry tự cân đối chiều cao, không cắt xén ảnh.
* Lightbox toàn màn hình hỗ trợ phím mũi tên `←` / `→` duyệt ảnh.
* Inspector bên phải hiển thị đầy đủ: kích thước pixel, dung lượng, tỷ lệ, ngày tạo, link mở ngược lại file Figma gốc và **bảng màu Hex trích xuất tự động** (click 1 chạm để sao chép mã màu).

---

## 🧱 Kiến Trúc Dữ Liệu Đa Hình (Polymorphic Schema)

Để hiện tại **lưu ảnh hoàn hảo** nhưng tương lai dễ dàng mở rộng lưu trữ **Color Palettes, Design Tokens (JSON), 3D Models (GLTF), Figma Embeds** mà không cần sửa đổi cấu trúc cốt lõi, ứng dụng sử dụng mô hình thực thể đa hình:

```typescript
// types/asset.ts
export interface BaseAsset {
  id: string;
  name: string;
  type: "IMAGE" | "PALETTE" | "TOKEN" | "FIGMA_FRAME" | "MODEL_3D";
  fileUrl: string;
  fileSize: number;
  orientation: "portrait" | "landscape" | "square";
  dominantColors: string[]; // e.g. ["#FF5500", "#09090B"]
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  figmaUrl?: string;
  // Payload JSONB linh hoạt tùy theo từng loại tài nguyên
  metadata: ImageAssetMetadata | PaletteAssetMetadata | TokenAssetMetadata | Record<string, unknown>;
}
```

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ |
| :--- | :--- |
| **Framework** | **Next.js 15 (App Router, Turbopack)** |
| **Ngôn ngữ** | **TypeScript 5** |
| **Giao diện** | **React 19** + **Tailwind CSS v4** |
| **Hiệu ứng chuyển động** | **Framer Motion** (Spring physics & layout animations) |
| **Icon Set** | **Lucide Icons** |
| **Lưu trữ dữ liệu** | Persistent Local Storage Adapter (sẵn sàng chuyển đổi sang Supabase / PostgreSQL) |

---

## 🚀 Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống
* **Node.js**: v18.18+ (khuyên dùng Node.js 20 hoặc 24 LTS)
* **npm**: v9+ hoặc pnpm / yarn

### Các bước cài đặt

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/phamducvinh106/archiver.git
   cd archiver
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Dev Server):**
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng:**
   Mở trình duyệt tại địa chỉ: **[http://localhost:3000](http://localhost:3000)**

---

## ⌨️ Phím Tắt Hữu Ích (Keyboard Shortcuts)

| Phím tắt | Thao tác |
| :--- | :--- |
| `⌘K` hoặc `Ctrl + K` | Mở Command Palette tìm kiếm siêu tốc |
| `Ctrl + V` | Dán trực tiếp ảnh từ Figma hoặc clipboard |
| `Double Click` trên tên | Đổi tên tài nguyên tại chỗ |
| `←` / `→` | Chuyển qua lại giữa các ảnh trong Lightbox |
| `Esc` | Đóng Lightbox, modal upload hoặc command palette |

---

## 📁 Cấu Trúc Thư Mục

```
archiver/
├── src/
│   ├── app/
│   │   ├── globals.css          # Design tokens, CSS theme Cam Neon, custom scrollbar
│   │   ├── layout.tsx           # Root layout & font Geist
│   │   └── page.tsx             # Trang chính (State management, paste handler, drag & drop)
│   ├── components/
│   │   ├── Header.tsx           # Minimalist Header & nút tải ảnh
│   │   ├── FilterBar.tsx        # Thanh lọc: Thời gian, Đã ghim, Tỷ lệ, Format, Tone màu, Tags
│   │   ├── AssetCard.tsx        # Card ảnh Masonry: Pin, Inline rename, Tag chips, Dominant colors
│   │   ├── MasonryGrid.tsx      # Lưới Masonry đáp ứng (1-4 cột) với Framer Motion layout transition
│   │   ├── AssetLightbox.tsx    # Chế độ xem chi tiết, đổi tên, quản lý tag & trích xuất bảng màu
│   │   ├── UploadModal.tsx      # Modal kéo thả upload & chuẩn hóa tên file
│   │   └── CommandPalette.tsx   # Thanh lệnh tìm kiếm nhanh (`Cmd + K`)
│   ├── lib/
│   │   ├── mock-data.ts         # Dữ liệu thiết kế mẫu chất lượng cao
│   │   ├── storage.ts           # Adapter lưu trữ, thêm/xóa tag, đổi tên, ghim
│   │   └── utils.ts             # Format bytes, ngày tháng tiếng Việt, làm sạch tên file
│   └── types/
│       └── asset.ts             # Định nghĩa cấu trúc dữ liệu đa hình (Polymorphic schema)
├── plan.md                      # Lộ trình & kế hoạch triển khai chi tiết
└── README.md
```

---

## 🗺️ Lộ Trình Phát Triển (Roadmap)

- [x] **Phase 1: Foundation & Minimalist Theme**: Thiết lập Next.js 15, theme Cam Neon, Framer Motion.
- [x] **Phase 2: Polymorphic Modeling**: Xây dựng cấu trúc dữ liệu đa hình mở rộng.
- [x] **Phase 3: Core MVP Gallery**: Kéo thả upload, `Ctrl+V` paste, inline rename, ghim ưu tiên, Masonry Grid & Lightbox.
- [x] **Phase 4: Advanced Search & Filtering**: Tìm kiếm mờ, lọc ngày tháng, lọc tỷ lệ, lọc tone màu và tag.
- [ ] **Phase 5: Figma Deep Integration**: Xây dựng Figma Plugin (1-click export sang Web App), lưu trữ Bảng màu (Color Palettes) và Design Tokens (JSON).

---

<div align="center">
  Được phát triển với niềm đam mê dành cho cộng đồng Designer & Figma Teams.
</div>
