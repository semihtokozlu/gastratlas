import createMiddleware from "next-intl/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * next-intl locale routing + Supabase SSR oturum yenilemesini aynı
 * middleware'de birleştirir. Supabase auth cookie'leri her istekte
 * yenilenmezse süresi dolan access token'lar sessizce geçersiz kalır.
 */
export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list: { name: string; value: string; options?: CookieOptions }[]) => {
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  // api, _next, statik dosyalar hariç her şey locale middleware'inden geçer
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
