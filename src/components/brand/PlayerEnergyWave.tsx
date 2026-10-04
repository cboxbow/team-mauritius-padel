import { CampaignBackground } from "./CampaignBackground";

export type PlayerEnergyWaveVariant = "profile" | "card" | "quote" | "content";

export type PlayerEnergyWaveProps = {
  variant?: PlayerEnergyWaveVariant;
  className?: string;
};

// Shared player-campaign layer built from the approved Island Padel Cup artwork.
// CSS crops and masks the same cached source differently for profiles, cards and stories.
export function PlayerEnergyWave({ variant = "profile", className = "" }: PlayerEnergyWaveProps) {
  const campaignVariant = variant === "profile" ? "player" : variant === "card" ? "card" : variant === "content" ? "subtle" : "editorial";
  return <CampaignBackground variant={campaignVariant} className={`player-energy-wave is-${variant}${className ? ` ${className}` : ""}`} />;
}
