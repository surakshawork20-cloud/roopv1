"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, Check, Clock, Calendar,
  Sparkles, Loader2, MapPin, LogIn,
} from "lucide-react";
import { formatPrice, formatDateLong } from "@/lib/utils";
import { addDays, format, isSameDay, startOfDay } from "date-fns";

type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
};

type Artist = {
  id: string;
  displayName: string;
  avatarUrl: string;
  city: string;
  area: string;
  services: Service[];
};

const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export function BookingDrawer({
  artist,
  user,
  service,
  onClose,
  onChangeService,
}: {
  artist: Artist;
  user: { id: string; name: string; role: string } | null;
  service: Service | null;
  onClose: () => void;
  onChangeService: (s: Service) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  function reset() {
    setStep(1);
    setDate(null);
    setSlot(null);
    setAddress("");
    setNotes("");
    setError(null);
    onClose();
  }

  async function confirm() {
    if (!service || !date || !slot) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId: artist.id,
          serviceId: service.id,
          date: date.toISOString(),
          timeSlot: slot,
          address,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.refresh();
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const open = service !== null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="fixed inset-0 bg-bg/70 backdrop-blur-md z-[99]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-bg-soft border-l border-border-strong z-[100] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <img src={artist.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{artist.displayName}</div>
                  <div className="text-xs text-ink-dim">Step {step} of 3</div>
                </div>
              </div>
              <button onClick={reset} className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-2 border-b border-border shrink-0">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      step >= n ? "bg-gradient-to-r from-rose to-violet" : "bg-surface-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!user && step < 4 && (
                <div className="glass rounded-2xl p-5 mb-5 border-gold/30">
                  <div className="flex gap-3 items-start">
                    <LogIn size={20} className="text-gold mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Almost there — sign in to book</div>
                      <div className="text-sm text-ink-dim mb-3">
                        You&apos;ll need an account to confirm a booking.
                      </div>
                      <div className="flex gap-2">
                        <Link href="/login" className="btn-ghost text-xs py-2 px-3">Log in</Link>
                        <Link href="/signup" className="btn-primary text-xs py-2 px-3">Sign up</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && service && (
                <div>
                  <h3 className="font-display text-2xl mb-1">Choose a service</h3>
                  <p className="text-sm text-ink-dim mb-5">Pick what you&apos;d like this artist to do.</p>
                  <div className="space-y-3">
                    {artist.services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onChangeService(s)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${
                          service.id === s.id
                            ? "border-gold bg-gradient-to-br from-gold/10 to-transparent"
                            : "border-border bg-surface/50 hover:border-gold/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-widest text-gold mb-1">{s.category}</div>
                            <div className="font-semibold truncate">{s.name}</div>
                            <div className="text-xs text-ink-dim line-clamp-2 mt-1">{s.description}</div>
                            <div className="text-xs text-ink-dim mt-2 flex items-center gap-1">
                              <Clock size={10} /> {s.duration} min
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-display text-xl text-gradient-rose">{formatPrice(s.price)}</div>
                            {service.id === s.id && (
                              <div className="mt-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold text-bg">
                                <Check size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && service && (
                <div>
                  <h3 className="font-display text-2xl mb-1">Pick date & time</h3>
                  <p className="text-sm text-ink-dim mb-5">Select when the artist will come to you.</p>

                  <div className="mb-5">
                    <div className="text-xs uppercase tracking-widest text-ink-dim mb-3 flex items-center gap-1.5">
                      <Calendar size={12} className="text-gold" /> Date
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {days.slice(0, 12).map((d) => {
                        const selected = date && isSameDay(d, date);
                        return (
                          <button
                            key={d.toISOString()}
                            onClick={() => setDate(d)}
                            className={`p-3 rounded-xl text-center border transition-all ${
                              selected
                                ? "border-gold bg-gradient-to-br from-gold/20 to-transparent"
                                : "border-border bg-surface/50 hover:border-gold/40"
                            }`}
                          >
                            <div className="text-[10px] uppercase tracking-wider text-ink-dim">{format(d, "EEE")}</div>
                            <div className="font-display text-xl mt-0.5">{format(d, "d")}</div>
                            <div className="text-[10px] text-ink-dim">{format(d, "MMM")}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {date && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="text-xs uppercase tracking-widest text-ink-dim mb-3 flex items-center gap-1.5">
                        <Clock size={12} className="text-gold" /> Time slot
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {slots.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSlot(s)}
                            className={`p-2.5 rounded-xl text-sm border transition-all ${
                              slot === s
                                ? "border-gold bg-gradient-to-br from-gold/20 to-transparent"
                                : "border-border bg-surface/50 hover:border-gold/40"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 3 && service && (
                <div>
                  <h3 className="font-display text-2xl mb-1">Almost done</h3>
                  <p className="text-sm text-ink-dim mb-5">Where should the artist arrive?</p>

                  <label className="block mb-4">
                    <span className="text-xs uppercase tracking-widest text-ink-dim mb-2 block flex items-center gap-1.5">
                      <MapPin size={12} className="text-gold" /> Address
                    </span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your home, venue, or studio address"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-gold/50 outline-none"
                    />
                  </label>

                  <label className="block mb-6">
                    <span className="text-xs uppercase tracking-widest text-ink-dim mb-2 block">Notes (optional)</span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any allergies, preferences, or look references to share?"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-gold/50 outline-none resize-none"
                    />
                  </label>

                  <div className="glass rounded-2xl p-5">
                    <div className="text-xs uppercase tracking-widest text-gold mb-3">Booking summary</div>
                    <div className="space-y-2 text-sm">
                      <Row label="Service" value={service.name} />
                      <Row label="Date" value={date ? formatDateLong(date) : "—"} />
                      <Row label="Time" value={slot || "—"} />
                      <Row label="Duration" value={`${service.duration} min`} />
                      <div className="h-px bg-border my-2" />
                      <Row label="Total" value={formatPrice(service.price)} big />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 text-sm text-rose bg-rose/10 border border-rose/30 rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {step === 4 && service && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-rose flex items-center justify-center mb-6"
                  >
                    <Check size={40} className="text-bg" strokeWidth={3} />
                  </motion.div>
                  <h3 className="font-display text-4xl mb-3">You&apos;re booked!</h3>
                  <p className="text-ink-dim mb-8">
                    {artist.displayName} will confirm shortly. You&apos;ll find this booking in your dashboard.
                  </p>
                  <div className="glass rounded-2xl p-5 mb-6 text-left">
                    <Row label="Service" value={service.name} />
                    <Row label="With" value={artist.displayName} />
                    <Row label="When" value={`${date ? formatDateLong(date) : ""} at ${slot}`} />
                    <Row label="Total" value={formatPrice(service.price)} big />
                  </div>
                  <Link href="/dashboard" onClick={reset} className="btn-primary w-full">
                    View my bookings
                  </Link>
                </motion.div>
              )}
            </div>

            {step < 4 && (
              <div className="p-5 border-t border-border shrink-0 flex gap-3">
                {step > 1 && (
                  <button onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))} className="btn-ghost">
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={() => {
                      if (step === 1 && service) setStep(2);
                      else if (step === 2 && date && slot) setStep(3);
                    }}
                    disabled={step === 2 && (!date || !slot)}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={confirm}
                    disabled={loading || !user || !address}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={14} /> Confirm booking</>}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-dim text-xs uppercase tracking-wider">{label}</span>
      <span className={big ? "font-display text-xl text-gradient-rose" : "text-ink font-medium"}>{value}</span>
    </div>
  );
}
