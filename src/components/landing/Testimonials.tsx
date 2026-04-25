"use client";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I booked three trials, found Meher in a morning, and walked down the aisle feeling like a dream. Roop made the most stressful decision of my wedding actually fun.",
    name: "Priya Sharma",
    role: "Bride · Bengaluru",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    quote:
      "As an Artist, I&apos;ve tripled my bookings in three months. The dashboard shows me exactly what&apos;s working. Clients show up knowing my style already.",
    name: "Ananya Kapoor",
    role: "Artist · Mumbai",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  },
  {
    quote:
      "Booked a grooming Artist for my wedding day and my photos look unreal. Didn&apos;t even know men could use a platform like this — glad I found it.",
    name: "Rohan Mehta",
    role: "Groom · Delhi",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-36 bg-gradient-to-b from-transparent via-surface/30 to-transparent">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-14">
          <div>
            <div className="chip mb-4">
              <Quote size={10} />
              Love notes
            </div>
            <h2 className="font-display text-5xl lg:text-7xl leading-[0.95]">
              Real people.
              <br />
              <span className="italic text-gradient-rose">Real glow-ups.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass rounded-3xl p-8 hover:border-gold/30 transition-colors relative"
            >
              <Quote size={32} className="text-gold/40 mb-4" />
              <p className="text-ink leading-relaxed mb-6 font-display text-lg italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img src={t.img} alt="" className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-ink-dim">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
