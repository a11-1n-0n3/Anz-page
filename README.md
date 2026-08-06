# ANZ

Landing page dựng bằng Next.js 16 (App Router) + Tailwind 4, song ngữ Việt / Anh.

Comment trong code viết bằng tiếng Anh; tài liệu này viết tiếng Việt.

## Chạy dự án

```bash
cp .env.example .env.local     # điền giá trị nếu cần, để trống vẫn chạy được
npm run dev                    # http://localhost:3000
npm run build && npm start     # bản production
```

Yêu cầu Node >= 20.9 (Next 16).

## Cấu trúc

```
messages/                   chữ vi / en
src/
├── app/                    routing — [locale], opengraph-image, sitemap, robots
├── components/             UI
├── lib/                    site · utils · contact · contact-action
├── i18n/                   next-intl
└── proxy.ts                chọn locale
```

`[locale]` là dynamic route của next-intl (chuẩn docs) — không phải folder code thừa.
`app/` chỉ chứa route; mọi thứ khác nằm ngoài.

Contact: schema ở `lib/contact.ts` (client + server), gửi mail ở
`lib/contact-action.ts` (`"use server"` — không import file này từ client ngoài
Server Action).

| | |
|---|---|
| `siteConfig.contact` | Thông tin liên hệ **của công ty** |
| `lib/contact` | Form liên hệ **từ người dùng** |

## Đa ngôn ngữ

**URL:** `/` là tiếng Việt (không tiền tố), `/en` là tiếng Anh. Giữ tiếng Việt ở
URL gốc vì đó là thị trường chính. `/vi` tự redirect về `/`.

**Chọn ngôn ngữ:** ưu tiên cookie đã lưu → `Accept-Language` của trình duyệt →
mặc định tiếng Việt. Bấm nút chuyển ngôn ngữ sẽ ghi cookie, lần sau vào thẳng
đúng ngôn ngữ.

**Thêm chữ mới:** thêm khoá vào cả `messages/vi.json` và `messages/en.json`, rồi
dùng `useTranslations("namespace")` trong component. Thiếu khoá ở một file thì
next-intl báo lỗi lúc render — không im lặng bỏ qua.

**Thêm ngôn ngữ thứ ba:** thêm mã vào `locales` trong `src/i18n/routing.ts`, tạo
`messages/<mã>.json`, thêm vào `ogLocales`. Không phải sửa component nào.

### Ba chỗ dễ sai — đã xử lý sẵn

**Luôn import `Link` từ `@/i18n/navigation`, không phải `next/link`.** Link của
next-intl tự thêm tiền tố `/en` khi đang ở tiếng Anh; dùng nhầm `next/link` sẽ
đá người dùng về tiếng Việt giữa chừng.

**Thông báo lỗi validation là KHOÁ, không phải câu chữ.**
`lib/contact.ts` trả về `"emailInvalid"`; form map sang câu chữ qua
`t()`. Nhờ vậy một schema dùng chung cho cả hai ngôn ngữ, và server không cần
biết locale.

**Ảnh OG dùng `app/opengraph-image.tsx`** — một ảnh chung cho mọi ngôn ngữ.
Đặt ngoài `[locale]` để URL không bị redirect (crawler preview hay bỏ qua
redirect).

## Hai chỗ dễ làm sai khác

**`metadataBase` trong `app/[locale]/layout.tsx`.** Không có nó thì `og:image` là
đường dẫn tương đối và các mạng xã hội bỏ qua ảnh preview. Giá trị lấy từ
`lib/site.ts` (hoặc biến `NEXT_PUBLIC_SITE_URL`).

**Ảnh hero là ảnh LCP.** Khi thay khối xám trong `hero.tsx` bằng ảnh thật, dùng
`next/image` kèm `priority` — để lazy-load sẽ làm điểm hiệu năng tụt rõ rệt.

## Việc cần làm trước khi lên production

- [ ] Đổi `url` trong `src/lib/site.ts` (hoặc set `NEXT_PUBLIC_SITE_URL`) sang domain thật.
- [ ] Thay nội dung placeholder trong `messages/vi.json` và `messages/en.json`.
      Bản tiếng Anh hiện là bản dịch máy — nên nhờ người bản ngữ rà lại.
- [ ] Thay khối xám trong `hero.tsx` bằng ảnh sản phẩm thật.
- [ ] Set `RESEND_API_KEY` và `CONTACT_NOTIFY_EMAIL`; đổi địa chỉ `from` trong
      `lib/contact-action.ts` sang domain đã verify với Resend.
- [ ] Thêm rate limit cho Server Action nhận form (gợi ý `@upstash/ratelimit`).
- [ ] Gắn analytics (`@vercel/analytics` hoặc GA4).

## Ghi chú về hiệu năng

Trang chủ tải khoảng **272 KB JS (đã nén)** — i18n làm tăng thêm 14 KB so với
bản một ngôn ngữ. Phần lớn vẫn đến từ `react-hook-form` + `zod` mà form liên hệ
dùng ở phía client.

Chỉ những message mà Client Component thực sự cần mới được gửi xuống trình
duyệt; phần còn lại dịch xong ở server nên không tốn byte nào.

Muốn nhẹ hơn: bỏ `react-hook-form` + `zod` ở client và dùng `useActionState` với
validate hoàn toàn ở server — giảm khoảng 100 KB, đổi lại lỗi validation chỉ
hiện sau khi submit thay vì ngay khi gõ.
# Anz-page
