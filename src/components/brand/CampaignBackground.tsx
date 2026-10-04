import type { CSSProperties } from "react";

export type CampaignBackgroundVariant = "hero" | "player" | "playerStory" | "team" | "editorial" | "subtle" | "card" | "live";

export type CampaignBackgroundProps = {
  variant?: CampaignBackgroundVariant;
  intensity?: number;
  className?: string;
};

type CampaignStyle = CSSProperties & { "--campaign-intensity": number };

// Global campaign artwork layer. Every variant uses the same approved raster master;
// only crop, scale, mask and intensity change between page contexts.
export function CampaignBackground({ variant = "hero", intensity = 1, className = "" }: CampaignBackgroundProps) {
  return (
    <div
      className={`campaign-background dot-wave is-${variant}${className ? ` ${className}` : ""}`}
      style={{ "--campaign-intensity": intensity } as CampaignStyle}
      aria-hidden="true"
    />
  );
}
