# Kế Hoạch Triển Khai Dự Án: Design Vault (Archiver)

> **Tầm nhìn dự án**: Web app lưu trữ & quản lý tài nguyên thiết kế chuyên dụng cho đội ngũ sử dụng Figma. Giao diện theo phong cách tối giản (Minimalist), điểm nhấn **Cam Neon** (`#FF5500`), animation mượt mà, thao tác nhạy bén và kiến trúc dữ liệu đa hình sẵn sàng mở rộng không giới hạn.

---

## 1. Tổng Quan Kiến Trúc & Thiết Kế

| Hạng mục | Quyết định kỹ thuật / Thiết kế |
| :--- | :--- |
| **Phong cách UI/UX** | Minimalist Studio (Dark theme chủ đạo, viền siêu mảnh 1px, canvas tối đa hóa không gian hiển thị cho thiết kế). |
| **Màu sắc chủ đạo** | Nền tối (`#09090B`, `#121214`), Accent **Cam Neon** (`#FF5500` / `#FF6B00`), Chữ trắng tương phản cao (`#FAFAFA`). |
| **Chuyển động (Motion)** | **Framer Motion** với spring physics (chuyển động tự nhiên khi filter, đổi layout grid, mở lightbox). |
| **Frontend Stack** | **Next.js 15 (App Router)** + **React 19** + **TypeScript** + **Tailwind CSS v4** + **Lucide Icons**. |
| **Kiến trúc Dữ liệu** | Mô hình thực thể đa hình (**Polymorphic Asset Entity**) với trường `metadata: JSONB` để hiện tại lưu ảnh, tương lai lưu Palettes, Tokens, 3D, Figma Embeds. |
| **Quản lý & Tìm kiếm** | Command Palette (`Cmd + K`), Instant Fuzzy Search, Lọc thời gian linh hoạt (Presets & Range), Inline Rename (`R`). |

---

## 2. Quy Trình Triển Khai Chi Tiết (5 Giai Đoạn)

### Giai đoạn 1: Khởi Tạo Dự Án & Thiết Lập Theme Tối Giản
*Mục tiêu: Dựng bộ khung công nghệ, thiết lập theme Cam Neon và hệ thống animation.*

- [x] **1.1** Khởi tạo source code Next.js 15 với TypeScript và Tailwind CSS trong thư mục `archiver`.
- [x] **1.2** Cấu hình Design System & Tokens:
  - Bảng màu: `--color-accent: #FF5500`, `--color-surface: #121214`, `--color-border: #27272A`.
  - Typography: Font không chân sắc nét (Geist / Inter).
- [x] **1.3** Tích hợp thư viện animation: Framer Motion và bộ icon Lucide.
- [x] **1.4** Xây dựng Layout khung sườn:
  - Header tối giản (Logo, nút Upload nhanh, thanh tìm kiếm kích hoạt bằng `Cmd + K`, bộ lọc).
  - Floating Action Bar / Clean Canvas.

---

### Giai đoạn 2: Kiến Trúc Dữ Liệu & TypeScript Modeling
*Mục tiêu: Đảm bảo dữ liệu hiện tại lưu ảnh tối ưu, nhưng cấu trúc sẵn sàng cho mọi loại asset tương lai.*

- [x] **2.1** Xây dựng Type Definitions mở rộng (`types/asset.ts`):
  - Interface cơ sở `BaseAsset` (id, title, created_at, tags, asset_type, dominant_colors).
  - Type-specific metadata: `ImageAssetMetadata` (width, height, ratio, blurhash, format, figma_id).
  - Types chuẩn bị cho tương lai: `PaletteAssetMetadata`, `TokenAssetMetadata`, `FigmaFrameMetadata`.
- [x] **2.2** Thiết lập Mock Data & Service Layer (`lib/mock-data.ts`, `lib/storage.ts`) để phát triển và test UI tức thì mà không bị nghẽn bởi hạ tầng backend.
- [x] **2.3** Cấu hình cơ chế lưu trữ (Local Storage persistence adapter).

---

### Giai đoạn 3: Trải Nghiệm Upload, Quản Lý Tên & Thư Viện Ảnh (Core MVP)
*Mục tiêu: Lưu trữ, xem ảnh và thao tác quản lý tên siêu tốc.*

- [x] **3.1 Kéo thả Upload thông minh**:
  - Hỗ trợ kéo thả trực tiếp vào màn hình (Full-window Dropzone).
  - Hỗ trợ dán ảnh từ Clipboard (`Ctrl + V` trực tiếp từ Figma).
  - Tự động dọn dẹp tên file gốc (bỏ extension, chuyển `_`, `-` thành khoảng trắng, format chuẩn).
