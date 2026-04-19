import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "roopnow-dev-secret"
);
const COOKIE = "roopnow_session";

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUser() {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.userId as string;
    if (!userId) return null;
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { artist: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      artistId: user.artist?.id ?? null,
    };
  } catch {
    return null;
  }
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
