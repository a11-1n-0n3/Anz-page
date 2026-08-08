import type { Locale } from "@/i18n/routing";

export const siteConfig = {
  name: "ANZ",
  lockupSub: "TECHNOLOGY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anz.vn",
  // Shared across locales — opengraph-image.tsx renders one asset
  ogTagline: "Applied AI · Computer Vision · Education AI · Generative AI",
  contact: {
    email: "hello@anz.vn",
    phone: "+84 000 000 000",
  },
  social: {
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/company/",
    github: "https://github.com/",
  },
} as const;

export type NavItem = {
  labelKey: string;
  href: string;
  external?: boolean;
};

export const mainNav: NavItem[] = [
  { labelKey: "features", href: "/#features" },
  { labelKey: "howItWorks", href: "/#how-it-works" },
  { labelKey: "contact", href: "/#contact" },
  { labelKey: "team", href: "/team" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "careers", href: "/careers" },
];

// Temporary logos for layout only — do NOT ship as “Trusted by” unless
// you have a real relationship and permission to display these brands.
export type Partner = { id: string; name: string; logo?: string };

export const partners: Partner[] = [
  { id: "p1", name: "Claude", logo: "/assets/partners/anthropic.svg" },
  { id: "p2", name: "Cursor", logo: "/assets/partners/cursor.svg" },
  { id: "p3", name: "Codex", logo: "/assets/partners/openai.svg" },
  { id: "p4", name: "DeepSeek", logo: "/assets/partners/deepseek.svg" },
  { id: "p5", name: "Gemini", logo: "/assets/partners/google.svg" },
];

export type Localized = Record<Locale, string>;

export type TeamMember = {
  id: string;
  name: string;
  photo?: string;
  role: Localized;
  bio: Localized;
};

// PLACEHOLDERS — replace with real staff who consented, or empty the array
export const team: TeamMember[] = [
  {
    id: "m1",
    name: "Mr. Bùi Chí Minh",
    role: {
      vi: "Tech Lead",
      en: "Tech Lead",
    },
    bio: {
      vi: "Hơn 7 năm dẫn dắt kỹ thuật các hệ thống AI production — LLM, RAG và tối ưu inference cho sản phẩm doanh nghiệp.",
      en: "7+ years leading production AI systems — LLMs, RAG, and inference optimization for enterprise products.",
    },
  },
  {
    id: "m2",
    name: "Mr. Bùi Quốc Tuấn",
    role: {
      vi: "CEO",
      en: "CEO",
    },
    bio: {
      vi: "Hơn 10 năm chuyên sâu bảo mật ứng dụng và hạ tầng — đánh giá rủi ro, hardening và tuân thủ cho sản phẩm số quy mô lớn.",
      en: "10+ years in application and infrastructure security — risk assessment, hardening, and compliance for large-scale digital products.",
    },
  },
  {
    id: "m3",
    name: "Mr. Văn Sang",
    role: {
      vi: "Senior AI Engineer",
      en: "Senior AI Engineer",
    },
    bio: {
      vi: "Hơn 5 năm xây dựng và vận hành mô hình AI trên production — fine-tuning, đánh giá chất lượng và tích hợp hệ thống thực tế.",
      en: "5+ years building and running production AI models — fine-tuning, quality evaluation, and real-world system integration.",
    },
  },
];

// PLACEHOLDERS — each section below hides itself when its array is emptied.
// Everything here is a CLAIM about the company. The values are deliberately
// unmistakable (XX, PLACEHOLDER) so nothing reads as real if this ships early —
// replace with verified figures, quotes you have permission to publish, and
// real posts, or empty the array.

export type Stat = { id: string; value: string; label: Localized };

export const stats: Stat[] = [
  // ⚠ REPLACE THE TWO VALUES. Labels are final; the numbers are yours.
  {
    id: "years",
    value: "01+",
    label: { vi: "năm hoạt động", en: "years in business" },
  },
  {
    id: "projects",
    value: "10+",
    label: { vi: "dự án đã làm", en: "projects delivered" },
  },
];

export type Industry = {
  id: string;
  name: Localized;
  /** Path under /public, or remote URL allowed in next.config. */
  image: string;
};

// Temporary stock images — replace with owned assets before launch.
export const industries: Industry[] = [
  {
    id: "finance",
    name: { vi: "Tài chính & ngân hàng", en: "Financial services" },
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "healthcare",
    name: { vi: "Y tế & khoa học sự sống", en: "Healthcare & life sciences" },
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hightech",
    name: { vi: "Công nghệ cao", en: "High-tech" },
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "logistics",
    name: { vi: "Logistics & chuỗi cung ứng", en: "Logistics & supply chain" },
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "manufacturing",
    name: { vi: "Sản xuất", en: "Manufacturing" },
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "education",
    name: { vi: "Giáo dục", en: "Education" },
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  },
];

