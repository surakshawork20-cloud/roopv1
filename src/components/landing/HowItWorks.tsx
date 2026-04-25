"use client";
import { motion } from "framer-motion";
import { Search, Calendar, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Discover your Artist",
    text: "Filter by style, city, budget, and availability. Every profile is verified, with real portfolios and honest reviews.",
  },
  {
    num: "02",
    icon: Calendar,
    title: "Book in a tap",
    text: "Pick a service, choose a date, confirm the time slot. Secure your spot — at home or at their studio.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Show up stunning",
    text: "The Artist arrives ready. You relax, transform, and leave feeling like the most beautiful version of yourself.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="chip mx-auto mb-5">
            <Sparkles size={12} className="text-gold" />
            How it works
          </div>
          <h2 className="font-display text-5xl lg:text-7xl leading-[0.95]">
            Booking beauty,
            <br />
            <span className="italic text-gradient-primary">reinvented.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-8 lg:p-10 h-full hover:border-gold/40 transition-colors">
                <div className="flex items-center justify-between mb-8">
                  <div className="font-display text-6xl text-gradient-rose opacity-80">
                    {step.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-plum to-surface-2 border border-gold/20 flex items-center justify-center">
                    <step.icon size={22} className="text-gold" />
                  </div>
                </div>
                <h3 className="font-display text-3xl mb-3">{step.title}</h3>
                <p className="text-ink-dim leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
