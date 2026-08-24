import Image, { type ImageProps } from "next/image"

function LogomarkPaths() {
  return (
    <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth={3}>
      <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z" />
      <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z" />
    </g>
  )
}

export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" {...props}>
      <LogomarkPaths />
    </svg>
  )
}

const logo: string = 'https://pub-05efc1b2acd64b71beacdf66eed34654.r2.dev/conversion-century-logo-wide.png'

type LogoProps = Omit<ImageProps, 'src' | 'alt'> & { alt?: string }

export function Logo({ alt = 'Logo', width = 100, height = 100, ...props }: LogoProps) {
    return (
    <Image src={logo} alt={alt} width={width} height={height} {...props} />
    )
}
