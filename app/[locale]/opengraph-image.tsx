import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { profile } from "@/data/profile";
import { localize } from "@/data/types";
import { routing } from "@/i18n/routing";

export const alt = `${profile.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same palette as the dark theme in globals.css (ImageResponse cannot read CSS variables).
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "radial-gradient(circle at 70% 30%, #5c2a47 0%, #181216 60%)",
          color: "#f7eff3",
        }}
      >
        <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1.05 }}>{profile.name}</div>
        <div style={{ width: 72, height: 6, borderRadius: 3, background: "#e59cc2", marginTop: 32 }} />
        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 32 }}>
          {localize(profile.role, locale)}
        </div>
      </div>
    ),
    size,
  );
}
