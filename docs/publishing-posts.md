# Publishing quick start

Nội dung sửa trong **Supabase Studio** — hiện lên web ngay, không cần deploy.

Cần: quyền vào project Supabase. Upload ảnh bằng Studio hoặc `npm run media:push` (cần `.env` có `SUPABASE_URL` + `SUPABASE_SECRET_KEY`).

> **Một điều dễ nhầm nhất:** URL bài dùng **slug**, còn thư mục ảnh dùng **id**.
> `/blog/nova-learn` ↔ `blog-media/3/`. Hai thứ khác nhau, cả hai đều do DB tự lo.

---

## Đăng bài viết (5 phút)

### 1. Tạo row — `published = false`

**Table Editor** → `posts` → Insert row. **Bỏ trống `id` và `slug`** — DB tự cấp cả hai.

| Cột                         | Ghi chú                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `title_vi` / `title_en`     | Bắt buộc                                                                                                           |
| `body_vi` / `body_en`       | Markdown — bắt buộc, chưa dịch thì copy tạm                                                                        |
| `excerpt_vi` / `excerpt_en` | Tóm tắt 1–2 câu                                                                                                    |
| `cover`                     | Tên file ảnh bìa, vd `cover.png` (để trống → lấy ảnh đầu trong body)                                               |
| `domain`                    | Lọc Solutions: `vision` · `education` · `conversational` · `generative` · `document` · `predictive` — để trống được |
| `date`                      | `YYYY-MM-DD` hoặc để trống = hôm nay                                                                               |
| `published`                 | **`false`** lúc tạo                                                                                                |
| `slug`                      | **bỏ trống** — tự sinh từ `title_vi`. Muốn URL ngắn hơn thì điền tay                                                |

Hoặc SQL Editor:

```sql
insert into posts (
  domain, title_vi, title_en, excerpt_vi, excerpt_en,
  cover, body_vi, body_en, published
) values (
  'vision',
  'Tiêu đề VI',
  'English title',
  'Tóm tắt VI.',
  'English excerpt.',
  'cover.png',
  $vi$
## Mục

Nội dung…

cover.png
  $vi$,
  $en$
## Section

Content…

cover.png
  $en$,
  false
)
returning id, slug;
```

`returning id, slug` in ra cả hai — **ghi lại `id`**, bước sau cần.

### 2. Upload ảnh → bucket `blog-media/<id>/`

```bash
npm run media:push -- --post "một phần tiêu đề" ./cover.png ./so-do.png
```

Script tự tra `id` từ tiêu đề. Hoặc Storage → `blog-media` → New folder =
**đúng id** (cột `id` trong bảng `posts`, là số) → Upload.

⚠️ Thư mục là **id**, không phải slug và không phải tiêu đề.

Trong body chỉ viết **tên file trên một dòng riêng** (trên dưới dòng trống):

```markdown
cover.png
```

Ảnh nào viết trong body thì phải upload đủ — thiếu một file là bài hiện ô vỡ.

### 3. Bật `published = true` → mở `/blog` và `/en/blog`

- [ ] Danh sách + ảnh bìa đúng
- [ ] Trong bài ảnh hiện đủ, không ô vỡ
- [ ] Bản EN ổn
- [ ] Filter `domain` (nếu có) thấy bài

### Slug hoạt động thế nào

| | |
| --- | --- |
| Sinh khi nào | Chỉ lúc insert. Sửa tiêu đề sau đó **không** đổi slug — link đã chia sẻ vẫn sống |
| Sinh ra sao | Bỏ dấu tiếng Việt, `Nova Learn — Chấm bài` → `nova-learn-cham-bai`. Tối đa 80 ký tự, cắt đúng ranh giới từ |
| Trùng nhau | Tự thêm `-2`, `-3` |
| Đổi được không | Được. Ảnh gắn theo `id` nên đổi slug không làm vỡ ảnh — chỉ link cũ mất |
| Gõ `/blog/3` | Tự chuyển 308 sang `/blog/<slug>` — id không đọng lại trên thanh địa chỉ |

---

## Đăng tin tuyển dụng

**Table Editor** → `jobs` (hoặc SQL). **Không có cột slug** — chỉ `id`, DB tự cấp.
Tin tuyển dụng không có ảnh và không có trang riêng, tất cả nằm ở `/careers`.

| Cột               | Giá trị hợp lệ                                                 |
| ----------------- | -------------------------------------------------------------- |
| `title`           | Tên vị trí — dùng chung cho cả VI và EN                        |
| `type`            | Hình thức: `fulltime` · `intern` · `contract`                  |
| `level`           | Cấp bậc: `intern` · `fresher` · `junior` · `middle` · `senior` |
| `department`      | `engineering` · `ai` · `product` · `design` · `operations`     |
| `locations`       | `{hanoi}` · `{hcm}` · `{remote}` · `{hanoi,remote}` …          |
| `slots`           | số > 0                                                         |
| `jd_vi` / `jd_en` | Markdown                                                       |

`type` là hình thức làm việc, `level` là cấp bậc — hai thứ khác nhau. Tin thực
tập thường là `type = 'intern'` **và** `level = 'intern'`.

```sql
insert into jobs (
  title, type, department, locations, level, slots, jd_vi, jd_en, published
) values (
  'AI Engineer',
  'fulltime',
  'ai',
  '{hanoi,remote}',
  'senior',
  2,
  $vi$
## Mô tả
- …
  $vi$,
  $en$
## Role
- …
  $en$,
  true
)
returning id;
```

Kiểm tra `/careers`. Đóng tin: `published = false`. Hồ sơ: bảng `applications`
(cột `job_id`) + email + bucket riêng tư `career-cvs`.

---

## Lỗi nhanh

| Hiện tượng                     | Sửa                                                                     |
| ------------------------------ | ----------------------------------------------------------------------- |
| Bài/tin không hiện             | `published = true`                                                      |
| `/blog` trống trơn, mọi filter | Lỗi truy vấn — xem log server, thường do DB và code lệch schema         |
| Ảnh xám / ô vỡ                 | Thư mục Storage phải là **`id`** (số), tên file khớp `cover` và trong body |
| Tên file hiện thành chữ        | Để tên file **một dòng riêng**, trên dưới có dòng trống                 |
| Lỗi check constraint           | Sai `domain` / `type` / `department` / `level`                          |
| Duplicate key                  | Slug điền tay bị trùng — bỏ trống cho DB tự sinh                        |
| Bài 404 dù có trong bảng       | Sai slug trên URL; mở bảng `posts` xem cột `slug`                       |

Chi tiết kỹ thuật (URL storage, `next/image`, trigger slug): xem [README](../README.md#nội-dung--bài-viết--tuyển-dụng).
