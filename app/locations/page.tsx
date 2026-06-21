"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, Search, Truck, ChevronRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

const LOCATIONS = [
  {
    name: "Downtown",
    address: "42 Market Square, Financial District",
    phone: "+1 (555) 100-2222",
    hours: "10:00am – 12:00am",
    wait: "15 min",
    status: "open",
    statusLabel: "Open Now",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Westside",
    address: "18 Palm Avenue, West End",
    phone: "+1 (555) 200-3333",
    hours: "11:00am – 11:00pm",
    wait: "20 min",
    status: "busy",
    statusLabel: "Busy",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Airport",
    address: "Terminal B, Gate 7, Int'l Airport",
    phone: "+1 (555) 300-4444",
    hours: "11:00am – 11:00pm",
    wait: "10 min",
    status: "open",
    statusLabel: "Open Now",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "University District",
    address: "3 Campus Drive, University Hub",
    phone: "+1 (555) 400-5555",
    hours: "11:00am – 11:00pm",
    wait: "25 min",
    status: "open",
    statusLabel: "Open Now",
    color: "from-green-500 to-emerald-600",
  },
];

export default function LocationsPage() {
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const [nearestResult, setNearestResult] = useState<string | null>(null);

  const filtered = LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  function findNearest() {
    setLocating(true);
    setNearestResult(null);
    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          setLocating(false);
          setNearestResult("Downtown");
        }, 1500);
      },
      () => {
        setTimeout(() => {
          setLocating(false);
          setNearestResult("Downtown");
        }, 1500);
      }
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.15),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">
            Find Us
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-5xl sm:text-6xl font-black">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Locations
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-zinc-400 text-lg mt-4">
            4 locations across the city. Always close, always hot.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search locations…"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <AnimatedButton onClick={findNearest} loading={locating} className="whitespace-nowrap">
              <Navigation className="w-4 h-4" />
              Find Nearest
            </AnimatedButton>
          </motion.div>

          <AnimatePresence>
            {nearestResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm"
              >
                <MapPin className="w-4 h-4" />
                Nearest location: <strong>{nearestResult}</strong> (0.8 mi away)
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-12 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {filtered.map((loc, i) => (
                <motion.div
                  key={loc.name}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-3xl overflow-hidden transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{loc.name}</h3>
                        <p className="text-zinc-400 text-sm mt-0.5">{loc.address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${loc.color}`}>
                        {loc.statusLabel}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-zinc-300">{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-zinc-300">{loc.hours}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Truck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-zinc-300">Est. wait: <span className="text-orange-400 font-medium">{loc.wait}</span></span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <a href="#" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                          <Navigation className="w-4 h-4" />
                          Get Directions
                        </button>
                      </a>
                      <a href="tel:+15551002222">
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold rounded-xl hover:border-orange-500/40 transition-all">
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 text-center py-16 text-zinc-500">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No locations found for &quot;{search}&quot;</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Delivery Radius */}
      <section className="py-12 bg-zinc-900 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 bg-zinc-950 border border-orange-500/20 rounded-3xl">
            <Truck className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Delivery Coverage</h3>
            <p className="text-zinc-400 leading-relaxed">
              We deliver within <span className="text-orange-400 font-bold">5 miles</span> of each location.
              Order by <span className="text-orange-400 font-bold">10:30pm</span> for guaranteed same-day delivery.
              Track your order live from the moment it leaves our kitchen.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              {["Downtown", "Westside", "Airport", "University District"].map((l) => (
                <span key={l} className="flex items-center gap-1.5 text-sm text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />{l}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
