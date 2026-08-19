# Blog file-based: một nguồn markdown, URL `/blog`

Ngày: 2026-08-19
Trạng thái: chờ duyệt

## Mục tiêu

Gộp “projects” và “blog” thành một loại nội dung. Mỗi bài là một file
`.md` trong `public/blog/`. Thêm bài = thêm file + push `main` (rebuild
Docker). Ảnh đi cùng bài trong cùng cây `public/blog/`.

## Không làm

- Không CMS, không form upload trên UI.
- Không MDX / React trong bài.
- Không hai file `vi.md` + `en.md`. Body giữ nguyên ngôn ngữ file (thường
  tiếng Anh). Chrome UI (nav, nhãn trang) vẫn i18n.
- Không giữ filter ngành trên listing (frontmatter `industry` không có).
- Không giữ block Problem / Solution / Outcome riêng — viết thành heading
  trong markdown nếu cần.
- Không đọc markdown lúc runtime để “thả file vào container đang chạy”.
  Deploy vẫn là git + `docker compose up --build`.

---

## 1. URL và nav

| Cũ | Mới |
|---|---|
| `/projects`, `/projects/[slug]` | `/blog`, `/blog/[slug]` |
| Nav “Dự án” / “Projects” | “Blog” (cả vi và en) |
| Home teaser case study | Teaser vài bài mới nhất → `/blog` |

Redirect 301:

- `/projects` → `/blog`
- `/projects/:slug` → `/blog/:slug`
- (và bản `/en/...`)

Gỡ redirect hiện tại `/blog` → `/projects`.

Sitemap, metadata, home teaser, footer/nav đều trỏ `/blog`.

Stat “projects delivered” trên landing **giữ** — đó là số liệu, không
phải tên section.

---

## 2. Chỗ chứa file

```
public/blog/
  the-crop-to-input-rule.md
  the-crop-to-input-rule/          # optional, ảnh của bài đó
    diagram.png
  nova-learn.md
  nova-learn/
    thumnail.png
    grading.png
    quiz.png
    worksheet.png
```

- Slug = tên file không đuôi `.md`. URL: `/blog/the-crop-to-input-rule`.
- Ảnh trong markdown: path public, ví dụ
  `![Quiz](/blog/nova-learn/quiz.png)`.
- File `.md` cũng mở được raw tại `/blog/<slug>.md` — chấp nhận được vì
  bài công khai.
- Xóa `public/assets/projects/`. Sửa path ảnh Nova Learn.
- File mẫu `the-crop-to-input-rule.md` ở root repo **chuyển vào**
  `public/blog/`, không để hai bản.

`.dockerignore` đang ignore `*.md`. Phải **không ignore** `public/blog/`
(và không ignore markdown trong đó), không thì image build thiếu bài.

---

## 3. Format markdown

Frontmatter YAML **optional**. File mẫu không có thì vẫn load được.

```yaml
---
date: 2026-08-19
featured: true
cover: /blog/nova-learn/thumnail.png
---
```

Parse:

| Field | Nguồn |
|---|---|
| `slug` | tên file |
| `title` | `#` đầu tiên |
| `excerpt` | đoạn bắt đầu bằng `**Meta description:**` (bỏ prefix đó). Không có thì lấy đoạn văn đầu sau title |
| `date` | `date` trong frontmatter, không có thì mtime của file |
| `cover` | frontmatter `cover` |
| `featured` | frontmatter, default false |
| `body` | toàn bộ markdown sau title + meta description |

Render body bằng parser markdown thật (GFM: list, code fence, blockquote,
ảnh, `hr`). Không dùng kiểu split paragraph + `![N]` của `project-detail`.

Bài **featured** (nếu có) pin lên slot nổi trên `/blog`; còn lại sort
`date` mới → cũ.

---

## 4. Luồng build

```
public/blog/*.md
  → fs.readdir lúc build
  → parse (frontmatter + heading + excerpt)
  → generateStaticParams cho /[locale]/blog/[slug]
  → trang index + trang detail HTML tĩnh
```

`output: "standalone"`: đọc file **lúc build**, không cần mang theo thư mục
markdown vào process runtime. `public/` vẫn copy vào image như hiện tại
(ảnh + file md tĩnh).

Thêm bài mới:

1. Viết `public/blog/<slug>.md` (+ thư mục ảnh nếu cần).
2. Commit, push `main`.
3. GitHub Action → `deploy.sh` → rebuild.

---

## 5. Nội dung hiện có trong `site.ts`

Mảng `projects` **bỏ**. Mỗi case study thành một `.md` trong `public/blog/`.

- Body lấy bản **English** (quyết định English-only).
- `cover` / gallery local → path `/blog/<slug>/...` và `![...](...)` trong md.
  Ảnh Unsplash giữ nguyên URL `https://...` (vẫn nằm trong `images.remotePatterns`).
- `date` / `featured` → frontmatter.
- `client`, `problem`, `solution`, `outcome` → đoạn markdown thường, không
  schema riêng.
- Bản tiếng Việt của các case study trong `site.ts` **không** migrate.

Helper `getProject` / type `Project` thay bằng loader blog
(`listPosts`, `getPost`).

---

## 6. UI

- `/blog`: list (featured + lưới bài), reuse visual đang có cho case
  study/list nếu còn; không filter ngành.
- `/blog/[slug]`: title, date, excerpt, body HTML, back → `/blog`.
- Home: 2–3 bài mới nhất, CTA “Tất cả bài viết” → `/blog`.
- Cùng bài cho `/` và `/en/...` (body English).

Dependency: một parser markdown (ví dụ `react-markdown` + `remark-gfm`).
Không thêm CMS hay contentlayer.

---

## 7. Kiểm tra

- Build Docker/`next build` thấy slug từ file trong `public/blog/`.
- `/blog/the-crop-to-input-rule` render heading, list, code, blockquote.
- `/projects` và `/projects/nova-learn` 301 sang `/blog/...`.
- Ảnh Nova Learn load từ `/blog/nova-learn/...`.
- Locale vi vẫn vào được bài English.
