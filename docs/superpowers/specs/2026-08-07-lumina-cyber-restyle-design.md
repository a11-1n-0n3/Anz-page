# Restyle landing ANZ theo ngôn ngữ thiết kế LuminaAI — biến thể cyber xanh đen

Ngày: 2026-08-07
Trạng thái: chờ duyệt

## Mục tiêu

Áp ngôn ngữ thiết kế của trang LuminaAI (khung canvas bo góc lớn, nền sóng
gradient, nav dạng pill rời, headline có clause in nghiêng, trust strip nằm
trong khung hero) lên landing page ANZ hiện có — nhưng đổi bảng màu từ sunset
kem-cam sang **cyber xanh đen: hero và footer nền navy gần đen, các section
giữa nền sáng lạnh, accent chuyển cyan → electric blue**.

Nội dung, cấu trúc section, i18n vi/en, SEO và toàn bộ logic form giữ nguyên.
Đây là thay đổi lớp trình bày, không phải thay đổi sản phẩm.

## Không làm

- Không copy chữ, logo hay tên "LuminaAI".
- Không thêm logo Miro / Figma / Slack. `partners` trong `lib/site.ts` đang là
  placeholder và đã có cảnh báo sẵn ở đó — giữ nguyên placeholder.
- Không đụng `lib/*`, `i18n/*`, `proxy.ts`, `contact-action.ts`, schema zod,
  metadata / sitemap / robots.
- Không thêm dependency mới. Không thêm file ảnh nền.
- Không thêm animation lặp vô hạn (xem "Chuyển động" bên dưới).

---

## 1. Hệ màu

Trang có **hai bề mặt** trong cùng một document: sáng và tối. Xử lý bằng cách
khai báo lại token trong một class scope, không phải bằng cách viết biến thể
`dark:` rải khắp component.

### 1.1 Token gốc — bề mặt sáng (`:root`)

| token | giá trị | vai trò |
|---|---|---|
| `--background` | `#f6f9fb` | nền trang, near-white lạnh |
| `--foreground` | `#0b1620` | chữ chính |
| `--card` | `#ffffff` | card nổi trên nền |
| `--card-foreground` | `#0b1620` | |
| `--primary` | `#0b1620` | nền nút chính |
| `--primary-foreground` | `#ffffff` | |
| `--secondary` | `#eaf1f5` | băng phụ |
| `--muted` | `#eaf1f5` | |
| `--muted-foreground` | `#5b6b78` | chữ phụ |
| `--accent` | `#e6f0fa` | hover |
| `--border` / `--input` | `#dce5ec` | |
| `--ring` | `#0b63c9` | focus ring |
| `--destructive` | `#dc2626` | giữ nguyên |
| `--neon` | `#22d3ee` | **trang trí only** — chấm, viền, fill gradient |
| `--neon-ink` | `#0b63c9` | **chữ** accent trên bề mặt sáng |
| `--neon-soft` | `color-mix(in oklab, #22d3ee 12%, white)` | vùng loang nhạt |
| `--radius` | `1.25rem` | |
| `--radius-frame` | `2.25rem` | khung canvas ngoài |

`--radius-frame` phải được đăng ký trong `@theme inline` để dùng được như
`rounded-frame`. Tailwind 4 đã bỏ cú pháp rút gọn `rounded-[--var]` của v3 —
viết `rounded-[--radius-frame]` sẽ im lặng không ra gì.

### 1.2 Bề mặt tối — class `.surface-dark`

Áp lên khung hero và footer. Khai báo lại chính những token trên, nên component
con **không cần biết mình đang nằm trên nền nào**:

```css
.surface-dark {
  --background: #070d13;
  --foreground: #e6f1f8;
  --card: #0e1720;
  --card-foreground: #e6f1f8;
  --primary: #e6f1f8;          /* nút đảo: nền sáng, chữ tối */
  --primary-foreground: #070d13;
  --secondary: #16222e;
  --muted: #16222e;
  --muted-foreground: #93a7b6;
  --accent: #16222e;
  --border: #1e2c39;
  --input: #1e2c39;
  --ring: #67e8f9;
  --neon: #22d3ee;
  --neon-ink: #67e8f9;         /* trên nền tối, accent chữ phải SÁNG hơn */
  --neon-soft: color-mix(in oklab, #22d3ee 18%, #0e1720);
  background-color: var(--background);
  color: var(--foreground);
}
```

