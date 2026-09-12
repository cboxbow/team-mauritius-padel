// The official four-colour Mauritius flag mark (red / blue / gold / green), generalised
// from the existing `.flag-line` pattern into a reusable, configurable accent.

export type MauritiusAccentProps = {
  size?: number;
  orientation?: "horizontal" | "vertical";
  gap?: number;
  className?: string;
};

const FLAG_COLORS = ["var(--red)", "var(--blue)", "var(--gold)", "var(--green)"];

export function MauritiusAccent({ size = 20, orientation = "horizontal", gap = 3, className }: MauritiusAccentProps) {
  return (
    <span className={`brand-mauritius-accent ${orientation}${className ? ` ${className}` : ""}`} style={{ gap }} aria-hidden="true">
      {FLAG_COLORS.map(color => (
        <i key={color} style={{ background: color, width: orientation === "horizontal" ? size : 3, height: orientation === "horizontal" ? 3 : size }} />
      ))}
    </span>
  );
}
