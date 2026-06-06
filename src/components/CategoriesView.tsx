/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowRight, Sparkles, Shield, User, Droplets, Layers } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";

interface CategoriesViewProps {
  onSelectCategory: (cat: string) => void;
  onNavigate: (tabId: string) => void;
}

export default function CategoriesView({
  onSelectCategory,
  onNavigate,
}: CategoriesViewProps) {
  const { products } = useFirebase();
  
  const categoryBlocks = [
    {
      id: "exterior",
      title: "Exterior Care",
      icon: "✨",
      desc: "pH-neutral compounds, color-changing iron indicators, hydrophobic sealants, and thick snow foam shampoos.",
      benefit: "Retains paint clearcoat life and gives an intense deep wet-look shine.",
      count: products.filter((p) => p.category === "exterior").length,
      leadProducts: ["HydroGloss Wax", "Ultra-Suds Soap", "Apex Iron Remover"],
    },
    {
      id: "interior",
      title: "Interior Detail",
      icon: "💺",
      desc: "Non-greasy satin protectors, real leaf and beeswax leather conditioners, matte console dust repellants.",
      benefit: "Safeguards steerings and seats from broad SPF sun heat cracks.",
      count: products.filter((p) => p.category === "interior").length,
      leadProducts: ["Interior Revive", "Leather Nourish Organic"],
    },
    {
      id: "ceramic",
      title: "Ceramic Coatings",
      icon: "🛡️",
      desc: "Nano silica SiO2 liquid kits, high Mohs hardness shield bonds, quick gloss amplifiers.",
      benefit: "Up to 24 months of defense with heavy self-cleaning chemical proof.",
      count: products.filter((p) => p.category === "ceramic").length,
      leadProducts: ["Nano Shield Kit 9H+", "Supreme Slick Detailer"],
    },
    {
      id: "accessories",
      title: "Accessories",
      icon: "🧼",
      desc: "Plush Korean-weave split edgeless towels, rigid bucket radial grit guard columns, and premium clay bars.",
      benefit: "Eliminates microscopic swirl scratches on soft clearcoats.",
      count: products.filter((p) => p.category === "accessories").length,
      leadProducts: ["Edgeless Towels", "Tornado Grit Guard", "Apex Clay Kit"],
    },
  ];

  const handleSelect = (catId: string) => {
    onSelectCategory(catId);
    onNavigate("shop");
  };

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
          CATEGORIZED BLENDS
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Shop by Formulated Category
        </h2>
        <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
          Choose a targeted detailing system designed to restore paint, sanitize dashboards, or lock premium defensive shields.
        </p>
      </div>

      {/* Structured Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {categoryBlocks.map((c) => (
          <div
            key={c.id}
            className="group block bg-card-bg border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-electric-blue/30 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden"
          >
            {/* Visual shine */}
            <div className="absolute -right-10 -top-10 h-28 w-28 bg-electric-blue/5 rounded-full blur-2xl group-hover:bg-electric-blue/10 transition-colors" />

            <div className="flex justify-between items-start mb-6">
              <div className="text-5xl select-none bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {c.icon}
              </div>
              <span className="font-mono text-xs text-gray-500 font-bold bg-white/5 px-2.5 py-1 rounded-lg">
                {c.count} FORMULAS
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-electric-blue transition-colors">
                {c.title}
              </h3>
              
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                {c.desc}
              </p>

              {/* Specific benefits info box */}
              <div className="bg-dark-bg/60 border border-white/5 p-3.5 rounded-xl text-xs font-sans text-gray-300/90 leading-normal">
                <strong className="text-electric-blue font-bold">CORE VALUE:</strong> {c.benefit}
              </div>

              {/* Sample products items bullet lines */}
              <div className="space-y-1.5 pt-2">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                  KEY OFFERINGS
                </span>
                <div className="flex flex-wrap gap-2">
                  {c.leadProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nav Action */}
              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => handleSelect(c.id)}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-electric-blue hover:text-dark-bg text-electric-blue hover:border-transparent transition-all duration-300 font-extrabold uppercase tracking-widest text-xs py-2.5 px-5 rounded-xl border border-white/5 cursor-pointer group-hover:-translate-y-0.5"
                >
                  Configure Detailing Prep
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
