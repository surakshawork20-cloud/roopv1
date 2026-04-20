import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll called from a Server Component — middleware handles the refresh instead
          }
        },
      },
    }
  );
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, name, phone, role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) return null;

    let artistId: string | null = null;
    if (profile.role === "artist") {
      const { data: artist } = await supabase
        .from("artists")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      artistId = artist?.id ?? null;
    }

    return { ...profile, artistId };
  } catch {
    return null;
  }
}
