import { redirect } from "next/navigation";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { ArtistDashboardClient } from "@/components/ArtistDashboardClient";

export const dynamic = "force-dynamic";

type BookingJoin = {
  id: string; date: string; time_slot: string; status: string;
  total_price: number; notes: string | null; address: string | null;
  profiles: { name: string; email: string; phone: string | null } | null;
  services: { name: string; category: string; duration: number } | null;
};

export default async function ArtistDashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "artist" || !user.artistId) redirect("/dashboard");

  const supabase = await createClient();
  const [artistRes, bookingsRes, servicesRes, portfolioRes, reviewsRes] = await Promise.all([
    supabase.from("artists").select("*").eq("id", user.artistId).maybeSingle(),
    supabase.from("bookings")
      .select(`
        id, date, time_slot, status, total_price, notes, address,
        profiles ( name, email, phone ),
        services ( name, category, duration )
      `)
      .eq("artist_id", user.artistId)
      .order("date", { ascending: false }),
    supabase.from("services").select("*").eq("artist_id", user.artistId).order("price", { ascending: true }),
    supabase.from("portfolio_items").select("*").eq("artist_id", user.artistId).order("sort_order", { ascending: true }),
    supabase.from("reviews").select("rating").eq("artist_id", user.artistId),
  ]);

  const artistRow = artistRes.data;
  if (!artistRow) redirect("/");

  const bookings = (bookingsRes.data ?? []) as unknown as BookingJoin[];
  const reviews = reviewsRes.data ?? [];
  const earnings = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total_price, 0);
  const avgRating = reviews.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;

  const plainArtist = {
    id: artistRow.id,
    displayName: artistRow.display_name,
    tagline: artistRow.tagline,
    bio: artistRow.bio,
    city: artistRow.city,
    area: artistRow.area,
    avatarUrl: artistRow.avatar_url,
    coverUrl: artistRow.cover_url,
    specialties: artistRow.specialties,
    yearsExp: artistRow.years_exp,
    instagram: artistRow.instagram,
    verified: artistRow.verified,
    featured: artistRow.featured,
  };

  return (
    <ArtistDashboardClient
      artist={plainArtist}
      bookings={bookings.map((b) => ({
        id: b.id,
        date: b.date,
        timeSlot: b.time_slot,
        status: b.status,
        totalPrice: b.total_price,
        notes: b.notes,
        address: b.address,
        customerName: b.profiles?.name ?? "—",
        customerPhone: b.profiles?.phone ?? null,
        serviceName: b.services?.name ?? "—",
        serviceCategory: b.services?.category ?? "",
        serviceDuration: b.services?.duration ?? 0,
      }))}
      services={(servicesRes.data ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        duration: s.duration,
        price: s.price,
        category: s.category,
      }))}
      portfolio={(portfolioRes.data ?? []).map((p) => ({
        id: p.id,
        imageUrl: p.image_url,
        caption: p.caption,
        order: p.sort_order,
      }))}
      reviewCount={reviews.length}
      avgRating={avgRating}
      earnings={earnings}
      userName={user.name}
    />
  );
}
