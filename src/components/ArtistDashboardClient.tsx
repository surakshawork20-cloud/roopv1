"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Calendar, Clock, MapPin, DollarSign, Star, Users,
  Plus, Trash2, Edit3, X, Loader2, BadgeCheck, ArrowUpRight,
  Palette, LayoutDashboard, Image as ImageIcon, Settings, Check,
} from "lucide-react";
import { formatPrice, formatDateLong } from "@/lib/utils";

type Artist = {
  id: string; displayName: string; tagline: string; bio: string;
  city: string; area: string; avatarUrl: string; coverUrl: string;
  specialties: string; yearsExp: number; instagram: string | null;
  verified: boolean; featured: boolean;
};
type Booking = {
  id: string; date: string; timeSlot: string; status: string;
  totalPrice: number; notes: string | null; address: string | null;
  customerName: string; customerPhone: string | null;
  serviceName: string; serviceCategory: string; serviceDuration: number;
};
type Service = { id: string; name: string; description: string; duration: number; price: number; category: string };
type PortfolioItem = { id: string; imageUrl: string; caption: string | null; order: number };

type Tab = "overview" | "bookings" | "services" | "portfolio" | "profile";

export function ArtistDashboardClient({
  artist, bookings, services, portfolio, earnings, avgRating, reviewCount, userName,
}: {
  artist: Artist; bookings: Booking[]; services: Service[]; portfolio: PortfolioItem[];
  earnings: number; avgRating: number; reviewCount: number; userName: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.date) >= now && b.status !== "cancelled");

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "services", label: "Services", icon: Sparkles },
    { id: "portfolio", label: "Portfolio", icon: ImageIcon },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
          <div className="flex items-center gap-5">
            <img src={artist.avatarUrl} alt="" className="w-20 h-20 rounded-3xl object-cover border-2 border-gold/30" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-4xl lg:text-5xl">Hello, {userName.split(" ")[0]}.</h1>
                {artist.verified && <BadgeCheck className="text-gold fill-gold/20" size={24} />}
              </div>
              <p className="text-ink-dim">Your artist studio — manage everything in one place.</p>
            </div>
          </div>
          <Link href={`/artists/${artist.id}`} className="btn-ghost">
            <ArrowUpRight size={14} /> View public profile
          </Link>
        </div>

        <div className="border-b border-border flex gap-2 overflow-x-auto mb-10 -mx-5 px-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-3 px-4 text-sm font-medium rounded-t-xl border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                tab === t.id ? "border-gold text-ink bg-gradient-to-b from-transparent to-gold/5" : "border-transparent text-ink-dim hover:text-ink"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <MetricCard icon={DollarSign} label="Total earnings" value={formatPrice(earnings)} accent="gold" />
                <MetricCard icon={Calendar} label="Upcoming" value={upcoming.length.toString()} accent="rose" />
                <MetricCard icon={Users} label="Total clients" value={new Set(bookings.map((b) => b.customerName)).size.toString()} accent="violet" />
                <MetricCard icon={Star} label="Avg rating" value={avgRating ? avgRating.toFixed(1) : "—"} sub={`${reviewCount} reviews`} accent="emerald" />
              </div>

              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 glass rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-2xl">Next up</h3>
                    <button onClick={() => setTab("bookings")} className="text-sm text-gold hover:underline inline-flex items-center gap-1">
                      All bookings <ArrowUpRight size={12} />
                    </button>
                  </div>
                  {upcoming.length === 0 ? (
                    <div className="py-10 text-center text-ink-dim">
                      No upcoming bookings yet. Share your profile to get clients.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.slice(0, 4).map((b) => (
                        <BookingRow key={b.id} booking={b} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass rounded-3xl p-6">
                  <h3 className="font-display text-2xl mb-5">Quick wins</h3>
                  <ul className="space-y-3 text-sm">
                    <TipItem done={portfolio.length >= 5} text="Upload 5+ portfolio images" />
                    <TipItem done={services.length >= 3} text="List 3+ services" />
                    <TipItem done={!!artist.instagram} text="Link your Instagram" />
                    <TipItem done={artist.bio.length > 80} text="Write a standout bio" />
                    <TipItem done={artist.verified} text="Get verified" />
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "bookings" && <BookingsTab bookings={bookings} />}
          {tab === "services" && <ServicesTab services={services} artistId={artist.id} />}
          {tab === "portfolio" && <PortfolioTab portfolio={portfolio} artistId={artist.id} />}
          {tab === "profile" && <ProfileTab artist={artist} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, sub, accent }: {
  icon: typeof DollarSign; label: string; value: string; sub?: string;
  accent: "gold" | "rose" | "violet" | "emerald";
}) {
  const accents = {
    gold: "from-gold/20 to-gold/5 text-gold",
    rose: "from-rose/20 to-rose/5 text-rose",
    violet: "from-violet/20 to-violet/5 text-violet",
    emerald: "from-emerald/20 to-emerald/5 text-emerald",
  };
  return (
    <div className="p-6 rounded-3xl border border-border bg-surface relative overflow-hidden">
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${accents[accent]} blur-xl opacity-60`} />
      <div className="relative">
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center mb-4`}>
          <Icon size={17} />
        </div>
        <div className="text-xs uppercase tracking-widest text-ink-dim mb-1">{label}</div>
        <div className="font-display text-4xl">{value}</div>
        {sub && <div className="text-xs text-ink-dim mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function TipItem({ done, text }: { done: boolean; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-emerald text-bg" : "border border-border"}`}>
        {done && <Check size={11} strokeWidth={3} />}
      </div>
      <span className={done ? "text-ink-dim line-through" : ""}>{text}</span>
    </li>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/50 border border-border">
      <div className="min-w-0">
        <div className="font-medium truncate">{booking.customerName}</div>
        <div className="text-xs text-ink-dim">{booking.serviceName}</div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <div className="text-sm">{formatDateLong(new Date(booking.date))}</div>
        <div className="text-xs text-ink-dim">{booking.timeSlot} · {formatPrice(booking.totalPrice)}</div>
      </div>
    </div>
  );
}

function BookingsTab({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past" | "cancelled">("upcoming");
  const now = new Date();
  const filtered = bookings.filter((b) => {
    if (filter === "upcoming") return new Date(b.date) >= now && b.status !== "cancelled";
    if (filter === "past") return new Date(b.date) < now && b.status !== "cancelled";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });
  return (
    <motion.div key="bookings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "upcoming", "past", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              filter === f ? "bg-gradient-to-r from-rose to-violet text-white" : "bg-surface border border-border text-ink-dim hover:text-ink"
            }`}
          >
            {f} ({f === "all" ? bookings.length : bookings.filter((b) => {
              if (f === "upcoming") return new Date(b.date) >= now && b.status !== "cancelled";
              if (f === "past") return new Date(b.date) < now && b.status !== "cancelled";
              return b.status === "cancelled";
            }).length})
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl text-ink-dim">
          No {filter} bookings.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((b) => (
            <div key={b.id} className="glass rounded-2xl p-5 grid lg:grid-cols-[1fr_auto] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="chip">{b.serviceCategory}</span>
                  {b.status === "cancelled" && <span className="chip text-rose border-rose/30">Cancelled</span>}
                </div>
                <div className="font-semibold text-lg">{b.serviceName}</div>
                <div className="text-sm text-ink-dim mt-0.5">with {b.customerName}{b.customerPhone ? ` · ${b.customerPhone}` : ""}</div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-ink-dim">
                  <span className="flex items-center gap-1"><Calendar size={12} className="text-gold" />{formatDateLong(new Date(b.date))}</span>
                  <span className="flex items-center gap-1"><Clock size={12} className="text-gold" />{b.timeSlot} · {b.serviceDuration} min</span>
                  {b.address && <span className="flex items-center gap-1"><MapPin size={12} className="text-gold" />{b.address}</span>}
                </div>
                {b.notes && <div className="text-sm text-ink-dim mt-3 italic">&ldquo;{b.notes}&rdquo;</div>}
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-gradient-rose">{formatPrice(b.totalPrice)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ServicesTab({ services: initial, artistId }: { services: Service[]; artistId: string }) {
  const router = useRouter();
  const [services, setServices] = useState(initial);
  const [editing, setEditing] = useState<Service | "new" | null>(null);

  async function remove(id: string) {
    if (!confirm("Remove this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((s) => s.filter((x) => x.id !== id));
    router.refresh();
  }

  return (
    <motion.div key="services" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-ink-dim text-sm">Services appear on your public profile for clients to book.</p>
        <button onClick={() => setEditing("new")} className="btn-primary shine">
          <Plus size={16} /> Add service
        </button>
      </div>
      {services.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl">
          <p className="font-display text-2xl mb-2">No services yet</p>
          <p className="text-ink-dim text-sm mb-5">Add your first service to start receiving bookings.</p>
          <button onClick={() => setEditing("new")} className="btn-primary"><Plus size={14} />Add your first service</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gold mb-1">{s.category}</div>
                  <div className="font-semibold text-lg">{s.name}</div>
                </div>
                <div className="font-display text-xl text-gradient-rose">{formatPrice(s.price)}</div>
              </div>
              <p className="text-sm text-ink-dim leading-relaxed mb-4">{s.description}</p>
              <div className="text-xs text-ink-dim flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1"><Clock size={11} className="text-gold" /> {s.duration} min</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(s)} className="btn-ghost text-xs py-2 px-3"><Edit3 size={12} />Edit</button>
                <button onClick={() => remove(s.id)} className="btn-ghost text-xs py-2 px-3 text-rose hover:border-rose/50"><Trash2 size={12} />Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceEditor
        open={editing !== null}
        initial={editing === "new" ? null : editing}
        artistId={artistId}
        onClose={() => setEditing(null)}
        onSaved={(s) => {
          setServices((list) => {
            const idx = list.findIndex((x) => x.id === s.id);
            if (idx >= 0) { const c = [...list]; c[idx] = s; return c; }
            return [...list, s];
          });
          setEditing(null);
          router.refresh();
        }}
      />
    </motion.div>
  );
}

function ServiceEditor({
  open, initial, artistId, onClose, onSaved,
}: {
  open: boolean; initial: Service | null; artistId: string;
  onClose: () => void; onSaved: (s: Service) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? 60);
  const [price, setPrice] = useState(initial?.price ?? 5000);
  const [category, setCategory] = useState(initial?.category ?? "Bridal");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;
  const isEdit = !!initial;

  async function save() {
    setLoading(true); setErr(null);
    try {
      const res = await fetch(isEdit ? `/api/services/${initial!.id}` : "/api/services", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId, name, description: desc, duration, price, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved(data.service);
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-bg/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-3xl p-8 max-w-lg w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-3xl">{isEdit ? "Edit service" : "New service"}</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center"><X size={16} /></button>
          </div>

          <div className="space-y-4">
            <Field label="Service name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="dash-input" placeholder="e.g. Bridal Full Look" />
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="dash-input">
                {["Bridal", "Party & Glam", "Editorial & HD", "Men's Grooming", "Hair & Style", "SFX & Artistic"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Description">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="dash-input resize-none" placeholder="What does this service include?" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duration (min)">
                <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="dash-input" min={15} step={15} />
              </Field>
              <Field label="Price (₹)">
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="dash-input" min={500} step={100} />
              </Field>
            </div>
            {err && <div className="text-sm text-rose bg-rose/10 border border-rose/30 rounded-xl px-4 py-3">{err}</div>}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button onClick={save} disabled={loading || !name || !desc} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><Check size={14} />{isEdit ? "Save changes" : "Create service"}</>}
            </button>
          </div>
          <style jsx>{`
            .dash-input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.85rem; background: rgba(245, 235, 224, 0.04); border: 1px solid var(--border-strong); color: var(--ink); outline: none; font-size: 0.95rem; }
            .dash-input:focus { border-color: var(--gold); }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink-dim mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function PortfolioTab({ portfolio: initial, artistId }: { portfolio: PortfolioItem[]; artistId: string }) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(initial);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  async function add() {
    if (!url) return;
    setLoading(true);
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId, imageUrl: url, caption, order: portfolio.length }),
    });
    const data = await res.json();
    if (res.ok) {
      setPortfolio((p) => [...p, data.item]);
      setUrl(""); setCaption("");
      router.refresh();
    }
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm("Remove this image?")) return;
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    setPortfolio((p) => p.filter((x) => x.id !== id));
    router.refresh();
  }

  return (
    <motion.div key="portfolio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="glass rounded-3xl p-6 mb-8">
        <h3 className="font-display text-2xl mb-4">Add portfolio image</h3>
        <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Image URL (Unsplash, Dropbox, etc.)"
            className="px-4 py-3 rounded-xl bg-surface border border-border focus:border-gold/50 outline-none"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption"
            className="px-4 py-3 rounded-xl bg-surface border border-border focus:border-gold/50 outline-none"
          />
          <button onClick={add} disabled={loading || !url} className="btn-primary disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={14} /> : <><Plus size={14} />Add</>}
          </button>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl">
          <p className="font-display text-2xl mb-2">Your portfolio is empty</p>
          <p className="text-ink-dim text-sm">Add your best work above — great images convert visitors to clients.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {portfolio.map((p) => (
            <div key={p.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
              <img src={p.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button onClick={() => remove(p.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={12} />
              </button>
              {p.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">{p.caption}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProfileTab({ artist }: { artist: Artist }) {
  const router = useRouter();
  const [form, setForm] = useState(artist);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setLoading(true);
    await fetch("/api/artist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-3xl p-6 space-y-5">
          <h3 className="font-display text-2xl">Your public profile</h3>
          <Field label="Display name">
            <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="dash-input" />
          </Field>
          <Field label="Tagline">
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="dash-input" />
          </Field>
          <Field label="About you">
            <textarea rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="dash-input resize-none" />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="City"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="dash-input" /></Field>
            <Field label="Area"><input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="dash-input" /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Specialties (comma-sep.)"><input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} className="dash-input" /></Field>
            <Field label="Years of experience"><input type="number" value={form.yearsExp} onChange={(e) => setForm({ ...form, yearsExp: Number(e.target.value) })} className="dash-input" min={0} /></Field>
          </div>
          <Field label="Instagram handle (without @)">
            <input value={form.instagram || ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="dash-input" placeholder="yourname" />
          </Field>
          <Field label="Avatar URL">
            <input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} className="dash-input" />
          </Field>
          <Field label="Cover image URL">
            <input value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} className="dash-input" />
          </Field>

          <button onClick={save} disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="animate-spin" size={14} /> : saved ? <><Check size={14} />Saved!</> : <><Check size={14} />Save changes</>}
          </button>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-3xl p-6">
            <div className="text-xs uppercase tracking-widest text-gold mb-3">Preview</div>
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-border">
              <img src={form.coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-3">
              <img src={form.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="font-semibold truncate">{form.displayName}</div>
                <div className="text-xs text-ink-dim truncate">{form.tagline}</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <BadgeCheck size={16} className={artist.verified ? "text-gold" : "text-muted"} />
              <span className="font-medium">{artist.verified ? "Verified artist" : "Not verified"}</span>
            </div>
            <p className="text-xs text-ink-dim">
              Verified artists appear higher in search and get a badge on their profile.
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .dash-input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.85rem; background: rgba(245, 235, 224, 0.04); border: 1px solid var(--border-strong); color: var(--ink); outline: none; font-size: 0.95rem; }
        .dash-input:focus { border-color: var(--gold); }
      `}</style>
    </motion.div>
  );
}
