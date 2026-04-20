import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  artistId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  notes: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please log in to book." }, { status: 401 });

    const data = schema.parse(await req.json());
    const supabase = await createClient();

    const { data: service } = await supabase
      .from("services")
      .select("price")
      .eq("id", data.serviceId)
      .maybeSingle();
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        artist_id: data.artistId,
        service_id: data.serviceId,
        date: data.date,
        time_slot: data.timeSlot,
        total_price: service.price,
        notes: data.notes ?? null,
        address: data.address ?? null,
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
