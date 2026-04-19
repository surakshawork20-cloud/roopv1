"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Mail, Lock, User, Phone, Palette, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";

type Mode = "login" | "signup";
type Role = "customer" | "artist";

export function AuthForm({
  mode,
  defaultRole = "customer",
}: {
  mode: Mode;
  defaultRole?: Role;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "login" ? { email, password } : { name, email, password, phone, role };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      const r = data.role as Role | undefined;
      router.refresh();
      router.push(r === "artist" ? "/artist/dashboard" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-plum via-bg-soft to-bg border-r border-border">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--rose), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />

        <div className="relative z-10">
          <Logo size="lg" withTagline />
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="chip"><Sparkles size={12} className="text-gold" /> Welcome back to beautiful</div>
          <h1 className="font-display text-5xl xl:text-6xl leading-[1.05]">
            Your <span className="italic text-gradient-rose">glow up</span> starts with the right artist.
          </h1>
          <p className="text-ink-dim">
            Join thousands booking India&apos;s most talented makeup artists, hairstylists, and beauty
            professionals — all in one curated space.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop","https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop","https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop"].map((src,i) => (
                <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 border-bg object-cover" />
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold">10,000+ clients</div>
              <div className="text-xs text-ink-dim">trust Roop</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-ink-dim">
          &quot;The booking experience was seamless. Found the perfect artist for my wedding in minutes.&quot; — Priya S.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <h2 className="font-display text-4xl lg:text-5xl mb-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-ink-dim mb-8">
            {mode === "login"
              ? "Sign in to continue your journey."
              : "Join Roop to book or offer beauty services."}
          </p>

          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface rounded-2xl mb-6 border border-border">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex items-center gap-2 justify-center py-3 rounded-xl text-sm transition-all ${
                  role === "customer"
                    ? "bg-gradient-to-br from-rose to-violet text-white shadow-lg"
                    : "text-ink-dim hover:text-ink"
                }`}
              >
                <ShoppingBag size={16} /> I want services
              </button>
              <button
                type="button"
                onClick={() => setRole("artist")}
                className={`flex items-center gap-2 justify-center py-3 rounded-xl text-sm transition-all ${
                  role === "artist"
                    ? "bg-gradient-to-br from-gold to-amber text-bg shadow-lg font-semibold"
                    : "text-ink-dim hover:text-ink"
                }`}
              >
                <Palette size={16} /> I&apos;m an artist
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field icon={<User size={16} />} label="Full name">
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </Field>
            )}
            <Field icon={<Mail size={16} />} label="Email">
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </Field>
            {mode === "signup" && (
              <Field icon={<Phone size={16} />} label="Phone (optional)">
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input"
                />
              </Field>
            )}
            <Field icon={<Lock size={16} />} label="Password">
              <input
                required
                type="password"
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </Field>

            {error && (
              <div className="text-sm text-rose bg-rose/10 border border-rose/30 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full shine"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Sparkles size={16} />
                  {mode === "login" ? "Sign in" : "Create account"}
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-dim">
            {mode === "login" ? (
              <>Don&apos;t have an account? <Link href="/signup" className="text-gold hover:underline">Sign up</Link></>
            ) : (
              <>Already have an account? <Link href="/login" className="text-gold hover:underline">Sign in</Link></>
            )}
          </p>

          <style jsx>{`
            .auth-input {
              width: 100%;
              padding: 0.875rem 1rem 0.875rem 2.5rem;
              border-radius: 0.85rem;
              background: rgba(245, 235, 224, 0.04);
              border: 1px solid var(--border-strong);
              color: var(--ink);
              outline: none;
              font-size: 0.95rem;
              transition: all 0.2s ease;
            }
            .auth-input:focus {
              border-color: var(--gold);
              background: rgba(245, 235, 224, 0.07);
              box-shadow: 0 0 0 4px rgba(232, 184, 109, 0.1);
            }
            .auth-input::placeholder {
              color: var(--muted);
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink-dim mb-2 block">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        {children}
      </div>
    </label>
  );
}