export type PostCategory =
  | "vision"
  | "documents"
  | "mlops"
  | "delivery";

export const postCategories: PostCategory[] = [
  "vision",
  "documents",
  "mlops",
  "delivery",
];

export type Post = {
  id: string;
  slug: string;
  category: PostCategory;
  title: Localized;
  tag: Localized;
  // ISO date. Rendered with the active locale.
  date: string;
  cover?: string;
  excerpt: Localized;
  /** Plain paragraphs separated by blank lines. */
  body: Localized;
};

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export const posts: Post[] = [
  // Temporary hardcodes until a real blog / CMS is wired.
  {
    id: "b1",
    slug: "edge-vs-cloud-camera-ai",
    category: "vision",
    date: "2025-11-12",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tag: { vi: "Thị giác máy tính", en: "Computer vision" },
    title: {
      vi: "Khi nào camera AI nên chạy trên edge thay vì cloud",
      en: "When camera AI should run on the edge instead of the cloud",
    },
    excerpt: {
      vi: "Latency, băng thông và chi phí vận hành quyết định chỗ model nên sống — không phải slogan “AI everywhere”.",
      en: "Latency, bandwidth, and ops cost decide where the model should live — not an “AI everywhere” slogan.",
    },
    body: {
      vi: "Trên dây chuyền, quyết định phải ra trong vài chục millisecond. Đẩy frame lên cloud rồi chờ response thường chậm hơn cửa sổ đó, và còn phụ thuộc mạng nhà máy vốn không ổn định.\n\nEdge hợp khi bạn cần phản hồi tức thì, giảm băng thông video, hoặc dữ liệu không được rời mặt bằng. Cloud hợp khi bạn huấn luyện lại model, gom dữ liệu nhiều site, hoặc inference không gắn cứng với máy.\n\nCách làm thực tế: chạy inference nhẹ tại edge, gửi sự kiện và mẫu khó về cloud để cải thiện model, rồi đẩy bản cập nhật xuống lại. Đó là vòng lặp vận hành — không phải chọn một phía mãi mãi.",
      en: "On a line, the decision often has to land in tens of milliseconds. Shipping frames to the cloud and waiting usually misses that window, and it depends on a plant network that is rarely rock-solid.\n\nEdge wins when you need instant response, want to cut video bandwidth, or cannot let footage leave the floor. Cloud wins for retraining, multi-site learning, and inference that is not tied to a machine cycle.\n\nIn practice: run lean inference on the edge, ship events and hard cases to the cloud, improve the model, push updates back down. That is an ops loop — not a forever either/or.",
    },
  },
  {
    id: "b2",
    slug: "ocr-into-erp-review-queue",
    category: "documents",
    date: "2025-09-03",
    cover:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    tag: { vi: "Trí tuệ tài liệu", en: "Document intelligence" },
    title: {
      vi: "Đưa OCR vào ERP mà không làm hỏng quy trình kiểm duyệt",
      en: "Wiring OCR into your ERP without breaking the review queue",
    },
    excerpt: {
      vi: "OCR chỉ hữu ích khi kết quả vào đúng chỗ trong quy trình duyệt — không phải dump text thô vào ERP.",
      en: "OCR only helps when outputs land in the right place in the review flow — not as a raw text dump into the ERP.",
    },
    body: {
      vi: "Nhiều dự án OCR dừng ở “đọc được chữ”. Trên thực tế, đội vận hành cần trường đã chuẩn hóa, độ tin cậy theo từng ô, và lối thoát khi model sai.\n\nHãy map output vào đúng bước duyệt hiện có: field high-confidence vào thẳng, field thấp thì mở hàng chờ với ảnh gốc cạnh đề xuất. Người duyệt sửa một lần — hệ thống học từ sửa đó nếu bạn thiết kế feedback.\n\nĐừng thay ERP. Bọc quanh nó: API lấy chứng từ, trả payload sạch, ghi audit. Khi review queue vẫn chạy như cũ nhưng nhanh hơn, OCR mới được coi là xong.",
      en: "Too many OCR projects stop at “we can read the text.” Ops needs normalized fields, per-field confidence, and an escape hatch when the model is wrong.\n\nMap outputs into the review step you already have: high-confidence fields flow through, low-confidence ones open a queue with the source image next to the suggestion. Reviewers fix once — and the system can learn if you wire that feedback.\n\nDon’t replace the ERP. Wrap it: pull documents, return clean payloads, write an audit trail. When the review queue still feels familiar but faster, the OCR job is actually done.",
    },
  },
  {
    id: "b3",
    slug: "model-monitoring-after-go-live",
    category: "mlops",
    date: "2025-07-18",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tag: { vi: "MLOps", en: "MLOps" },
    title: {
      vi: "Theo dõi model sau go-live: tín hiệu nào thực sự đáng mở ticket",
      en: "Model monitoring after go-live: which signals actually deserve a ticket",
    },
    excerpt: {
      vi: "Accuracy trên notebook không giữ hệ thống sống. Cần ngưỡng gắn với thiệt hại vận hành.",
      en: "Notebook accuracy doesn’t keep a system alive. Thresholds have to map to operational damage.",
    },
    body: {
      vi: "Sau bàn giao, drift và data quality thường tới trước khi accuracy tụt rõ. Hãy theo latency p95, tỷ lệ low-confidence, và số case bị đẩy sang hàng chờ người.\n\nMỗi tín hiệu cần chủ sở hữu và hành động: rollback model, đóng feature, hoặc tăng sampling review. Dashboard không có owner chỉ là screensaver.\n\nBắt đầu hẹp: ba chỉ số, một on-call, một runbook. Mở rộng khi đã chứng minh tín hiệu đó đổi được quyết định.",
      en: "After handover, drift and data quality usually arrive before accuracy falls off a cliff. Watch p95 latency, low-confidence rate, and how many cases spill into human review.\n\nEvery signal needs an owner and an action: roll back the model, shut a feature, or raise review sampling. A dashboard with no owner is a screensaver.\n\nStart narrow: three metrics, one on-call, one runbook. Expand only when a signal has already changed a decision.",
    },
  },
  {
    id: "b4",
    slug: "scoping-the-first-ai-pilot",
    category: "delivery",
    date: "2025-05-22",
    cover:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    tag: { vi: "Triển khai", en: "Delivery" },
    title: {
      vi: "Chọn pilot AI đầu tiên sao cho 90 ngày sau vẫn còn chạy",
      en: "Pick the first AI pilot so it’s still running 90 days later",
    },
    excerpt: {
      vi: "Pilot chết vì phạm vi rộng và KPI mơ hồ. Thu hẹp đến một số đo được trên quy trình có sẵn.",
      en: "Pilots die from wide scope and fuzzy KPIs. Narrow to one measurable number on a process you already run.",
    },
    body: {
      vi: "Một pilot tốt có chủ quy trình, nguồn dữ liệu ổn định, và tiêu chí dừng rõ. Nếu không đo được baseline tuần này, đừng hứa cải thiện tháng sau.\n\nTránh “nền tảng AI chung” làm mục tiêu đầu. Làm một use case xuyên suốt: ingest → model → UI/API → giám sát.\n\nNgày 90 nên trả lời được: số nào đổi, ai dùng hàng ngày, và chi phí vận hành là bao nhiêu. Đó mới là gate cho phase hai.",
      en: "A good pilot has a process owner, a stable data source, and a kill criterion. If you can’t measure a baseline this week, don’t promise improvement next month.\n\nAvoid “shared AI platform” as the first goal. Ship one use case end to end: ingest → model → UI/API → monitoring.\n\nDay 90 should answer: which number moved, who uses it daily, and what it costs to run. That’s the gate for phase two.",
    },
  },
  {
    id: "b5",
    slug: "labeling-bottleneck-on-plant-floor",
    category: "vision",
    date: "2025-03-09",
    cover:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
    tag: { vi: "Thị giác máy tính", en: "Computer vision" },
    title: {
      vi: "Nút thắt gán nhãn trên nhà máy — và cách không làm chậm chuyền",
      en: "The labeling bottleneck on the plant floor — without slowing the line",
    },
    excerpt: {
      vi: "Đội vận hành không phải labeler. Thiết kế vòng gán nhãn quanh ca làm việc, không thay thế nó.",
      en: "Ops teams aren’t labelers. Design the annotation loop around the shift, not instead of it.",
    },
    body: {
      vi: "Thu thập nhãn trên chuyền phải tôn trọng nhịp máy. Dùng active learning: chỉ đưa case khó lên màn hình review giữa ca hoặc cuối ca.\n\nChuẩn hóa taxonomy trước khi mở tool. Hai kỹ sư gọi cùng một lỗi bằng hai tên sẽ phá model nhanh hơn thiếu dữ liệu.\n\nĐo thời gian phút/nhãn và tỷ lệ đồng thuận. Nếu review dài hơn lợi ích của model, hãy giảm lớp lỗi trước khi thêm camera.",
      en: "Collecting labels on a line has to respect machine cadence. Use active learning: only surface hard cases on a review screen mid-shift or end-of-shift.\n\nNormalize the taxonomy before you open a tool. Two engineers naming the same defect two ways will break a model faster than missing data.\n\nTrack minutes per label and agreement rate. If review costs more than the model saves, cut defect classes before you add another camera.",
    },
  },
  {
    id: "b6",
    slug: "human-in-the-loop-without-queue-chaos",
    category: "documents",
    date: "2025-01-14",
    cover:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    tag: { vi: "Trí tuệ tài liệu", en: "Document intelligence" },
    title: {
      vi: "Human-in-the-loop mà không biến hàng chờ thành hỗn loạn",
      en: "Human-in-the-loop without turning the queue into chaos",
    },
    excerpt: {
      vi: "HITL thất bại khi mọi thứ đều “cần người”. Phân tầng confidence và SLA theo loại chứng từ.",
      en: "HITL fails when everything “needs a human.” Tier confidence and SLAs by document type.",
    },
    body: {
      vi: "Chỉ đẩy field dưới ngưỡng vào queue. Gom theo chứng từ, không theo từng ô — người duyệt cần ngữ cảnh trang.\n\nƯu tiên theo tuổi chứng từ và giá trị giao dịch. Queue FIFO thuần thường làm kẹt việc quan trọng phía sau.\n\nĐóng vòng: mỗi sửa của reviewer phải ghi lại và định kỳ đưa vào tập huấn luyện. Không có feedback loop thì HITL chỉ là outsource kiểm tra tay.",
      en: "Only send sub-threshold fields into the queue. Bundle by document, not by cell — reviewers need page context.\n\nPrioritize by document age and transaction value. Pure FIFO often parks the important work behind noise.\n\nClose the loop: every reviewer fix should be logged and periodically folded into training. Without that, HITL is just outsourced manual checking.",
    },
  },
];

