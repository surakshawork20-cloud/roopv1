import Link from "next/link";
import Image from "next/image";

// Uses the brand logo file from /public/logo.png.
// The image already includes the "Where the creation meets the moment" tagline.
// `withTagline` controls image height: the nav uses a compact size where the tagline
// is visually present but small; footer / auth hero use a larger size.
export function Logo({
  size = "md",
  withTagline = false,
}: {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}) {
  // Heights chosen so the "ROOP" lettermark lines up with our existing nav text scale.
  // The image is roughly a square, so width scales proportionally.
  const h = withTagline
    ? size === "lg" ? 72 : size === "sm" ? 40 : 56
    : size === "lg" ? 48 : size === "sm" ? 28 : 36;

  // Intrinsic source dimensions (transparent logo file). width/height are
  // required by next/image; we use them to compute aspect ratio.
  const INTRINSIC = 1000;

  return (
    <Link href="/" className="inline-flex items-center shrink-0" aria-label="Roop — Where the creation meets the moment">
      <Image
        src="/logo.png"
        alt="Roop"
        width={INTRINSIC}
        height={INTRINSIC}
        priority
        className="w-auto"
        style={{ height: `${h}px` }}
      />
    </Link>
  );
}
