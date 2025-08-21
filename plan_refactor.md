## Kế hoạch refactor Style/CSS/Tailwind cho Tech Digest Vietnam

Tài liệu này tổng hợp rà soát hiện trạng, vấn đề và đề xuất kế hoạch refactor chi tiết cho hệ thống style (Tailwind/CSS) của dự án.

### Mục tiêu
- Đơn giản hóa và thống nhất hệ thống style, giảm CSS thủ công, tận dụng Tailwind.
- Chuẩn hóa token màu/typography/dark mode, dễ mở rộng và bảo trì.
- Giảm trùng lặp, loại bỏ 2 chế độ dark song song, giảm inline style.
- Tối ưu kích thước build và tốc độ render.

### Phạm vi
- Cấu hình: `tailwind.config.js`, `postcss.config.js`.
- Global CSS: `src/index.css`, `src/styles/fonts.css`, loại bỏ `src/App.css` nếu không dùng.
- Component chính: `Header`, `MarkdownRenderer`, `EnhancedContent`, `TableOfContents`, `TagComponent`, `LoadingSpinner`, `Pagination`, `ReportsList`, `ReportDetail`, `CombinedAnalysisView`.

---

## 1) Hiện trạng và phát hiện

### 1.1 Cấu hình Tailwind
- `darkMode: 'class'`, content scan `./src/**/*.{js,jsx,ts,tsx}` hợp lệ.
- `theme.extend.colors` dùng biến CSS (tokens) cho primary/secondary/neutral và accent-emerald/rose/blue.
- `@tailwindcss/typography` đã bật, có cấu hình `typography.DEFAULT` và biến thể `vietnamese`.

Vấn đề/Đề nghị:
- Accent đang dùng thêm orange ở CSS/JSX nhưng chưa khai báo trong Tailwind (thiếu `accent-orange`).
- Nên thêm plugin `@tailwindcss/line-clamp` để thay thế CSS thủ công `.line-clamp-*`.
- Có thể cân nhắc `@tailwindcss/forms` nếu dùng inputs/forms nhiều.

### 1.2 Global CSS (`src/index.css`)
- Rất lớn, chứa:
  - Biến CSS cho font, kích thước, line-height, màu (primary/secondary/accent/neutral), gradients, shadows, transitions, focus ring.
  - 2 hệ dark mode: `.dark` trên `html` và `.dark-theme` trên `body` kèm nhiều selector ghi đè lớp Tailwind (`.text-gray-*`, `.bg-white`, ...).
  - Rất nhiều block `.prose` và các phiên bản dark duplicated.
  - Tự định nghĩa `.line-clamp-1/2/3` thay vì plugin Tailwind.
  - Nhiều component-level CSS: `.tag*`, `.toc-*`, `.back-to-top`, animations, skeletons.
  - Nhiều alias utilities (`.text-primary`, `.text-secondary`, ...).

Vấn đề/Đề nghị:
- Trùng lặp lớn giữa `.prose` và `.dark-theme .prose`; nên chuyển sang cấu hình `typography` và dùng `prose`/`prose-invert`.
- Dark mode “kép” (`.dark` + `.dark-theme`) tạo maintenance overhead; nên thống nhất chỉ dùng `.dark` (Tailwind).
- Nhiều lớp `.dark .dark\:*` thủ công để bù cho class không có trong Tailwind; nên thay bằng utilities/variants chuẩn hoặc tokens.
- Animations nằm rải rác; nên gom `@keyframes` và lớp `.animate-*` vào một khu vực `@layer utilities`.
- Component styles nên chuyển vào `@layer components` để dễ quản lý.

### 1.3 Fonts (`src/styles/fonts.css` + `index.css`)
- Cả hai file đều `@import` Google Fonts (Inter, Noto Sans, Noto Serif). Trùng lặp.
- `fonts.css` định nghĩa nhiều biến font, nhưng `index.css` cũng có biến tương tự.

Đề nghị: Duy trì một nơi import fonts (ưu tiên `index.css`), còn `fonts.css` chỉ giữ utilities cần thiết hoặc hợp nhất vào `index.css` trong `@layer base`.

