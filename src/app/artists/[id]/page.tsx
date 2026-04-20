import { notFound } from "next/navigation";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { ArtistProfile } from "@/components/ArtistProfile";
import { toProfileArtist } from "@/lib/supabase/shape";

export const dynamic = "force-dynamic";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  let rawArtist = null;
  let rawReviews: Array<{
    id: string; rating: number; comment: string; created_at: string;
    profiles: { name: string } | null;
  }> = [];

  try {
    const supabase = await createClient();
    const [artistRes, reviewsRes] = await Promise.all([
      supabase
        .from("artists")
        .select("*, portfolio_items(id, image_url, caption, sort_order), services(id, name, description, duration, price, category)")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("reviews")
        .select("id, rating, comment, created_at, profiles(name)")
        .eq("artist_id", id)
        .order("created_at", { ascending: false }),
    ]);
    rawArtist = artistRes.data;
    rawReviews = (reviewsRes.data ?? []) as unknown as typeof rawReviews;
  } catch (err) {
    console.error("DB unavailable on artist profile:", err);
  }

  if (!rawArtist) notFound();

  const artist = {
    ...toProfileArtist(rawArtist),
    reviews: rawReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userName: r.profiles?.name ?? "Anonymous",
      createdAt: r.created_at,
    })),
  };

  return <ArtistProfile artist={artist} user={user} />;
}
