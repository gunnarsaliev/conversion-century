import Image from "next/image";

// ---------------------------------------------------------------------------
// Client logo
// ---------------------------------------------------------------------------
//
// Renders a client's logo at its natural aspect ratio (no forced 1:1 crop).
// The shorter side is sized to `size` and the longer side scales up from
// there (capped at 2x `size`), so non-square logos read at a comparable
// visual size to square ones instead of shrinking to fit a forced box.
// Falls back to initials when there's no logo.

type ClientLogoProps = {
  companyName: string;
  logoUrl?: string | null;
  logoWidth?: number | null;
  logoHeight?: number | null;
  /** Target size in pixels for the logo's shorter side. */
  size?: number;
  className?: string;
};

const ClientLogo = ({
  companyName,
  logoUrl,
  logoWidth,
  logoHeight,
  size = 64,
  className,
}: ClientLogoProps) => {
  if (!logoUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-md border bg-muted text-sm font-medium text-muted-foreground ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        {companyName.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  // Scale the logo's natural aspect ratio so its *shorter* side fills
  // `size` and its longer side extends past it — otherwise a non-square
  // logo (e.g. a wide wordmark) gets shrunk down to fit a forced square
  // box, making it look tiny next to square logos of the same `size`.
  // The longer side is capped at 2x `size` so an extreme banner-shaped
  // logo can't blow out the surrounding card/grid layout.
  const rawAspectRatio =
    logoWidth && logoHeight ? logoWidth / logoHeight : 1;
  const aspectRatio = Math.min(Math.max(rawAspectRatio, 0.5), 2);
  const boxWidth = aspectRatio >= 1 ? size * aspectRatio : size;
  const boxHeight = aspectRatio >= 1 ? size : size / aspectRatio;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md ${className ?? ""}`}
      style={{ width: boxWidth, height: boxHeight }}
    >
      <Image
        src={logoUrl}
        alt={companyName}
        width={logoWidth ?? size}
        height={logoHeight ?? size}
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export { ClientLogo };
