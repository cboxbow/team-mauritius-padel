import type { ReactNode } from "react";

// The elegant editorial-serif-italic quote treatment — reusable across any coach/player
// feature, not hardcoded to one article.

export type EditorialQuoteProps = {
  children: ReactNode;
  attribution?: ReactNode;
  size?: "md" | "lg";
  className?: string;
};

export function EditorialQuote({ children, attribution, size = "md", className }: EditorialQuoteProps) {
  return (
    <blockquote className={`brand-editorial-quote size-${size}${className ? ` ${className}` : ""}`}>
      <span className="brand-editorial-quote-mark" aria-hidden="true">“</span>
      <span className="brand-editorial-quote-text">{children}</span>
      {attribution && <cite className="brand-editorial-quote-attr">{attribution}</cite>}
    </blockquote>
  );
}
