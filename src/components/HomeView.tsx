/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, ArrowRight, Shield, Award, Droplet, Star, CheckCircle, HelpCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import { useFirebase } from "../context/FirebaseContext";
import { TESTIMONIALS, FAQS } from "../data";
import heroBg from "../assets/images/detailing_hero_new_1780495259509.png";

interface HomeViewProps {
  onNavigate: (tabId: string) => void;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function HomeView({ onNavigate, onSelectCategory, onAddToCart }: HomeViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const { products } = useFirebase();

  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("product", product.id.toString());
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const pillars = [
    {
      icon: <Droplet className="w-6 h-6 text-electric-blue" />,
      title: "Hydrophobic Quartz Layering",
      desc: "Lighter SiO2 molecules bond permanently into clearcoat pores, leaving water droplets with zero anchor hold.",
    },
    {
      icon: <Shield className="w-6 h-6 text-midnight-blue" />,
      title: "Broad Range Chemical Shielding",
      desc: "Resist severe tree sap, caustic iron fallout, alkaline bird drop marks, and direct ultraviolet clearcoat baking.",
    },
    {
      icon: <Award className="w-6 h-6 text-electric-blue" />,
      title: "Professional Grade Certified Quality",
      desc: "Our detailing chemists refine, test, and approve each batch with premium components for classic and modern paint systems.",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes("@")) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
    }
  };

  const selectCat = (catId: string) => {
    onSelectCategory(catId);
    onNavigate("shop");
  };