### 1.4 Component điển hình
- `Header.jsx`: sử dụng nhiều inline style cho gradient/shadow/màu; có `text-inverse` (utility tự định nghĩa). Dùng state dark mode để set `body.dark-theme` và `html.dark` đồng thời.
- `MarkdownRenderer.jsx`: đã dùng `prose prose-vietnamese dark:prose-invert`, nhưng vẫn override headings/paragraph bằng class Tailwind trong component.
- `EnhancedContent.jsx`: custom Markdown mapping + `.back-to-top` (CSS), `.section-highlight` (CSS), header gradient; TOC dùng component `TableOfContents`.
- `TableOfContents.jsx`: dùng Tailwind + class tuỳ biến, logic activeId, gradient/emerald set bằng utilities.
- `TagComponent.jsx`: phụ thuộc các lớp `.tag*` định nghĩa trong CSS.
- `LoadingSpinner.jsx`: nhiều inline style cho màu/gradient/border; có skeletons sử dụng biến màu.
- `ReportsList.jsx`: dùng `line-clamp-2` (nên chuyển sang plugin Tailwind).
- `Pagination.jsx`: chủ yếu Tailwind, có vài inline style cho progress width (hợp lý).
- `ReportDetail.jsx`, `CombinedAnalysisView.jsx`: nhiều gradient header, `prose` và block gradient/tokens.

Vấn đề chung:
- Inline style cho màu/gradient/shadow lặp lại → khó đồng bộ dark mode và tokens.
- Duplicated rules giữa CSS và Tailwind utilities.
- Nhiều selector `.dark-theme .text-gray-*` để override lớp Tailwind → nên chuyển sang tokens hoặc `dark:`.

---

## 2) Nguyên tắc refactor
- Một nguồn sự thật cho dark mode: chỉ dùng `.dark` trên `html` (Tailwind).
- Một nguồn sự thật cho fonts: chỉ một nơi import Google Fonts.
- Ưu tiên Tailwind utilities và plugin over CSS thủ công.
- Component styles chuẩn hóa trong `@layer components`.
- Global tokens (màu/typography/gradient/shadow) định nghĩa tập trung và dùng thông qua Tailwind (extend + CSS variables).
- Tránh override lớp màu cụ thể của Tailwind theo tên (vd `.text-gray-700`); thay bằng tokens (`text-primary`, `text-secondary`) hoặc mapping màu riêng.

---

## 3) Kế hoạch thay đổi chi tiết

### 3.1 Dark mode: hợp nhất sang `.dark`
1) `App.jsx`:
   - Giữ `document.documentElement.classList.toggle('dark')` theo state.
   - Loại bỏ `document.body.classList.add/remove('dark-theme')`.
2) `index.css`:
   - Xoá dần các block `.dark-theme ...`; chuyển logic sang `dark:` hoặc `.dark ...` nếu cần.
   - Tránh ghi đè lớp Tailwind theo tên (vd `.dark-theme .text-gray-700`). Dùng tokens: `text-secondary`, v.v.

Kết quả: chỉ còn 1 cơ chế dark, code nhẹ và dễ đoán.

### 3.2 Fonts và base typography
1) Bỏ `@import` fonts trùng lặp trong `src/styles/fonts.css` (giữ import duy nhất ở `index.css`).
2) Chuyển base h1–h6, p, a, code vào `@layer base` hoặc `theme.extend.typography` để Tailwind quản lý.
3) Dùng `prose` + `prose-invert` cho markdown; giảm override trong components.

### 3.3 Tổ chức lại `index.css` theo layer
- `@layer base`:
  - `:root` tokens (màu, gradient, shadow, focus ring, typography tokens cơ bản).
  - Reset nhẹ (scroll-behavior, smoothing), body typography defaults.
- `@layer components`:
  - `.tag*`, `.toc-*`, `.back-to-top`, `.source-reference`, `.subsection-title`, `.read-more-link`, `.section-highlight`.
- `@layer utilities`:
  - `@keyframes` + `.animate-*`, alias tiện ích (`.text-primary`, `.text-secondary`, `.text-muted`, `.text-inverse`).
  - Xoá `.line-clamp-*` tự viết (sẽ dùng plugin Tailwind).

