# ANZ

Landing page dựng bằng Next.js 16 (App Router) + Tailwind 4, song ngữ Việt / Anh.

Comment trong code viết bằng tiếng Anh; tài liệu này viết tiếng Việt.

## Chạy dự án

```bash
cp .env.example .env           # điền giá trị nếu cần, để trống vẫn chạy được
npm run dev                    # http://localhost:3000
npm run build && npm start     # bản production
```

Yêu cầu Node >= 20.9 (Next 16). Docker: `docker compose up -d --build` (port host = `HOST_PORT`, mặc định 80).

## CI/CD — push `main` thì deploy lên server

GitHub Actions SSH vào máy, `git reset --hard origin/main`, rồi `docker compose up -d --build`. File `.env` trên server không bị ghi đè (untracked).

**Một lần trên server**

```bash
# clone bằng SSH (để git pull không hỏi mật khẩu)
git clone git@github.com:a11-1n-0n3/Anz-page.git ~/work/Anz-page
cd ~/work/Anz-page
cp .env.example .env           # HOST_PORT=80, SITE_URL, Supabase, SMTP
chmod +x deploy.sh
docker compose up -d --build
```

Thêm deploy key (read-only) vào repo GitHub nếu clone SSH: Settings → Deploy keys.

**Một lần trên GitHub:** Settings → Secrets and variables → Actions → New repository secret:

| Secret | Ví dụ |
|---|---|
| `DEPLOY_HOST` | IP hoặc hostname server |
| `DEPLOY_USER` | `evg-user` |
| `DEPLOY_KEY` | private key (cả khối `BEGIN…END OPENSSH PRIVATE KEY`) |
| `DEPLOY_PATH` | `/home/evg-user/work/Anz-page` |

Tạo key riêng cho deploy, không dùng key cá nhân:

```bash
ssh-keygen -t ed25519 -f anz-deploy -N "" -C "anz-github-deploy"
# public → ~/.ssh/authorized_keys trên server
# private → secret DEPLOY_KEY
```

Sau đó `git push origin main`. Tab **Actions** trên GitHub sẽ chạy job Deploy.

## Cấu trúc

```
messages/                   chữ vi / en
src/
├── app/                    routing — [locale], opengraph-image, sitemap, robots
├── components/
│   ├── primitives/        button, input, form, field, card, …
│   ├── blocks/             reusable page chunks (PageHero, CardGrid, …)
│   └── layout/             site chrome (header, footer, mobile-nav)
├── lib/                    site · posts · jobs · media · supabase · contact
├── i18n/                   next-intl
└── proxy.ts                chọn locale
scripts/                    media-push (đẩy ảnh) · media-move-to-ids (đổi thư mục slug→id)
supabase/
├── schema.sql              bảng + bucket + RLS, chạy một lần trong Studio
├── migrations/             đổi schema cho DB đang chạy
└── media/<id>/             ảnh seed để `npm run media:push -- --all`
```

Thêm page mới: chỉ `app/.../page.tsx` + keys trong `messages` — compose blocks có sẵn.
Chỉ tạo file mới dưới `components/` khi pattern dùng ≥2 lần.

`[locale]` là dynamic route của next-intl (chuẩn docs) — không phải folder code thừa.
`app/` chỉ chứa route; mọi thứ khác nằm ngoài.

Contact: schema ở `lib/contact.ts` (client + server), gửi mail ở
`lib/contact-action.ts` (`"use server"` — không import file này từ client ngoài
Server Action).

| | |
|---|---|
| `siteConfig.contact` | Thông tin liên hệ **của công ty** |
| `lib/contact` | Form liên hệ **từ người dùng** |

## Nội dung — bài viết & tuyển dụng

Nội dung không nằm trong code. Bài viết (`posts`), tin tuyển dụng (`jobs`) và hồ
sơ ứng tuyển (`applications`) đều ở Supabase; ảnh bài viết ở Supabase Storage.
Sửa nội dung là sửa row trong Supabase Studio — **không cần deploy lại**, vì
`/blog` và `/careers` render động.

Lần đầu: chạy `supabase/schema.sql` trong Studio → SQL Editor (idempotent, chạy
lại vô hại). Nó tạo bảng, hai bucket và policy RLS.

Phần dưới là tài liệu tra cứu cho dev. Người phụ trách nội dung xem
[docs/publishing-posts.md](docs/publishing-posts.md) — quick start đăng bài / tin tuyển dụng.

### Ảnh bài viết

Ảnh nằm ở bucket public `blog-media`, **mỗi bài một thư mục đặt theo `posts.id`**:

```
blog-media/
└── 1/                   ← id của bài
    ├── thumnail.png
    ├── quiz.png
    └── worksheet.png
```

Đẩy ảnh lên (cần `SUPABASE_SECRET_KEY` trong `.env`):

```bash
npm run media:push -- --post "Nova Learn" ./cover.png     # tự tra id từ tiêu đề
npm run media:push -- 1 ./cover.png ./quiz.png            # biết id rồi
npm run media:push -- --all                               # toàn bộ supabase/media/
```

`supabase/media/<id>/` trong repo là bản seed để chạy `--all`. Sau đó upload
thẳng trong Studio → Storage → `blog-media` cũng được — chỉ cần đúng thư mục id.

