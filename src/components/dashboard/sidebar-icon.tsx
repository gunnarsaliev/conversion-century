import * as React from "react";

// An Iconify icon's SVG data (see scripts/generate-sidebar-icons.mjs).
type SidebarIconData = { body: string; width: number; height: number };

// Renders Iconify icon data as an inline SVG. Fluent Color icons define
// gradients by id, so ids are prefixed with React's useId: unique per
// instance and identical on server and client (no hydration mismatch).
const SidebarIcon = ({
  icon,
  className,
}: {
  icon: SidebarIconData;
  className?: string;
}) => {
  const prefix = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const body = icon.body
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}-$1"`);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
};

export { SidebarIcon };
export type { SidebarIconData };
