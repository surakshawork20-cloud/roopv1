"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Bridal",
    desc: "From sangeet to the big day — crafted looks that last 12+ hours.",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&h=1200&fit=crop",
    accent: "from-rose/70 via-plum/60 to-bg",
    count: "180+ Artists",
  },
  {
    name: "Party & Glam",
    desc: "Birthday, cocktail, date night — show up like the main character.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&h=1200&fit=crop",
    accent: "from-violet/70 via-plum/60 to-bg",
    count: "240+ Artists",
  },
  {
    name: "Editorial & HD",
    desc: "Lookbooks, campaigns, magazine covers. Camera-ready artistry.",
    img: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=900&h=1200&fit=crop",
    accent: "from-gold/70 via-amber/50 to-bg",
    count: "90+ Artists",
  },
  {
    name: "Men's Grooming",
    desc: "Wedding looks, beard sculpting, grooms-to-be. Yes, you deserve this.",
    img: "https://images.unsplash.com/photo-1581992652564-44c42f5ad3ad?w=900&h=1200&fit=crop",
    accent: "from-emerald/70 via-teal/50 to-bg",
    count: "65+ Artists",
  },
  {
    name: "Hair & Style",
    desc: "Blowouts, updos, color, extensions — the full crown treatment.",
    img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&h=1200&fit=crop",
    accent: "from-ruby/70 via-wine/50 to-bg",
    count: "320+ Artists",
  },
  {
    name: "SFX & Artistic",
    desc: "Fashion week, film, theatre, avant-garde. Where art meets skin.",
    img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=900&h=1200&fit=crop",
    accent: "from-violet/70 via-ruby/60 to-bg",
    count: "40+ Artists",
  },
];

export function ServiceCategories() {
  return (
    <section className="py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div>
            <div className="chip mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Services
            </div>
            <h2 className="font-display text-5xl lg:text-7xl leading-[0.95]">
              Every kind of <span className="italic text-gradient-primary">beautiful</span>,
              <br />
              for every kind of moment.
            </h2>
          </div>
          <Link href="/services" className="btn-ghost group shrink-0">
            View all services
            <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href={`/discover?category=${encodeURIComponent(c.name)}`}
                className="block group relative rounded-3xl overflow-hidden aspect-[4/5] border border-border"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

                <div className="absolute top-5 right-5">
                  <div className="chip bg-bg/40 backdrop-blur-sm">{c.count}</div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <h3 className="font-display text-4xl lg:text-5xl mb-2 group-hover:translate-x-1 transition-transform">
                    {c.name}
                  </h3>
                  <p className="text-ink-dim text-sm max-w-xs leading-relaxed">{c.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Artists <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
