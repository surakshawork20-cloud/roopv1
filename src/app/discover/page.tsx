import { createClient } from "@/lib/supabase/server";
import { DiscoverClient } from "@/components/DiscoverClient";
import { toCardArtist } from "@/lib/supabase/shape";

export const metadata = {
  title: "Discover Artists — Roop",
  description: "Browse India's most talented makeup Artists, hairstylists, and beauty professionals.",
};

export const dynamic = "force-dynamic";

async function getArtists() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("artists")
      .select("*, portfolio_items(image_url, sort_order), reviews(rating), services(price, category)")
      .order("featured", { ascending: false })
      .order("years_exp", { ascending: false });
    return (data ?? []).map(toCardArtist);
  } catch (err) {
    console.error("DB unavailable on /discover:", err);
    return [];
  }
}

export default async function DiscoverPage() {
  const artists = await getArtists();
  return <DiscoverClient artists={artists} />;
}