### 1.3 Kỷ luật contrast — bắt buộc giữ

Codebase hiện tại tách `--gold` (trang trí) khỏi `--gold-ink` (chữ) vì gold chỉ
đạt 2.8:1 trên trắng. Nguyên tắc đó giữ nguyên, chỉ đổi hue:

**`--neon` (#22d3ee) không bao giờ được mang chữ.** Nó đạt 1.81:1 trên trắng.
Chữ accent luôn dùng `--neon-ink`.

Số đo đã kiểm (WCAG 2.1, ngưỡng AA 4.5:1 cho chữ thường):

| cặp màu | tỉ lệ | kết quả |
|---|---|---|
| `#0b1620` trên `#f6f9fb` | 17.27 | ✅ |
| `#5b6b78` trên `#f6f9fb` | 5.20 | ✅ |
| `#5b6b78` trên `#ffffff` | 5.50 | ✅ |
| `#0b63c9` trên `#f6f9fb` | 5.45 | ✅ |
| `#0b63c9` trên `#ffffff` | 5.77 | ✅ |
| `#22d3ee` trên `#ffffff` | 1.81 | ❌ — đúng như thiết kế, trang trí only |
| `#e6f1f8` trên `#070d13` | 17.01 | ✅ |
| `#93a7b6` trên `#070d13` | 7.85 | ✅ |
| `#93a7b6` trên `#0e1720` | 7.27 | ✅ |
| `#67e8f9` trên `#070d13` | 13.46 | ✅ |
| `#070d13` trên `#22d3ee` (nút cyan) | 10.80 | ✅ |

Script kiểm nằm ở phần Testing.

### 1.4 Đổi tên token

`--gold` → `--neon`, `--gold-ink` → `--neon-ink`, `--gold-soft` → `--neon-soft`,
kèm `--color-*` tương ứng trong `@theme inline`. Sửa mọi chỗ dùng
`text-gold-ink` / `bg-gold` / `ring-gold` trong components. Thuần cơ học.

### 1.5 Block `.dark` hiện tại

Xoá. Ứng dụng không có theme toggle nào (không có `next-themes`, không có nút
chuyển), nên block đó là code chết — và giữ lại thì nó chứa giá trị gold cũ,
gây nhầm lẫn cho người đọc sau. Bề mặt tối giờ do `.surface-dark` đảm nhiệm,
theo vị trí trên trang chứ không theo lựa chọn của người dùng.

---

## 2. Font chữ

Fraunces (serif, hiện dùng cho `h1`/`h2`) không ra được chất geometric của bản
tham chiếu. Thay bằng **Be Vietnam Pro**:

- geometric sans, có **italic** — cần cho clause nghiêng ở headline
- thiết kế riêng cho tiếng Việt, dấu chồng (ằ ẵ ặ ỡ ự ỹ) chắc chắn đúng

README đã ghi rõ Instrument Serif / DM Serif Display / Outfit / Sora / Figtree
**không có subset `vietnamese`** và vỡ trên nội dung này — không thử lại nhóm đó.

- `--font-display`: Be Vietnam Pro, weight `["600", "700"]`, có italic,
  subsets `["latin", "vietnamese"]`
- `--font-sans`: Inter — giữ nguyên
- `@layer base`: `h1, h2 { font-family: var(--font-display); letter-spacing: -0.03em }`
  (sans cần tracking âm hơn serif)

## 3. Chuyển động

**Không thêm animation lặp.** `globals.css` đã ghi lại lý do: một loop
`pulse-gold` trên hai chấm 6px từng buộc style recalc mỗi frame (301 lần / 5s)
và đẩy main-thread work của trang nhàn rỗi từ 97ms lên 429ms — 4.4x, cho thứ
trang trí. Sóng neon vẽ một lần, tĩnh.

Giữ `--animate-rise` (one-shot entrance) và giữ nguyên block
`prefers-reduced-motion` ở cuối file.

---

## 4. Component mới: `src/components/neon-waves.tsx`

Server Component, `aria-hidden`, không nhận prop ngoài `className`. SVG thuần,
không dependency, không file ảnh.

**Cấu trúc:**

1. **Nền** — 3 lớp `radial-gradient` xếp chồng trong `<defs>`: navy sâu ở trên,
   loang xanh dương ở giữa, cyan sáng dần về đáy.
2. **Ribbon** — 5–6 `<path>` cong, fill bằng `linearGradient` riêng
   (cyan → electric blue → trong suốt), mỗi path một `filter` `feGaussianBlur`
   với `stdDeviation` khác nhau và opacity so le. Đây là thứ tạo cảm giác
   "sóng chồng lớp" của bản gốc.
3. **Crest** — 2 đường `stroke` mảnh (`stroke-width` ~1) màu `--neon` chạy trên
   đỉnh hai ribbon nổi nhất, tạo cạnh sắc trên nền mờ.
4. **Horizon** — một dải ngang mỏng ở ~70% chiều cao, cộng bản lật ngược
   (`transform="scale(1,-1)"`) opacity thấp làm phản chiếu.

**Kỹ thuật:**

- `preserveAspectRatio="xMidYMax slice"` — sóng luôn bám đáy khung ở mọi tỉ lệ
  màn hình, không bị co lại thành vệt mỏng trên mobile.
- `viewBox="0 0 1440 900"`.
- Mọi `id` trong `<defs>` prefix `nw-` để không đụng id khác trên trang.
- Không `<image>`, không `<foreignObject>`.

**Rủi ro đã biết:** kết quả sẽ *gần giống* chứ không giống hệt pixel bản gốc —
đây là đánh đổi đã chấp nhận khi chọn CSS+SVG thay vì ảnh nền.

---

## 5. Thay đổi theo từng file

### `src/app/globals.css`
Viết lại phần token theo mục 1. Thêm `.surface-dark`. Xoá `.dark`. Thêm
`--radius-frame`. Giữ nguyên `@keyframes rise`, `:target` scroll-margin,
`prefers-reduced-motion`.

### `src/app/[locale]/layout.tsx`
- Đổi `Fraunces` → `Be Vietnam Pro` (thêm `style: ["normal", "italic"]`).
- `viewport.themeColor`: `#ffffff` → `#070d13` (hero là thứ đầu tiên hiện ra).

### `src/app/opengraph-image.tsx`
Đổi sang tone tối: nền `linear-gradient(135deg, #070d13, #0e1720)`, tên trắng,
tagline `#67e8f9`, URL `#93a7b6`. Ảnh OG phải khớp trang, nếu không link chia sẻ
trông như của site khác.

### `src/components/section.tsx`
- `Container`: giữ nguyên.
- `Section`: giữ nguyên spacing.
- Thêm `Frame` — bọc `rounded-[--radius-frame] overflow-hidden`, dùng cho hero.
- `Eyebrow`: chấm `bg-neon`, chữ `text-neon-ink`. Hoạt động trên cả hai bề mặt
  nhờ token scope, không cần prop.
- `SectionHeading`: tracking `-0.03em` (sans cần chặt hơn serif).

### `src/components/button.tsx`
Giữ nguyên API và `cva` (để `npx shadcn add` sau này vẫn khớp).
- `default`: `bg-primary text-primary-foreground` — tự đảo màu trên
  `.surface-dark`, không cần variant riêng.
- Thêm variant `neon`: nền `--neon`, chữ `#070d13` (10.80:1 ✅), dùng cho CTA
  chính trong hero.
- Thêm variant `link`: chữ trơn có gạch chân mảnh — cho CTA phụ
  ("Explore Capabilities" trong bản gốc).

### `src/components/site-header.tsx`
- Nav desktop: mỗi item là **pill rời** — `rounded-full px-3.5 py-1.5 bg-white/8
  hover:bg-white/14`, không phải link trần. Một giá trị duy nhất, vì header
  luôn tối (xem ngay dưới).
- CTA phải: pill có icon `ArrowUpRight` (lucide, đã cài).
- Header trong suốt đè lên hero. Giữ `sticky top-0 z-50`.
- Giữ nguyên `LanguageSwitcher` và `MobileNav` ở vị trí cũ.

**Vấn đề đã lường:** header sticky trong suốt sẽ cuộn từ hero tối sang section
sáng, chữ trắng trên nền sáng sẽ biến mất. Xử lý: **đặt `.surface-dark` lên
chính thanh header** kèm `bg-[--background]/70 backdrop-blur-md` — header giữ
màu tối cố định suốt trang. Không cần scroll listener, không cần Client
Component. Đây là lý do header không dùng nền trong suốt hoàn toàn.

### `src/components/hero.tsx`
Viết lại. Cấu trúc:

```
<section>                      py, không nền
  <Container>
    <Frame class="surface-dark relative">
      <NeonWaves />            absolute inset-0, -z-10
      headline (t.rich, <hl> → italic + text-neon-ink)
      description
      CTA: Button variant="neon" + Button variant="link"
      <Console />              mock camera AI, restyle
      <PartnerStrip onDark />  trust strip trong khung
    </Frame>
  </Container>
</section>
```

- Headline canh giữa, `text-[2.6rem] sm:text-6xl lg:text-7xl`.
- Clause `<hl>` render `italic text-neon-ink` — vị trí nghiêng lấy từ file dịch
  qua `t.rich`, không split chuỗi trong code. Tiếng Việt và tiếng Anh đặt clause
  ở mệnh đề khác nhau và chỉ người dịch mới biết chỗ đúng.
- Console camera AI **giữ lại**, đổi từ panel `#0f1115` sang khung viền
  `--neon/25` nền `--card` trong suốt một phần, khung detection màu `--neon`,
  chữ trạng thái dùng `--neon-ink`. Giữ nguyên `[transform:rotateX(1.4deg)]`,
  giữ nguyên việc ẩn nhãn detection dưới breakpoint `sm` (comment hiện tại giải
  thích: ở 320px các nhãn 10px chồng lên nhau thành nhiễu).
- Giữ nguyên `animate-rise` + stagger delay đang có.

### `src/components/partner-strip.tsx`
- Thêm prop `onDark?: boolean` — chỉ đổi opacity/blend của wordmark placeholder
  và bỏ viền `border-y` khi nằm trong khung hero.
- Giữ nguyên `if (partners.length === 0) return null`.
- `page.tsx` bỏ `<PartnerStrip />` standalone; hero render nó bên trong `Frame`.

### `src/components/feature-grid.tsx`
Đổi từ list `divide-y` hai cột sang **grid card bo lớn** (`sm:grid-cols-2
lg:grid-cols-3`), mỗi card: icon trong chip gradient cyan→blue, tiêu đề, mô tả.

⚠️ Đánh đổi có ý thức: comment hiện tại giải thích vì sao list 2 cột thắng
layout một cột (rule chạy hết chiều ngang, có rail tên miền để quét). Card làm
mất lợi thế đó nhưng là dạng thức đúng của ngôn ngữ thiết kế đang áp. Ghi lại
lý do thay thế trong comment mới, không xoá trắng lịch sử quyết định.

### `src/components/how-it-works.tsx`
Băng `rounded-[--radius-frame]` nền `--secondary` có loang `--neon-soft` ở góc.
Số bước trong vòng tròn viền `--neon`, chữ `--neon-ink`. Giữ connector ngang
và giữ nguyên cách nó dừng ở marker đầu/cuối thay vì chạy ra mép section.

### `src/components/team-grid.tsx`
Ảnh `rounded-3xl`. Card nền `--card` viền `--border`. Avatar rỗng giữ nguyên
kiểu neutral có viền đứt — comment hiện tại nói rõ vì sao: mặt hoặc tên bịa ra
là người giả trên một trang bán sự tin cậy.

### `src/components/contact.tsx` + `contact-form.tsx` + `input.tsx`
- Panel form `rounded-[2rem]` nền `--card`, viền `--border`.
- Input/Textarea: `rounded-xl`, giữ `bg-card`. Comment hiện tại giải thích vì
  sao không dùng `bg-background` — vẫn đúng với palette mới, giữ nguyên comment
  nhưng cập nhật "warm tint" thành mô tả đúng.
- Giữ toàn bộ `aria-[invalid=true]`, focus ring, và logic form.

### `src/components/site-footer.tsx`
Thêm `surface-dark`. Bo góc trên `rounded-t-[--radius-frame]`. Nội dung và
`footerNav` giữ nguyên.

### `src/components/mobile-nav.tsx`, `language-switcher.tsx`, `[locale]/not-found.tsx`
Chỉ cập nhật token màu (`gold-ink` → `neon-ink`) và bo góc cho khớp. Không đổi
logic — panel mobile giữ nguyên xử lý Escape và khoá scroll body.

### `messages/vi.json`, `messages/en.json`
**Không đổi.** Đã kiểm vị trí clause `<hl>` ở cả hai file:

- vi: `"Đưa AI vào <hl>vận hành thực tế</hl> cùng {name}"`
- en: `"Put AI <hl>into production</hl> with {name}"`

Cả hai clause đều đọc tốt khi in nghiêng, không cần dịch chuyển. Nếu về sau có
sửa, phải sửa **cả hai file** — thiếu khoá ở một file là lỗi render của
next-intl, không im lặng bỏ qua.

---

## 6. Ranh giới component

Không component nào cần biết nó đang nằm trên nền sáng hay tối. Bề mặt do
`.surface-dark` quyết định ở cấp container; component con chỉ đọc token. Hệ quả:
thêm một section tối sau này là thêm một class, không phải sửa từng file con.

Ngoại lệ duy nhất là `PartnerStrip.onDark`, vì nó cần đổi *cấu trúc* (bỏ viền
`border-y`) chứ không chỉ đổi màu — và đổi cấu trúc thì token không làm được.

`NeonWaves` không nhận prop nào ngoài `className`: nó là một hình vẽ, không phải
một hệ thống cấu hình. Muốn sóng khác thì sửa path trong file đó.

## 7. Testing

Không có test runner trong dự án (`package.json` chỉ có `dev`/`build`/
`start`/`lint`). Kiểm chứng theo thứ tự:

1. `npx tsc --noEmit` — sạch.
2. `npm run lint` — sạch.
3. `npm run build` — pass, và cả hai locale vẫn **static** (không có route nào
   rơi sang dynamic; `setRequestLocale` phải còn nguyên ở cả layout lẫn page).
4. Script contrast — chạy lại toàn bộ bảng ở mục 1.3 và in ra tỉ lệ thật.
   Bất kỳ cặp chữ/nền nào dưới 4.5:1 là lỗi chặn.
5. `npm run dev`, xem `/` và `/en` ở 3 khổ: 375px, 768px, 1440px.
   Kiểm riêng: headline tiếng Việt không tràn ở 375px (câu tiếng Việt dài hơn
   tiếng Anh ~15%); sóng vẫn bám đáy khung ở khổ dọc.
6. Bật `prefers-reduced-motion: reduce` trong DevTools — không có gì vô hình
   hoặc kẹt ở trạng thái ẩn.

## 8. Rủi ro

| rủi ro | xử lý |
|---|---|
| Sóng SVG không giống hệt bản gốc | Đã chấp nhận khi chọn CSS+SVG. Nếu không đạt, đổi sang ảnh nền là một quyết định riêng. |
| Header tối trôi trên section sáng | Header giữ `.surface-dark` cố định, không đổi màu theo scroll. Không cần JS. |
| Be Vietnam Pro italic có thể không hợp mắt ở weight 600 | Kiểm ở bước 5. Fallback: dùng weight 500 cho clause nghiêng. |
| Card feature làm mất lợi thế của list 2 cột | Đã ghi nhận là đánh đổi có ý thức, kèm lý do trong comment mới. |
| Đổi `--gold*` → `--neon*` sót chỗ | `grep -rn "gold" src/` sau khi sửa phải trả về 0 dòng. |

## 9. Thứ tự triển khai

1. `globals.css` — token + `.surface-dark` (nền tảng cho mọi bước sau)
2. `layout.tsx` — font + themeColor
3. `neon-waves.tsx` — component mới
4. `section.tsx`, `button.tsx`, `input.tsx` — primitives
5. `site-header.tsx`, `hero.tsx`, `partner-strip.tsx` — khối hero
6. `feature-grid.tsx`, `how-it-works.tsx`, `team-grid.tsx`, `contact.tsx` — thân trang
7. `site-footer.tsx`, `mobile-nav.tsx`, `language-switcher.tsx`, `not-found.tsx`
8. `opengraph-image.tsx`
9. `page.tsx` — bỏ `<PartnerStrip />` standalone
10. Chạy hết mục 7
