import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.userId !== user.id && booking.artistId !== user.artistId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await db.booking.update({ where: { id }, data: { status: "cancelled" } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.artistId !== user.artistId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await db.booking.update({
    where: { id },
    data: { status: body.status },
  });
  return NextResponse.json({ ok: true, booking: updated });
}
