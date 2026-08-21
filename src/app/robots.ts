import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/brand";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isStaging =
    process.env.NEXT_PUBLIC_IS_STAGING === "true" ||
    siteUrl.includes("staging") ||
    siteUrl.includes("preview");

  if (isStaging) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