### 3.4 Cập nhật Tailwind config
1) Thêm màu: `accent-orange` (đã dùng nhiều trong CSS/JSX) với 3 mức (`default/light/dark`) tương tự các accent khác.
2) Hoàn thiện `theme.extend.typography` để phản ánh style đang áp dụng cho `.prose` (heading, paragraph, code, blockquote, link), và kiểm soát dark qua `prose-invert`.
3) Bật plugins:
   - `@tailwindcss/line-clamp`
   - (Tuỳ) `@tailwindcss/forms`

### 3.5 Line clamp
- Xoá `.line-clamp-1/2/3` trong CSS.
- Dùng trực tiếp `line-clamp-1/2/3` từ plugin.

### 3.6 Chuẩn hoá Tag system
Phương án A (khuyến nghị):
- Dùng utilities Tailwind theo `variant`/`size` trong `TagComponent` (có thể dùng `clsx`/`cva`).
- Loại bỏ phần lớn `.tag*` trong CSS; giữ lại tối thiểu nếu cần hiệu ứng.

Phương án B:
- Giữ `.tag*` nhưng chuyển gọn vào `@layer components`, dùng tokens và `dark:` thay vì 2 bộ quy tắc.

Ưu tiên A để giảm CSS thủ công và thống nhất phong cách.

### 3.7 Giảm inline style trong JSX
- Tạo utilities/class dùng lại cho:
  - Gradient nền: `bg-gradient-primary`, `bg-gradient-secondary`, `bg-gradient-dark`.
  - Shadow: `shadow-accent`, `shadow-primary`, v.v. (hoặc dùng `drop-shadow`/`shadow-*` Tailwind nếu đủ).
  - Màu chữ: dùng `text-primary/secondary/muted/inverse` thay vì `style={{ color: 'var(--...)' }}`.
- Áp dụng tại: `Header.jsx`, `App.jsx` (loading), `LoadingSpinner.jsx`, `CombinedAnalysisView.jsx`.

### 3.8 Prose/Markdown
- Giảm override trong `MarkdownRenderer`/`EnhancedContent` nếu `typography` đã bao phủ.
- Dùng `prose` + `prose-invert` + `prose-vietnamese` (nếu cần tuỳ biến) từ Tailwind config.
- Chỉ giữ logic auto-ID và vài class nhỏ (vd: border-b cho h2 nếu là yêu cầu UX riêng).

### 3.9 Animations
- Gom toàn bộ `@keyframes` vào một cụm; prefix tên có nghĩa (`tdv-fade-in`, `tdv-glow-pulse`, ...).
- Giữ số lượng ở mức hợp lý; hỗ trợ `prefers-reduced-motion`.

### 3.10 Dọn dẹp
- Xoá `src/App.css` (CRA demo) nếu không còn được import hoặc di trú các rule cần thiết sang `@layer`.
- Loại bỏ selector `.dark-theme ...` sau khi chuyển hết.
- Loại bỏ `.dark .dark\:*` classes tùy biến không cần thiết.

---

## 4) Lộ trình triển khai (từng bước an toàn)

1) Bước nền tảng (PR1)
- Tailwind config: thêm `accent-orange`, bật `@tailwindcss/line-clamp` (+forms nếu cần).
- Dừng set `body.dark-theme` trong `App.jsx`; chỉ giữ `html.dark`.
- Build kiểm tra không vỡ UI lớn.

2) Dark mode cleanup (PR2)
- Di trú các rule `.dark-theme` sang `dark:` hoặc `.dark` tương ứng.
- Xoá `.dark-theme` khỏi `index.css` khi đã bảo đảm tương đương.

3) Prose consolidation (PR3)
- Chuyển style `.prose` vào `theme.extend.typography` (light/dark).
- Giảm override trong `MarkdownRenderer`/`EnhancedContent`.

4) Line clamp (PR4)
- Xoá lớp `.line-clamp-*` thủ công trong CSS.
- Sửa nơi dùng (`ReportsList.jsx`…) sang plugin `line-clamp-*`.

5) Tag system (PR5)
- Áp dụng Phương án A (Tailwind utilities) trong `TagComponent`.
- Xoá hoặc rút gọn `.tag*` trong `index.css`.

6) Giảm inline style (PR6)
- Tạo utilities/class dùng lại cho gradient/shadow/màu.
- Refactor `Header`, `App` (loading), `LoadingSpinner`, `CombinedAnalysisView`.

