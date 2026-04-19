import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Users, ArrowRight } from "lucide-react";

export const metadata = { title: "About — Roop" };

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/3 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center">
          <div className="chip mx-auto mb-6"><Sparkles size={12} className="text-gold" /> Our story</div>
          <h1 className="font-display text-6xl lg:text-8xl leading-[0.95] mb-6">
            We&apos;re building<br />
            <span className="italic text-gradient-primary">beauty&apos;s best marketplace.</span>
          </h1>
          <p className="text-lg text-ink-dim max-w-2xl mx-auto leading-relaxed">
            Because the people behind your most beautiful moments deserve more than DMs and spreadsheets — and you deserve more than guesswork.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-square border border-border">
            <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000&h=1000&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-plum/40 to-transparent" />
          </div>
          <div>
            <h2 className="font-display text-4xl lg:text-5xl mb-5">Why Roop</h2>
            <p className="text-ink-dim mb-4 leading-relaxed">
              We started Roop because booking a makeup artist in India shouldn&apos;t feel like a treasure hunt. Not for clients. Not for artists.
            </p>
            <p className="text-ink-dim mb-4 leading-relaxed">
              Every artist you see here is verified. Every portfolio is real. Every review is from a completed booking. No fakes, no filters, no bots.
            </p>
            <p className="text-ink-dim leading-relaxed">
              Our artists keep a larger share of what they earn than anywhere else. Our clients get transparent pricing, no hidden fees, and a calendar you actually control.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-transparent via-surface/30 to-transparent border-y border-border">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <h2 className="font-display text-4xl lg:text-5xl text-center mb-14">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Artistry first", text: "We&apos;re a platform for artists, not a content farm. Your work gets the stage it deserves." },
              { icon: ShieldCheck, title: "Trust, always", text: "Verified artists. Verified clients. Verified bookings. No games." },
              { icon: Users, title: "Community", text: "Built with real artists across India. Every feature tested with real users." },
            ].map((v) => (
              <div key={v.title} className="glass rounded-3xl p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display text-2xl mb-2">{v.title}</h3>
                <p className="text-ink-dim text-sm" dangerouslySetInnerHTML={{ __html: v.text }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="font-display text-5xl lg:text-6xl mb-6">Join us.</h2>
          <p className="text-ink-dim mb-8 max-w-lg mx-auto">
            Whether you&apos;re looking for the perfect artist or you are one, there&apos;s a place for you here.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/discover" className="btn-primary shine">Find an artist <ArrowRight size={16} /></Link>
            <Link href="/for-artists" className="btn-ghost">Join as artist</Link>
          </div>
        </div>
      </section>
    </>
  );
}
