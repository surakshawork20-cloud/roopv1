"use client";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Verified Artists" },
  { icon: Calendar, value: "12K+", label: "Bookings Completed" },
  { icon: MapPin, value: "24", label: "Cities Covered" },
  { icon: Award, value: "4.9", label: "Avg. Rating" },
];

export function Stats() {
  return (
    <section className="py-16 lg:py-20 border-y border-border bg-gradient-to-b from-transparent via-surface/30 to-transparent">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center lg:text-left p-4"
            >
              <div className="flex items-center justify-center lg:justify-start mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-plum to-surface-2 border border-border-strong flex items-center justify-center">
                  <s.icon size={18} className="text-gold" />
                </div>
              </div>
              <div className="font-display text-4xl lg:text-5xl text-gradient-rose">
                {s.value}
              </div>
              <div className="text-sm text-ink-dim mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
