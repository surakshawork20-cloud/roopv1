import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  eventDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  eventPeriod: z.string().optional(),
  eventName: z.string().min(1),
  location: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist" || !user.artistId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = schema.parse(await req.json());
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("artist_events")
      .insert({
        artist_id: user.artistId,
        event_date: data.eventDate,
        start_time: data.startTime,
        end_time: data.endTime,
        event_period: data.eventPeriod ?? null,
        event_name: data.eventName,
        location: data.location ?? null,
        customer_name: data.customerName ?? null,
        customer_phone: data.customerPhone ?? null,
        notes: data.notes ?? null,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, event: row });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
