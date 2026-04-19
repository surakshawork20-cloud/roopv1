import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await db.portfolio.findUnique({ where: { id } });
  if (!item || item.artistId !== user.artistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.portfolio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