  return (
    <div className="space-y-24">
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 py-24 px-4 sm:px-6">
        {/* Immersive Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Premium Detailing Performance"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.3] contrast-[1.15]"
            referrerPolicy="no-referrer"
          />
          {/* Gradients blending into the visual panel themes */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/70 via-transparent to-dark-bg/70" />
          
          {/* Subtle colored spotlight globs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-midnight-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 h-56 w-56 bg-electric-blue/15 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-electric-blue uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
            ENGINEERED AUTOMOTIVE SHINE & SHIELD
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-white text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight"
          >
            REFLECT YOUR <br />
            <span className="bg-gradient-to-r from-midnight-blue via-indigo-400 to-electric-blue bg-clip-text text-transparent drop-shadow-sm">
              PASSION
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            The premium catalog of chemical formulations and detailing tools for professional detailers and enthusiasts. Drive a car that mirrors perfection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigate("shop")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-midnight-blue hover:bg-electric-blue hover:text-dark-bg text-white font-extrabold text-sm py-4 px-8 rounded-xl shadow-lg shadow-midnight-blue/10 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            >
              Explore Shop
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold text-sm py-4 px-8 rounded-xl border border-white/5 transition-all cursor-pointer"
            >
              Learn Detailing Specs
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. THE BRAND PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
            WHY iDETAIL
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Pioneering Surface Protection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-card-bg/40 border border-white/5 rounded-2xl p-6 hover:border-electric-blue/20 transition-all duration-300 backdrop-blur-xs flex flex-col items-start gap-4"
            >
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 shrink-0">
                {pillar.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-white text-lg">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-400 font-normal leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUICK CHOOSE CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card-bg/60 border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-md">
          {/* Subtle details */}
          <div className="absolute right-0 bottom-0 h-40 w-40 bg-midnight-blue/5 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4 text-left">
              <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase font-mono">
                FLUID COLLECTIONS
              </span>
              <h3 className="font-display font-bold text-3xl text-white tracking-tight">
                Shop formulated categories
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Tailored molecular blends targeting dashboards, clearcoat, glass, and microfiber buffing cloths.
              </p>
              <button
                onClick={() => selectCat("all")}
                className="inline-flex items-center gap-1.5 font-bold text-xs uppercase text-electric-blue hover:text-white transition-colors cursor-pointer"
              >
                View all formulations
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => selectCat("exterior")}
                className="group relative cursor-pointer border border-white/5 hover:border-electric-blue/40 bg-dark-bg/50 hover:bg-dark-bg rounded-2xl p-6 transition-all duration-300 flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">01 / EXTERIOR PREP</span>
                  <h4 className="font-display font-extrabold text-lg text-white mt-1 group-hover:text-electric-blue transition-colors">
                    Exterior Care
                  </h4>
                </div>
                <span className="text-3xl select-none group-hover:scale-110 transition-transform">✨</span>
              </div>

              <div
                onClick={() => selectCat("interior")}
                className="group relative cursor-pointer border border-white/5 hover:border-electric-blue/40 bg-dark-bg/50 hover:bg-dark-bg rounded-2xl p-6 transition-all duration-300 flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">02 / INTERIOR SANITATION</span>
                  <h4 className="font-display font-extrabold text-lg text-white mt-1 group-hover:text-electric-blue transition-colors">
                    Interior Detail
                  </h4>
                </div>
                <span className="text-3xl select-none group-hover:scale-110 transition-transform">💺</span>
              </div>

              <div
                onClick={() => selectCat("ceramic")}
                className="group relative cursor-pointer border border-white/5 hover:border-electric-blue/40 bg-dark-bg/50 hover:bg-dark-bg rounded-2xl p-6 transition-all duration-300 flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">03 / QUARTZ DEFENSE</span>
                  <h4 className="font-display font-extrabold text-lg text-white mt-1 group-hover:text-electric-blue transition-colors">
                    Ceramic Coatings
                  </h4>
                </div>
                <span className="text-3xl select-none group-hover:scale-110 transition-transform">🛡️</span>
              </div>

              <div
                onClick={() => selectCat("accessories")}
                className="group relative cursor-pointer border border-white/5 hover:border-electric-blue/40 bg-dark-bg/50 hover:bg-dark-bg rounded-2xl p-6 transition-all duration-300 flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">04 / BUFFING TOOLS</span>
                  <h4 className="font-display font-extrabold text-lg text-white mt-1 group-hover:text-electric-blue transition-colors">
                    Accessories
                  </h4>
                </div>
                <span className="text-3xl select-none group-hover:scale-110 transition-transform">🧼</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHOSEN FEATURES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
              SPOTLIGHT PRODUCTS
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Signature Formulations
            </h2>
          </div>
          <button
            onClick={() => onNavigate("shop")}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 px-5 rounded-xl border border-white/5 transition-all duration-300 cursor-pointer"
          >
            Show Catalog
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={(e) => handleProductClick(product, e)}
              className="bg-card-bg/40 border border-white/5 rounded-2xl p-5 hover:border-electric-blue/30 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-extrabold tracking-widest text-electric-blue uppercase bg-electric-blue/10 px-2.5 py-1 rounded-full">
                    {product.categoryLabel}
                  </span>
                  <span className="text-xs font-mono text-gray-500">{product.size}</span>
                </div>
                <div className="h-40 rounded-xl bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-5xl mb-4 overflow-hidden relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="select-none">{product.icon}</span>
                  )}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1.5 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center text-yellow-500 gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-gray-300">{product.rating}</span>
                  <span className="text-[11px] text-gray-500">({product.reviewsCount} reviews)</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                <span className="text-lg font-extrabold font-mono text-electric-blue">
                  R {product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      window.open(`${window.location.origin}${window.location.pathname}?product=${product.id}`, "_blank");
                    }}
                    className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                    title="Open full spec sheet in a new window"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-midnight-blue hover:bg-electric-blue hover:text-dark-bg text-white font-bold text-[11px] py-1.5 px-3 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIAL CARDBOARDS */}
      <section className="bg-gradient-to-b from-transparent to-card-bg/20 py-8 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-display font-bold text-3xl text-white">
              Verified Detailing Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-card-bg/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xs relative space-y-5"
              >
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-gray-300 italic leading-relaxed">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {t.role} • <span className="text-electric-blue">{t.vehicle}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ EXPAND / PANEL */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-16">
          <HelpCircle className="w-8 h-8 text-electric-blue mx-auto" />
          <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
            LEARNING ACADEMY
          </span>
          <h2 className="font-display font-bold text-3xl text-white">
            Detailing Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-card-bg/25 border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full font-display font-medium text-left px-5 py-4 text-sm sm:text-base text-white hover:text-electric-blue transition-colors flex justify-between items-center cursor-pointer"
              >
                <span>{faq.question}</span>
                <span className="text-electric-blue shrink-0 font-bold ml-2 text-lg">
                  {activeFaq === faq.id ? "−" : "+"}
                </span>
              </button>

              {activeFaq === faq.id && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-400 font-sans leading-relaxed border-t border-white/5 bg-black/10">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. PRESTIGE MEMBERS NEWSLETTER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative bg-gradient-to-br from-panel-bg to-card-bg border border-white/10 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
          {/* Neon back circles */}
          <div className="absolute -left-10 -bottom-10 h-32 w-32 bg-electric-blue/10 rounded-full blur-2xl" />

          <div className="max-w-xl mx-auto space-y-6 relative">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Join the iDETAIL Club
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Enter email below to receive detailing tip alerts, advanced wax flash guidelines, product backorder restocking updates, and member-only promotions.
            </p>

            <AnimatePresence mode="wait">
              {!newsletterSubmitted ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="flex-1 bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl px-4 py-3.5 text-xs font-mono uppercase focus:outline-none placeholder-gray-600 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-electric-blue hover:bg-white text-dark-bg font-extrabold text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl transition-all duration-300 shrink-0 cursor-pointer shadow-md"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center justify-center gap-2.5 text-xs animate-fadeIn">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>
                    <strong>SUCCESS:</strong> Welcome to the detail club! Restock updates pending.
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
