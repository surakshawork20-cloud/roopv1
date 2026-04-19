import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (body.artistId !== user.artistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const item = await db.portfolio.create({
    data: {
      artistId: body.artistId,
      imageUrl: body.imageUrl,
      caption: body.caption || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json({ ok: true, item });
}
