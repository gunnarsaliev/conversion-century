import { Logos35 } from "@/components/logos35";
import { getClientLogos } from "@/lib/client-logos";

type ClientLogosProps = Omit<React.ComponentProps<typeof Logos35>, "logos">;

// Logos35 filled with live client logos from Payload. Falls back to
// Logos35's own defaults when no client has a public logo yet.
export async function ClientLogos({
  viewAllHref = "/clients",
  ...props
}: ClientLogosProps) {
  const logos = await getClientLogos();
  return (
    <Logos35
      {...props}
      viewAllHref={viewAllHref}
      logos={logos.length > 0 ? logos : undefined}
    />
  );
}
