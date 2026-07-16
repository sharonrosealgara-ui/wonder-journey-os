// Generates the PWA app icons from public/icon.svg using sharp.
// Run: node scripts/make-icons.mjs
import sharp from "sharp";
import { mkdirSync, readFileSync } from "fs";

const svg = readFileSync("public/icon.svg", "utf8");

// Full-bleed variant (no rounded corners): iOS and Android maskable
// shape the icon themselves — baked-in transparent corners turn black.
const fullBleed = svg.replace(' rx="112"', "");

// Maskable variant: art shrunk into the ~80% safe zone so adaptive
// icon shapes (circle, squircle) never clip the petals.
const maskable = fullBleed.replace(
  'transform="translate(256 256)"',
  'transform="translate(256 256) scale(0.72)"'
);

mkdirSync("public/icons", { recursive: true });

const jobs = [
  { src: svg, size: 192, out: "public/icons/icon-192.png" },
  { src: svg, size: 512, out: "public/icons/icon-512.png" },
  { src: maskable, size: 512, out: "public/icons/icon-maskable-512.png" },
  { src: fullBleed, size: 180, out: "public/apple-touch-icon.png" },
];

for (const { src, size, out } of jobs) {
  await sharp(Buffer.from(src), { density: 300 }).resize(size, size).png().toFile(out);
  console.log("✓", out, `${size}x${size}`);
}
console.log("Done — app icons ready.");
