import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionUser } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (body.artistId !== user.artistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      artist_id: body.artistId,
      image_url: body.imageUrl,
      caption: body.caption || null,
      sort_order: body.order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    ok: true,
    item: {
      id: data.id,
      imageUrl: data.image_url,
      caption: data.caption,
      order: data.sort_order,
    },
  });
}
