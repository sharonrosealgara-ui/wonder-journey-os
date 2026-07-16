// ✨ KEY-TERM HIGHLIGHTER — young readers' eyes land on what matters.
// Automatically bolds and colors:
//   • terms inside quotes:  "po", "opo", 'mano po', “bayanihan”
//   • numbers and figures:  7,641 islands · 3 stars · 2026
// The accent class comes from the lesson's theme, so Geography glows
// sunset-orange while Language glows sky-blue, etc.

import type { ReactNode } from "react";

// quoted terms (straight or curly quotes) OR number groups
const KEY_TERM =
  /("[^"\n]{1,40}"|'[^'\n]{1,40}'|“[^”\n]{1,40}”|‘[^’\n]{1,40}’|\d[\d,.]*\+?)/g;

const QUOTES = /^["'“”‘’]|["'“”‘’]$/g;

export function Highlight({ text, accent = "text-sunset-deep" }: { text: string; accent?: string }): ReactNode {
  const parts = text.split(KEY_TERM);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // a matched key term — strip the quotes, keep the sparkle
      const clean = part.replace(QUOTES, "");
      return (
        <strong key={i} className={`font-bold ${accent}`}>
          {clean}
        </strong>
      );
    }
    return part;
  });
}
