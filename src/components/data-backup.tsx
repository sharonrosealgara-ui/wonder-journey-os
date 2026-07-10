"use client";

import { useRef, useState } from "react";
import { exportAllData, importAllData } from "@/lib/storage";

// Family data backup card (DATABASE.md Backup Strategy). Until the cloud
// backend exists, this lets the family keep a copy of everything —
// journals, blessings, cookbook photos, badges, memories — and restore
// it on any device or after clearing the browser.
export function DataBackup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  function download() {
    const blob = new Blob([exportAllData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wonder-journey-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("✅ Backup saved to your downloads!");
  }

  function restore(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = importAllData(String(reader.result));
      setStatus(
        result.ok
          ? `✅ Restored ${result.keys} saved items — welcome back!`
          : `⚠️ ${result.error ?? "Could not restore that file."}`
      );
    };
    reader.onerror = () => setStatus("⚠️ Couldn't read that file.");
    reader.readAsText(file);
  }

  return (
    <section className="wj-card p-6">
      <h2 className="font-display text-xl">💾 Family Data Backup</h2>
      <p className="font-hand mt-1 text-lg text-ink-soft">
        Everything lives safely on this device. Save a backup you can keep — or restore one on
        a new device.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="wj-btn wj-btn-ocean" onClick={download}>
          Save Backup 💾
        </button>
        <button className="wj-btn wj-btn-ghost" onClick={() => inputRef.current?.click()}>
          Restore Backup 📂
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) restore(f);
            e.target.value = "";
          }}
        />
      </div>
      {status && <p className="font-hand mt-3 text-base text-ink-soft">{status}</p>}
    </section>
  );
}
