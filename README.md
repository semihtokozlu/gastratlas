# GastrAtlas

**The World's Living Culinary Atlas — Explore History Through Flavor**

Faz 0 iskeleti: Next.js 15 (App Router) · TypeScript · Tailwind · Prisma · Supabase · next-intl (TR/EN).

## Kurulum

```bash
# 1) Bağımlılıklar
npm install

# 2) Supabase projesi oluştur (https://supabase.com) ve .env doldur
cp .env.example .env
#   - DATABASE_URL / DIRECT_URL  → Project Settings > Database
#   - SUPABASE URL / ANON KEY    → Project Settings > API

# 3) Şemayı doğrula ve migration'ı uygula
npm run db:validate
npm run db:migrate    # ilk migration adı önerisi: init

# 4) Başlangıç verisini yükle (idempotent)
npm run db:seed

# 5) Geliştirme sunucusu
npm run dev           # http://localhost:3000 → /tr adresine yönlenir
```

## Doğrulama komutları (CI ile aynı)

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## shadcn/ui (ilk bileşen eklenirken)

```bash
npx shadcn@latest init
# Style: New York · Base color: neutral · CSS variables: yes
```
Tailwind config'imiz CSS variable tabanlı olduğundan shadcn token'ları
`src/styles/tokens.css` paletiyle eşlenecek (Faz 1 başında yapılacak).

## Mimari özet

| Katman | Konum | Kural |
|--------|-------|-------|
| UI | `src/app`, `src/components` | Domain mantığı yok |
| Application | `src/features/*` | Zod validation + use-case |
| Domain | `src/domain/*` | Saf TS, framework'süz, %90+ test |
| Infrastructure | `src/lib/*` | Prisma, Supabase, AI adapter |

Ayrıntılar: **GastrAtlas_Planlama_v1.md** (repo dışı planlama paketi — repoya `docs/` altına kopyalanması önerilir).

## Faz 0 kapsamı

- [x] Tam Prisma şeması (28 tablo, çeviri ayrıştırması, AI izlenebilirliği)
- [x] Tasarım token'ları + Tailwind entegrasyonu (dark theme dahil)
- [x] i18n (TR/EN) route altyapısı
- [x] Supabase SSR auth istemcileri + rol guard'ları
- [x] Domain: porsiyon/alternatif yeniden hesaplama motoru + unit testler
- [x] Idempotent Osmanlı seed iskeleti
- [x] SEO temelleri: sitemap, robots, Recipe JSON-LD builder
- [x] GitHub Actions CI (validate → lint → typecheck → test → build)
- [ ] Vercel projesi bağlama (manuel adım)
- [ ] Supabase RLS politikaları (ilk migration sonrası SQL — Faz 1 başlangıcı)

## Önemli ilkeler

1. **AI asla doğrudan yayınlamaz** — tüm AI çıktıları `AIJob` üzerinden taslak olarak akar, HISTORIAN onayı olmadan `PUBLISHED` olamaz.
2. **Ülke-bağımsız şema** — ikinci mutfak (Faz 3) sıfır şema değişikliğiyle eklenebilmelidir; bu, mimarinin kabul testidir.
3. **Renkler yalnızca CSS Variables** — `tokens.css` dışında hex yazılmaz.