export type JobType = "fulltime" | "intern" | "contract";
export type JobDepartment =
  | "engineering"
  | "ai"
  | "product"
  | "design"
  | "operations";
export type JobLocation = "hanoi" | "hcm" | "remote";

export type Job = {
  id: string;
  title: Localized;
  type: JobType;
  department: JobDepartment;
  location: JobLocation;
};

// Temporary openings for layout — replace with real roles before launch.
export const jobs: Job[] = [
  {
    id: "j1",
    type: "fulltime",
    department: "ai",
    location: "hanoi",
    title: {
      vi: "Machine Learning Engineer (Computer Vision)",
      en: "Machine Learning Engineer (Computer Vision)",
    },
  },
  {
    id: "j2",
    type: "fulltime",
    department: "engineering",
    location: "hanoi",
    title: {
      vi: "Backend Engineer (Python / FastAPI)",
      en: "Backend Engineer (Python / FastAPI)",
    },
  },
  {
    id: "j3",
    type: "fulltime",
    department: "engineering",
    location: "hcm",
    title: {
      vi: "Frontend Engineer (React / Next.js)",
      en: "Frontend Engineer (React / Next.js)",
    },
  },
  {
    id: "j4",
    type: "fulltime",
    department: "ai",
    location: "remote",
    title: {
      vi: "Applied NLP Engineer",
      en: "Applied NLP Engineer",
    },
  },
  {
    id: "j5",
    type: "intern",
    department: "ai",
    location: "hanoi",
    title: {
      vi: "AI Engineering Intern",
      en: "AI Engineering Intern",
    },
  },
  {
    id: "j6",
    type: "fulltime",
    department: "product",
    location: "hcm",
    title: {
      vi: "Product Manager — Applied AI",
      en: "Product Manager — Applied AI",
    },
  },
  {
    id: "j7",
    type: "contract",
    department: "design",
    location: "remote",
    title: {
      vi: "Product Designer (Contract)",
      en: "Product Designer (Contract)",
    },
  },
  {
    id: "j8",
    type: "fulltime",
    department: "operations",
    location: "hanoi",
    title: {
      vi: "Delivery Lead — AI Projects",
      en: "Delivery Lead — AI Projects",
    },
  },
];

export const footerNav: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "productGroup",
    items: [
      { labelKey: "features", href: "/#features" },
      { labelKey: "howItWorks", href: "/#how-it-works" },
      { labelKey: "contact", href: "/#contact" },
    ],
  },
  {
    titleKey: "companyGroup",
    items: [
      { labelKey: "team", href: "/team" },
      { labelKey: "blog", href: "/blog" },
      { labelKey: "careers", href: "/careers" },
    ],
  },
];
