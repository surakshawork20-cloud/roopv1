import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist" || !user.artistId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const artist = await db.artist.update({
    where: { id: user.artistId },
    data: {
      displayName: body.displayName,
      tagline: body.tagline,
      bio: body.bio,
      city: body.city,
      area: body.area,
      avatarUrl: body.avatarUrl,
      coverUrl: body.coverUrl,
      specialties: body.specialties,
      yearsExp: body.yearsExp,
      instagram: body.instagram || null,
    },
  });
  return NextResponse.json({ ok: true, artist });
}
