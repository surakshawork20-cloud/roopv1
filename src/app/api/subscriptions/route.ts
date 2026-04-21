import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const LISTING_FEE_INR = 699;

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "artist" || !user.artistId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payments not configured on server" }, { status: 503 });
  }

  try {
    const { periodMonth } = (await req.json()) as { periodMonth: string };
    if (!periodMonth) return NextResponse.json({ error: "Missing period" }, { status: 400 });

    const supabase = await createClient();
    const admin = createAdminClient();

    // Create (or reuse) a pending subscription row for this month.
    const { data: existing } = await supabase
      .from("artist_subscriptions")
      .select("id, status, razorpay_order_id")
      .eq("artist_id", user.artistId)
      .eq("period_month", periodMonth)
      .maybeSingle();
    if (existing?.status === "paid") {
      return NextResponse.json({ error: "Already paid for this month" }, { status: 409 });
    }

    // Create Razorpay order via REST
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const rz = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: LISTING_FEE_INR * 100,
        currency: "INR",
        receipt: `sub_${user.artistId}_${periodMonth}`,
        notes: { artistId: user.artistId, periodMonth },
      }),
    });
    if (!rz.ok) {
      const text = await rz.text();
      console.error("Razorpay order create failed:", text);
      return NextResponse.json({ error: "Payment gateway failed" }, { status: 502 });
    }
    const order = (await rz.json()) as { id: string; amount: number };

    let subscriptionId = existing?.id;
    if (subscriptionId) {
      await admin.from("artist_subscriptions").update({ razorpay_order_id: order.id, status: "pending" }).eq("id", subscriptionId);
    } else {
      const { data, error } = await admin.from("artist_subscriptions").insert({
        artist_id: user.artistId,
        period_month: periodMonth,
        amount: LISTING_FEE_INR,
        status: "pending",
        razorpay_order_id: order.id,
      }).select("id").single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      subscriptionId = data.id;
    }

    return NextResponse.json({
      ok: true,
      subscriptionId,
      orderId: order.id,
      amount: order.amount,
      keyId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
