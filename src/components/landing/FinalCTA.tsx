"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="pt-8 pb-24 lg:pb-36">
      <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="chip mx-auto mb-6">
            <Sparkles size={12} className="text-gold" />
            Ready when you are
          </div>
          <h2 className="font-display text-5xl lg:text-8xl leading-[0.95]">
            Your <span className="italic text-gradient-primary animate-gradient" style={{
              backgroundImage: "linear-gradient(120deg, var(--gold), var(--rose), var(--violet), var(--gold))",
            }}>next moment</span>
            <br />
            starts here.
          </h2>
          <p className="mt-8 text-lg text-ink-dim max-w-xl mx-auto">
            Thousands of looks, hundreds of artists, one beautiful platform.
            Whatever you&apos;re getting ready for — we&apos;ve got you.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/discover" className="btn-primary shine">
              Find your artist
              <ArrowRight size={16} />
            </Link>
            <Link href="/signup" className="btn-ghost">
              Create free account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
