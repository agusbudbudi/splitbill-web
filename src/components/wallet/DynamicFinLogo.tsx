"use client";

import React from "react";
import dynamic from "next/dynamic";
import bca from "idn-finlogos/icons/bca";
import mandiri from "idn-finlogos/icons/mandiri";
import bni from "idn-finlogos/icons/bni";
import bri from "idn-finlogos/icons/bri";
import permataBankNew from "idn-finlogos/icons/permata-bank-new";
import btnNew from "idn-finlogos/icons/btn-new";
import bsi from "idn-finlogos/icons/bsi";
import seabank from "idn-finlogos/icons/seabank";
import gopay from "idn-finlogos/icons/gopay";
import ovoNewAlt from "idn-finlogos/icons/ovo-new-alt";
import dana from "idn-finlogos/icons/dana";
import shopeePay from "idn-finlogos/icons/shopee-pay";
import linkaja from "idn-finlogos/icons/linkaja";
import jenius from "idn-finlogos/icons/jenius";
import qris from "idn-finlogos/icons/qris";
import { cn } from "@/lib/utils";

// Per-icon imports for every slug in providerLogos.ts (+ QRIS). The package's
// <Logo> from "idn-finlogos/react" statically bundles all ~2,300 logos
// (~9 MB of JS) into any page that shows a single one, which pushed LCP on
// / and /split-bill past 30s. Add new providers here as well.
const KNOWN_LOGOS: Record<string, string> = {
  bca,
  mandiri,
  bni,
  bri,
  "permata-bank-new": permataBankNew,
  "btn-new": btnNew,
  bsi,
  seabank,
  gopay,
  "ovo-new-alt": ovoNewAlt,
  dana,
  "shopee-pay": shopeePay,
  linkaja,
  jenius,
  qris,
};

// Unknown slug (e.g. older saved data): fall back to the full set, loaded
// lazily in its own chunk only when actually needed.
const FullSetLogo = dynamic(
  () => import("idn-finlogos/react").then((mod) => mod.Logo),
  { ssr: false, loading: () => null },
);

const logoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
};

interface DynamicFinLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  slug: string;
  className?: string;
  alt?: string;
}

export const DynamicFinLogo = ({ slug, className, alt, ...props }: DynamicFinLogoProps) => {
  const svg = KNOWN_LOGOS[slug];

  return (
    <span
      className={cn("inline-flex items-center justify-center w-full h-full [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto [&_svg]:block", className)}
      {...props}
    >
      {svg ? (
        <span
          role="img"
          aria-label={alt}
          style={logoStyle}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <FullSetLogo slug={slug} title={alt} style={logoStyle} />
      )}
    </span>
  );
};