**Trong `body_vi` / `body_en` chỉ viết tên file.** Server tự đổi thành URL
storage lúc đọc bài (`lib/posts.ts`), nên đổi project Supabase không phải sửa
lại nội dung:

| Viết trong body | Kết quả |
|---|---|
| `quiz.png` — đứng riêng một dòng | ảnh từ `blog-media/{id}/quiz.png` |
| `![Chú thích](quiz.png)` | như trên, kèm alt |
| `https://…` — đứng riêng một dòng | giữ nguyên URL ngoài |
| `/assets/logo.png` | file tĩnh trong `public/` |
| `/blog/{slug}/quiz.png` | row cũ — lấy tên file, ghép vào `blog-media/{id}/` |

Ảnh Supabase đi qua `next/image` (tối ưu, lazy-load). Ảnh từ host khác muốn được
tối ưu thì phải thêm hostname vào `images.remotePatterns` trong `next.config.ts`;
không thêm thì vẫn hiện, nhưng bằng thẻ `<img>` thường.

Chạy Supabase local (`supabase start`, storage ở `127.0.0.1`): đặt
`IMAGE_ALLOW_LOCAL_IP=1` — mặc định Next chặn IP nội bộ để phòng SSRF.

### Đăng bài viết — bảng `posts`

| Cột | Bắt buộc | Giá trị |
|---|---|---|
| `id` | | khoá chính, DB tự cấp. URL là `/blog/<id>`, ảnh ở `blog-media/<id>/` |
| `title_vi` `title_en` | ✓ | tiêu đề hai ngôn ngữ |
| `body_vi` `body_en` | ✓ | Markdown (GFM: bảng, danh sách, code) |
| `excerpt_vi` `excerpt_en` | | tóm tắt ở trang danh sách và thẻ meta |
| `domain` | | nhóm giải pháp — `vision` · `education` · `conversational` · `generative` · `document` · `predictive`. Dùng cho bộ lọc ở `/blog`; nhãn lấy thẳng từ `features.items.*.title` nên không thể lệch với mục Solutions. Để trống được |
| `cover` | | tên file ảnh (theo bảng trên). Bỏ trống thì lấy ảnh đầu tiên trong body |
| `date` | | ngày hiển thị và thứ tự sắp xếp, mặc định hôm nay |
| `published` | | `false` để ẩn — RLS chặn ngay ở tầng DB |

Hai ngôn ngữ đều `not null`. Chưa dịch xong thì tạm điền cùng nội dung, đừng để
rỗng — trang tiếng còn lại sẽ trắng.

Quy trình một bài:

1. Insert row vào `posts` (không có cột slug), để `published = false`.
2. Đẩy ảnh: `npm run media:push -- --post "<một phần tiêu đề>" ./anh/*.png`
   — script tự tra `id` từ tiêu đề. Biết id rồi thì `media:push -- <id> ./anh/*.png`.
3. Đặt `published = true`. Bài hiện ngay ở `/blog` và `/en/blog`.

Body mẫu:

```markdown
## Bối cảnh

Giáo viên chấm tay 400 bài mỗi tuần.

quiz.png

![Phiếu bài tập](worksheet.png)

## Kết quả

Thời gian chấm giảm 80%.
```

### Đăng tuyển dụng — bảng `jobs`

| Cột | Bắt buộc | Giá trị |
|---|---|---|
| `id` | | khoá chính, DB tự cấp. Lưu kèm mỗi hồ sơ ứng tuyển (`applications.job_id`) |
| `title` | ✓ | tên vị trí, một ngôn ngữ (giữ nguyên ở cả vi/en) |
| `type` | ✓ | `fulltime` · `intern` · `contract` |
| `department` | ✓ | `engineering` · `ai` · `product` · `design` · `operations` |
| `locations` | ✓ | mảng: `{hanoi}` · `{hanoi,remote}` · `{hcm}` — giá trị hợp lệ `hanoi` `hcm` `remote` |
| `level` | ✓ | `intern` · `fresher` · `junior` · `middle` · `senior` |
| `slots` | ✓ | số lượng tuyển, phải > 0 |
| `jd_vi` `jd_en` | ✓ | mô tả công việc, Markdown |
| `published` | | `false` để ẩn |

`type`, `department`, `level` có `check` constraint trong DB — sai giá trị thì
insert lỗi ngay, không âm thầm hỏng UI. Ba cột này cũng là bộ lọc ở `/careers`,
nhãn hiển thị lấy từ `messages/*.json` (namespace `careers`).

**Ứng tuyển:** form gửi CV lên bucket **private** `career-cvs`, ghi row vào
`applications`, rồi mail kèm file về `CONTACT_NOTIFY_EMAIL`. Bucket và bảng này
không có policy nào cho anon — chỉ server đọc được bằng `SUPABASE_SECRET_KEY`.

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
- [ ] Set `SMTP_USER` / `SMTP_PASS` (Gmail App Password) và `CONTACT_NOTIFY_EMAIL`.
      Thiếu thì form vẫn chạy nhưng chỉ ghi log, không gửi mail.
- [ ] Set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` và
      chạy `supabase/schema.sql`. Thiếu thì `/blog` và `/careers` rỗng.
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
# Anz-page
