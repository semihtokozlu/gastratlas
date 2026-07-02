import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // api, _next, statik dosyalar hariç her şey locale middleware'inden geçer
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
