import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  artistId: z.string(),
  name: z.string().min(2),
  description: z.string().min(5),
  duration: z.number().int().min(15),
  price: z.number().int().min(100),
  category: z.string(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    if (data.artistId !== user.artistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const service = await db.service.create({ data });
    return NextResponse.json({ ok: true, service });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
