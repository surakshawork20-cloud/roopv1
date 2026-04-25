import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata = { title: "Services — Roop" };

const services = [
  {
    name: "Bridal",
    desc: "The most meaningful day of your life deserves an Artist who listens, plans, and shows up ready. From intimate sangeets to grand ceremonies.",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=900&fit=crop",
    price: "from ₹8,000",
    sessions: ["Trial & Planning", "Sangeet & Mehndi", "Wedding Day", "Reception Look"],
  },
  {
    name: "Party & Glam",
    desc: "Birthdays, cocktails, nights out — whenever you want to walk in and own the room. Dewy skin, sculpted features, fearless looks.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=900&fit=crop",
    price: "from ₹4,500",
    sessions: ["Evening Glam", "Cocktail Looks", "Birthday Ready", "Night Out"],
  },
  {
    name: "Editorial & HD",
    desc: "Camera-ready, magazine-perfect, high-definition artistry. For lookbooks, campaigns, covers, and personal portfolios that last.",
    img: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=1200&h=900&fit=crop",
    price: "from ₹10,000",
    sessions: ["Editorial Shoots", "Campaign Work", "Personal Portfolio", "Commercial"],
  },
  {
    name: "Men's Grooming",
    desc: "Grooms, grooming for ceremonies, board meetings, and everything in between. Skin, beard, hair — done with intention.",
    img: "https://images.unsplash.com/photo-1581992652564-44c42f5ad3ad?w=1200&h=900&fit=crop",
    price: "from ₹3,500",
    sessions: ["Groom Package", "Beard Sculpt", "Event Ready", "Shoot Prep"],
  },
  {
    name: "Hair & Style",
    desc: "The crown that crowns your crown. Color, cuts, blowouts, bridal updos, extensions — all forms of hair magic.",
    img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&h=900&fit=crop",
    price: "from ₹2,500",
    sessions: ["Blowout", "Color & Gloss", "Bridal Hair", "Special Occasions"],
  },
  {
    name: "SFX & Artistic",
    desc: "Fashion week, theatre, film, experimental. When the work is less about prettiness and more about art.",
    img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1200&h=900&fit=crop",
    price: "from ₹12,000",
    sessions: ["Runway", "Film & TV", "Avant-garde", "Theatrical"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 text-center">
          <h1 className="font-display text-6xl lg:text-8xl leading-[0.95] mb-6">
            Every kind of
            <br /><span className="italic text-gradient-primary">beautiful.</span>
          </h1>
          <p className="text-lg text-ink-dim max-w-xl mx-auto">
            Every Artist, every style, every occasion. Curated categories to help you find exactly what you&apos;re after.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 space-y-16 lg:space-y-24">
          {services.map((s, i) => (
            <div key={s.name} className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 ? "lg:grid-flow-dense" : ""}`}>
              <div className={`${i % 2 ? "lg:col-start-2" : ""}`}>
                <div className="text-xs uppercase tracking-widest text-gold mb-3">{s.price}</div>
                <h2 className="font-display text-5xl lg:text-7xl leading-[0.95] mb-5">{s.name}</h2>
                <p className="text-ink-dim text-lg mb-8 leading-relaxed max-w-xl">{s.desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {s.sessions.map((sess) => (
                    <span key={sess} className="chip">{sess}</span>
                  ))}
                </div>
                <Link href={`/discover?category=${encodeURIComponent(s.name)}`} className="btn-primary shine group">
                  Browse {s.name} Artists
                  <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
                </Link>
              </div>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-border">
                <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
