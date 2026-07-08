"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy to Clipboard 📋" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="wj-btn wj-btn-ocean"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // fallback for older browsers
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copied! ✅" : label}
    </button>
  );
}
