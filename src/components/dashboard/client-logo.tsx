import Image from "next/image";

// ---------------------------------------------------------------------------
// Client logo
// ---------------------------------------------------------------------------
//
// Renders a client's logo at its natural aspect ratio (no forced 1:1 crop),
// bounded to a max box so it lines up with surrounding UI, with an
// initials fallback when there's no logo.

type ClientLogoProps = {
  companyName: string;
  logoUrl?: string | null;
  logoWidth?: number | null;
  logoHeight?: number | null;
  /** Max box size in pixels (both width and height). */
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

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logoUrl}
        alt={companyName}
        width={logoWidth ?? size}
        height={logoHeight ?? size}
        className="h-auto max-h-full w-auto max-w-full object-contain"
      />
    </div>
  );
};

export { ClientLogo };
