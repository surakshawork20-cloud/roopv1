import { db } from "@/lib/db";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { ServiceCategories } from "@/components/landing/ServiceCategories";
import { FeaturedArtists } from "@/components/landing/FeaturedArtists";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { ArtistCTA } from "@/components/landing/ArtistCTA";
import { FinalCTA } from "@/components/landing/FinalCTA";

export const dynamic = "force-dynamic";

async function getFeatured() {
  try {
    return await db.artist.findMany({
      where: { featured: true },
      take: 6,
      include: {
        portfolio: { take: 1, orderBy: { order: "asc" } },
        reviews: true,
        services: { take: 1, orderBy: { price: "asc" } },
      },
    });
  } catch (err) {
    console.error("DB unavailable, rendering with empty featured:", err);
    return [];
  }
}

export default async function Home() {
  const featured = await getFeatured();

  return (
    <>
      <Hero />
      <Stats />
      <ServiceCategories />
      {featured.length > 0 && <FeaturedArtists artists={featured} />}
      <HowItWorks />
      <Testimonials />
      <ArtistCTA />
      <FinalCTA />
    </>
  );
}
