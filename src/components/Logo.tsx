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
  // The PNG has ~25% transparent padding around the lettermark, so display heights
  // are set generously to keep the ROOP wordmark visually comparable to body text.
  const h = withTagline
    ? size === "lg" ? 110 : size === "sm" ? 64 : 84
    : size === "lg" ? 76 : size === "sm" ? 44 : 60;

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
