import Link from "next/link";

export function Logo({ size = "md", withTagline = false }: { size?: "sm" | "md" | "lg"; withTagline?: boolean }) {
  const fontSize = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-3xl";
  const tagSize = size === "lg" ? "text-[10px]" : "text-[8px]";
  return (
    <Link
      href="/"
      className="inline-flex flex-col leading-none group"
    >
      <span className={`font-display ${fontSize} tracking-[0.15em] text-gradient-primary font-semibold`}>
        ROOP
      </span>
      {withTagline && (
        <span className={`${tagSize} uppercase tracking-[0.3em] text-gold-deep mt-1 opacity-80`}>
          Where creation meets the moment
        </span>
      )}
    </Link>
  );
}
