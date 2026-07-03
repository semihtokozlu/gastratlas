import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(["tr", "en"]),
});
