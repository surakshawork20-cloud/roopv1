import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json());
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
    await createSession(user.id);
    return NextResponse.json({ ok: true, role: user.role });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
