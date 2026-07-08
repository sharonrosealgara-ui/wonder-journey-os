import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/brand";
import { lessons } from "@/config/lessons";
import { recipes } from "@/config/recipes";

const staticRoutes = [
  "",
  "/today",
  "/blessings",
  "/journal",
  "/prayer",
  "/lessons",
  "/languages",
  "/passport",
  "/backpack",
  "/cooking",
  "/cookbook",
  "/awards",
  "/celebrations",
  "/resources",
  "/parent",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...lessons.map((l) => ({
      url: `${siteUrl}/lessons/${l.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...recipes.map((r) => ({
      url: `${siteUrl}/cooking/${r.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
