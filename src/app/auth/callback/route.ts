import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth providers (Google etc.) redirect here with ?code=... after the user authenticates.
// We exchange the code for a session, then bounce the user to their dashboard.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If the signed-in user is an artist, send them to the artist dashboard instead.
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        const dest = profile?.role === "artist" ? "/artist/dashboard" : next;
        return NextResponse.redirect(`${origin}${dest}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("OAuth exchange error:", error);
  }

  // Something went wrong — bounce back to login with an error flag.
  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
