import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing || existing.artistId !== user.artistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const service = await db.service.update({
    where: { id },
    data: {
      name: body.name, description: body.description,
      duration: body.duration, price: body.price, category: body.category,
    },
  });
  return NextResponse.json({ ok: true, service });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing || existing.artistId !== user.artistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
