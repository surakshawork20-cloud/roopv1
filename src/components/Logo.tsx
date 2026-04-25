import Link from "next/link";
import Image from "next/image";

// Brand logo file at /public/logo.png (cropped tight, ~12:7 aspect ratio).
// The image already includes the "Where the creation meets the moment" tagline.
export function Logo({
  size = "md",
  withTagline = false,
}: {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}) {
  const h = withTagline
    ? size === "lg" ? 104 : size === "sm" ? 64 : 84
    : size === "lg" ? 76 : size === "sm" ? 44 : 60;

  // Intrinsic dimensions of the cropped PNG.
  const W = 2400;
  const H = 1400;

  return (
    <Link href="/" className="inline-flex items-center shrink-0" aria-label="Roop — Where the creation meets the moment">
      <Image
        src="/logo.png"
        alt="Roop"
        width={W}
        height={H}
        priority
        className="w-auto"
        style={{ height: `${h}px` }}
      />
    </Link>
  );
}
