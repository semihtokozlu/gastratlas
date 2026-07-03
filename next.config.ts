import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Statik sayfa üretimi (SSG) çok sayıda tarif/ülke/dönem sayfasında
  // paralel Prisma sorgusu açıyor; Supabase pooler'ının küçük bağlantı
  // havuzu bu paralellikle "connection pool timeout" veriyor (bkz. Vercel
  // build hatası). Build'i tek işçiye serileştirmek bunu ortadan kaldırır.
  experimental: { cpus: 1 },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage — proje ref'inizi .env üzerinden domain'e yansıtın
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