7) Fonts và base (PR7)
- Gỡ import Google Fonts trùng lặp ở `styles/fonts.css`.
- Hợp nhất base typography vào `@layer base` và/hoặc `typography`.

8) Dọn dẹp & tối ưu (PR8)
- Xoá `App.css` (nếu không dùng), gỡ selector/alias thừa.
- Purge lại, kiểm tra kích thước build.

Mỗi PR có thể deploy thử để so sánh UI light/dark và mobile/desktop.

---

## 5) Kiểm thử và chấp nhận

Checklist UI:
- Light/Dark: header/nav, cards/list, markdown (h1–h6, p, a, code, blockquote, list), TOC, Tag, Pagination, Loading/Skeleton.
- Mobile: navbar sticky, TOC dropdown, back-to-top, spacing/độ đọc.
- A11y: focus ring, skip-to-content, contrast.

Chấp nhận khi:
- Không còn `.dark-theme` và lớp `.dark .dark\:*` tuỳ biến.
- `index.css` giảm ≥ 50–60% dòng so với hiện tại.
- Một nơi import Google Fonts.
- `line-clamp` dùng plugin Tailwind.
- Inline style cho màu/gradient/shadow giảm rõ rệt ở component chính.

---

## 6) Công cụ và quy ước
- Thêm `prettier-plugin-tailwindcss` để auto-sort className.
- Quy ước viết class: layout → spacing → typography → color → effects → state.
- Content safelist nếu có dynamic classes không match regex của Tailwind.

---

## 7) Ghi chú triển khai cụ thể theo file

### `tailwind.config.js`
- Thêm `accent-orange` và đồng bộ với biến CSS.
- Bật `@tailwindcss/line-clamp` (+forms nếu cần).
- Mở rộng `typography.DEFAULT` và `typography.invert` phản ánh style hiện tại.

### `src/index.css`
- Tổ chức lại theo `@layer base/components/utilities`.
- Xoá `.dark-theme ...` sau khi di trú, xoá `.line-clamp-*` thủ công.
- Gom `@keyframes` vào một chỗ; giữ `prefers-reduced-motion`.

### `src/styles/fonts.css`
- Gỡ `@import` Google Fonts; chỉ giữ utilities cần thiết hoặc hợp nhất vào `index.css`.

### `src/App.jsx`
- Thay đổi bật/tắt dark chỉ trên `html` (`document.documentElement.classList`) và meta theme-color.
- Loading screen: thay inline style bằng class utilities sẵn có.

### `src/components/Header.jsx`
- Thay inline `style={{ background: ..., boxShadow: ... }}` bằng class utilities (`bg-gradient-primary`, `shadow-accent`).
- Dùng `text-primary/secondary/inverse` thay màu thủ công.

### `src/components/MarkdownRenderer.jsx` và `EnhancedContent.jsx`
- Giảm override: để `prose` xử lý chính; chỉ giữ auto-ID và vài chi tiết UI.

### `src/components/TagComponent.jsx`
- Chuyển sang utilities Tailwind dựa trên `variant`/`size` (A). Nếu giữ (B), gom vào `@layer components` và dùng `dark:`.

### `src/components/LoadingSpinner.jsx`
- Tạo utilities cho border/gradient thay inline style; hoặc map màu qua Tailwind theme.

### `src/components/ReportsList.jsx`
- Đảm bảo `line-clamp-2` dùng plugin.

### `src/components/Pagination.jsx`
- Giữ inline style tính toán width thanh tiến độ; phần màu/gradient chuyển sang utilities.

---

## 8) Rủi ro và giảm thiểu
- Vỡ style dark mode khi di trú: làm theo PR nhỏ, so sánh UI.
- Tái tạo đầy đủ typography trong `typography` plugin: xác nhận từng loại phần tử (h1–h6/p/code/blockquote/list/link).
- Dynamic classes không được Tailwind quét: dùng safelist.

---

## 9) Kết quả mong đợi
- Code style rõ ràng, ít CSS thủ công, dễ bật tắt dark, dễ đổi theme bằng tokens.
- Kích thước CSS build nhỏ hơn; maintenance cost thấp.
- Tính nhất quán cao giữa component và markdown prose.

