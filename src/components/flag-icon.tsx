"use client";

import { useState } from "react";
import Image from "next/image";

interface FlagIconProps {
  code: string;
  size?: number;
  className?: string;
}

const REGION_CODE_MAP: Record<string, string> = {
  usa: "us",
  us: "us",
  india: "in",
  in: "in",
  russia: "ru",
  ru: "ru",
  germany: "de",
  de: "de",
  france: "fr",
  fr: "fr",
  brazil: "br",
  br: "br",
  japan: "jp",
  jp: "jp",
  southkorea: "kr",
  korea: "kr",
  kr: "kr",
  spain: "es",
  es: "es",
  italy: "it",
  it: "it",
  poland: "pl",
  pl: "pl",
  netherlands: "nl",
  nl: "nl",
  portugal: "pt",
  pt: "pt",
  finland: "fi",
  fi: "fi",
  egypt: "eg",
  eg: "eg",
  kurdistan: "kurdistan",
  global: "un",
  world: "un",
};

/**
 * Resolves country code / emoji / region name to a valid ISO 2-letter flag code.
 */
function resolveFlagCode(input: string): { isoCode: string; emoji?: string } {
  if (!input) return { isoCode: "un" };
  const str = input.trim();

  if (str === "kurdistan" || str === "☀️") {
    return { isoCode: "kurdistan", emoji: "☀️" };
  }

  // Handle regional indicator symbol emojis like 🇺🇸 -> us, 🇮🇳 -> in
  const codePoints = Array.from(str).map((c) => c.codePointAt(0) ?? 0);
  if (
    codePoints.length === 2 &&
    codePoints[0] >= 0x1f1e6 &&
    codePoints[0] <= 0x1f1ff &&
    codePoints[1] >= 0x1f1e6 &&
    codePoints[1] <= 0x1f1ff
  ) {
    const char1 = String.fromCharCode(codePoints[0] - 0x1f1e6 + 97);
    const char2 = String.fromCharCode(codePoints[1] - 0x1f1e6 + 97);
    return { isoCode: `${char1}${char2}` };
  }

  const lower = str.toLowerCase();
  if (REGION_CODE_MAP[lower]) {
    return { isoCode: REGION_CODE_MAP[lower] };
  }

  if (/^[a-z]{2}$/.test(lower)) {
    return { isoCode: lower };
  }

  return { isoCode: "un" };
}

/**
 * Renders a flag icon using flagcdn.com for ISO country codes.
 * Falls back to emoji / formatted text badge if loading fails.
 */
export function FlagIcon({ code, size = 20, className = "" }: FlagIconProps) {
  const [hasError, setHasError] = useState(false);
  const { isoCode, emoji } = resolveFlagCode(code);

  if (isoCode === "kurdistan" || emoji) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.8 }}
        role="img"
        aria-label="Kurdistan flag"
      >
        {emoji ?? "☀️"}
      </span>
    );
  }

  if (hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-[var(--bg-elev)] font-mono text-[9px] font-bold text-[var(--fg-muted)] border ${className}`}
        style={{ width: size, height: Math.round(size * 0.75), borderColor: "var(--border)" }}
      >
        {isoCode.toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={`https://flagcdn.com/w40/${isoCode}.png`}
      alt={`${code} flag`}
      width={size}
      height={Math.round(size * 0.75)}
      className={`inline-block object-contain ${className}`}
      style={{ width: size, height: "auto" }}
      onError={() => setHasError(true)}
      unoptimized
    />
  );
}
