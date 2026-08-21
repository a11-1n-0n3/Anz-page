-- Đổi phân loại bài viết từ ngành nghề sang nhóm giải pháp (mục Solutions ở trang chủ).
-- Chạy một lần trong Studio → SQL Editor. Chạy lại vô hại.
-- DB trống thì không cần file này — schema.sql đã có định nghĩa mới.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posts' and column_name = 'industry'
  ) then
    alter table public.posts rename column industry to domain;
  end if;
end $$;

-- Bỏ ràng buộc cũ trước, nếu không thì không remap được giá trị.
alter table public.posts drop constraint if exists posts_industry_check;
alter table public.posts drop constraint if exists posts_domain_check;

-- Giá trị mới thì giữ nguyên, nên chạy lại không làm mất dữ liệu.
update public.posts set domain = case domain
  when 'computer-vision' then 'vision'
  when 'education'       then 'education'
  when 'manufacturing'   then null
  when 'finance'         then null
  when 'retail'          then null
  when 'real-estate'     then null
  else domain
end;

alter table public.posts add constraint posts_domain_check
  check (domain in ('vision', 'education', 'conversational', 'generative', 'document', 'predictive'));
