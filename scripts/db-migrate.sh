#!/usr/bin/env bash
# Chạy migration + schema lên Supabase, rồi đổi thư mục ảnh sang id.
#
#   ./scripts/db-migrate.sh              chạy thật
#   ./scripts/db-migrate.sh --dry-run    chỉ xem trước bước ảnh
#
# Cần SUPABASE_DB_URL trong .env (Dashboard → Connect → Session pooler).
set -euo pipefail
cd "$(dirname "$0")/.."

set -a; . ./.env; set +a
: "${SUPABASE_DB_URL:?thiếu SUPABASE_DB_URL trong .env}"

PSQL=(docker run --rm -i -e PGCONNECT_TIMEOUT=15 postgres:17-alpine
      psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -q)

echo "→ 1/3  migration slug → id"
"${PSQL[@]}" -f - < supabase/migrations/2026-08-21-slug-to-id.sql

echo "→ 2/3  schema.sql (bỏ trigger cũ, đồng bộ bucket + RLS)"
"${PSQL[@]}" -f - < supabase/schema.sql

echo "→ 3/3  chuyển thư mục ảnh sang id"
node scripts/media-move-to-ids.mjs "$@"

echo
echo "Kết quả:"
"${PSQL[@]}" -c "select id, legacy_slug, coalesce(domain,'(trống)') as domain from posts order by id;"
"${PSQL[@]}" -c "select id, title, level from jobs order by id;"
"${PSQL[@]}" -c "select count(*) as ho_so, count(job_id) as co_lien_ket from applications;"
