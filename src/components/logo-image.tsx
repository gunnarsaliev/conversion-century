import Image from "next/image";

type LogoImageProps = {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  // The largest size it's shown at, in CSS pixels. The browser gets a copy
  // resized to fit, however large the upload is.
  width?: number;
  height?: number;
};

// A client logo through next/image: uploads can be megabytes for something
// shown at about 144x40. SVGs pass through untouched. Sizing stays with the
// caller's className; add `w-auto` when it only sets a height.
export function LogoImage({ src, alt, title, className, width = 160, height = 40 }: LogoImageProps) {
  return <Image src={src} alt={alt} title={title} width={width} height={height} className={className} />;
}
