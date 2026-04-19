import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
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
    const service = await db.service.findUnique({ where: { id: data.serviceId } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const booking = await db.booking.create({
      data: {
        userId: user.id,
        artistId: data.artistId,
        serviceId: data.serviceId,
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        totalPrice: service.price,
        notes: data.notes,
        address: data.address,
      },
    });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