- [x] **3.2 Inline Rename & Quản lý danh tính**:
  - Phím tắt `R` hoặc bấm đúp vào tên để sửa tên trực tiếp trên thẻ ảnh (viền Cam Neon phát sáng mượt mà).
  - Hỗ trợ đổi tên nhanh không cần bật pop-up.
- [x] **3.3 Grid Hiển Thị Masonry & Card Tương Tác**:
  - Bố cục Masonry Grid linh hoạt theo tỷ lệ ảnh gốc (không bị méo hay cắt ảnh).
  - Hover state tinh tế: Hiển thị nhanh kích thước, định dạng, tags và nút Copy.
  - Quick Lightbox: Bấm để xem ảnh kích thước thật, hỗ trợ phím mũi tên chuyển ảnh.

---

### Giai đoạn 4: Bộ Lọc & Công Cụ Tìm Kiếm Chuyên Sâu (Search & Filter Engine)
*Mục tiêu: Giúp designer tìm kiếm bất kỳ ấn phẩm nào chỉ trong vài giây.*

- [x] **4.1 Tìm kiếm theo tên & từ khóa (Instant Search)**:
  - Tìm kiếm mờ (Fuzzy Search), phản hồi dưới 100ms khi gõ.
  - Tích hợp Command Palette (`Cmd + K` hoặc bấm `/`) tìm kiếm toàn hệ thống.
- [x] **4.2 Bộ lọc thời gian (Date & Time Filters)**:
  - Nút chọn nhanh (Presets): *Hôm nay*, *7 ngày qua*, *Tháng này*, *Quý này*.
  - Bộ chọn khoảng ngày tùy chỉnh (Custom Date Range Picker) dạng Popover tối giản.
- [x] **4.3 Bộ lọc theo đặc tính thiết kế**:
  - Lọc theo tỷ lệ: *Dọc (Mobile/Story)*, *Ngang (Web/Desktop)*, *Vuông*.
  - Lọc theo định dạng: *PNG, SVG, JPG, WebP, GIF*.
  - Lọc theo thẻ (Tags) & Màu sắc chủ đạo (Dominant Colors).
- [x] **4.4 Motion Transition**:
  - Sử dụng layout animation của Framer Motion để khi lọc, các ảnh trên grid tự động lướt trượt vị trí êm ái, không bị biến mất đột ngột.

---

### Giai đoạn 5: Mở Rộng Tính Năng & Tích Hợp Figma Sâu Rộng (Future Scope)
*Mục tiêu: Đưa ứng dụng thành trạm trung chuyển dữ liệu thiết kế toàn diện.*

- [ ] **5.1 Tích hợp Figma API / Plugin**:
  - Gắn link Figma Frame trực tiếp vào asset, click để mở trực tiếp trong app Figma.
  - Figma Plugin riêng: 1-click từ Figma đẩy thẳng sang Design Vault.
- [ ] **5.2 Mở rộng các dạng tài nguyên mới**:
  - Quản lý Bảng màu (Color Palettes) trích xuất từ Figma styles.
  - Quản lý Design Tokens (JSON format W3C DTCG).
- [ ] **5.3 Đổi tên & Gắn nhãn hàng loạt (Batch Actions)**:
  - Chọn nhiều ảnh để đổi tiền tố, thêm tag hoặc gom vào Collection/Board.
- [ ] **5.4 AI Visual Search**:
  - Tìm kiếm ảnh theo mô tả hình ảnh hoặc tìm ảnh tương đồng bằng Vector Search.

---

## 3. Checklist Thực Thi Ngay (Immediate Action Items)

| STT | Nhiệm vụ | Trạng thái |
| :--: | :--- | :--: |
| 1 | Khởi tạo dự án Next.js 15 + Tailwind CSS v4 tại `c:\Users\phamd\OneDrive\Documents\archiver` | ✅ Hoàn thành |
| 2 | Cấu hình Theme Neon Orange + Dark Mode Minimalist | ✅ Hoàn thành |
| 3 | Xây dựng Masonry Grid + Framer Motion animation layout | ✅ Hoàn thành |
| 4 | Xây dựng thanh công cụ Lọc theo Ngày tháng & Tìm kiếm tên tức thời | ✅ Hoàn thành |
| 5 | Tích hợp Drag & Drop Upload + Inline Rename (phím `R`) | ✅ Hoàn thành |
