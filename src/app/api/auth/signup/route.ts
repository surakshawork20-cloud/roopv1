import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
  role: z.enum(["customer", "artist"]).default("customer"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: await hashPassword(data.password),
        role: data.role,
      },
    });

    if (data.role === "artist") {
      await db.artist.create({
        data: {
          userId: user.id,
          displayName: data.name,
          tagline: "New artist on Roop",
          bio: "Tell us about your style and experience.",
          city: "Bengaluru",
          area: "",
          avatarUrl:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80",
          coverUrl:
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80",
          specialties: "Bridal,Party,Editorial",
          yearsExp: 0,
        },
      });
    }

    await createSession(user.id);

    return NextResponse.json({ ok: true, role: data.role });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
