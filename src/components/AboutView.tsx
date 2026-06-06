/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Award, CheckCircle, Shield, Clock, ShieldAlert } from "lucide-react";
import { TIPS } from "../data";

export default function AboutView() {
  const [selectedTipId, setSelectedTipId] = useState<number>(1);

  const activeTip = TIPS.find((t) => t.id === selectedTipId) || TIPS[0];

  const valuePillars = [
    {
      icon: <Award className="w-5 h-5 text-electric-blue" />,
      title: "Doctorate Formulated",
      desc: "Our auto chemists hold Ph.D. degrees in polymer science, refining silica molecules specifically for modern clearcoats.",
    },
    {
      icon: <Shield className="w-5 h-5 text-midnight-blue" />,
      title: "100% Acid-Polymer Safe",
      desc: "Guaranteed neutral pH formulas. Rest assured our compounds will never leach, blur, cloud, or etch existing coatings.",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-electric-blue" />,
      title: "30-Day Money Back",
      desc: "We stand behind our chemical excellence. If you don't achieve a mirror wet-look gloss, return the bottle for a full refund.",
    },
  ];

  return (
    <div className="space-y-20 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. BRAND STORY & INTRODUCTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Story Text */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
            WHO WE ARE
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Designed for Perfection, <br />
            <span className="bg-gradient-to-r from-electric-blue via-cyan-400 to-white bg-clip-text text-transparent">
              Engineered for Detailers
            </span>
          </h2>
          <p className="text-base text-gray-300 leading-relaxed font-sans">
            Born out of general disgust for cheap, slimy silicone-based car dressings and waxes that wash off during the first rain, iDETAIL was established in Cape Town, South Africa by professional surface engineers. 
          </p>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Our mission is simple: provide professional-grade detailing chemicals, true SiO2 quartz formulas, and edgeless buffing tools that standard retail shops hide behind massive pricing tiers. For weekend enthusiasts and master detailing shops alike, we deliver structural paint protection that persists in weather, grease, and sun.
          </p>
        </div>

        {/* Right Guarantee visual element */}
        <div className="lg:col-span-5 bg-card-bg/50 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Accent light glow */}
          <div className="absolute right-0 top-0 h-28 w-28 bg-electric-blue/5 rounded-full blur-2xl" />

          <span className="block font-mono text-[10px] text-electric-blue font-extrabold tracking-widest uppercase mb-4">
            OUR LAB CORE PROMISES
          </span>

          <div className="space-y-6">
            {valuePillars.map((p, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  {p.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-white">{p.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE ACADEMY / DETAILING TIPS SECTION */}
      <section className="bg-card-bg/40 border border-white/5 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Tutorial selection left rail */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase flex items-center gap-1.5 font-mono">
                <BookOpen className="w-4 h-4" />
                DETAILING ACADEMY
              </span>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                Pristine Car Care Procedures
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Follow our step-by-step structural detail guides designed by professional painters to achieve zero-swirl finishes.
              </p>
            </div>

            {/* Selection buttons */}
            <div className="space-y-3 pt-3">
              {TIPS.map((tip) => (
                <button
                  key={tip.id}
                  onClick={() => setSelectedTipId(tip.id)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold uppercase font-mono tracking-wider transition-all duration-300 cursor-pointer flex justify-between items-center ${
                    selectedTipId === tip.id
                      ? "bg-electric-blue/10 border-electric-blue text-electric-blue"
                      : "bg-transparent border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <span className="truncate">{tip.title}</span>
                  <span className="text-[10px] text-electric-blue font-bold tracking-widest shrink-0 ml-2">
                    {tip.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial steps detail panel active view */}
          <div className="lg:col-span-8 bg-dark-bg/60 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
              <div>
                <span className="text-[9px] font-mono text-electric-blue font-bold tracking-widest uppercase">
                  {activeTip.category} GUIDE
                </span>
                <h4 className="font-display font-bold text-lg text-white mt-1">
                  {activeTip.title}
                </h4>
              </div>

              {/* Badges container */}
              <div className="flex gap-2 items-center shrink-0">
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-electric-blue" />
                  {activeTip.duration}
                </span>
                <span className="text-[10px] font-mono font-bold text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg">
                  {activeTip.difficulty} LEVEL
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 italic">
              "{activeTip.description}"
            </p>

            {/* Stepper dynamic timeline list */}
            <div className="space-y-5">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                APPLICATION TIMELINE
              </span>

              <div className="space-y-5">
                {activeTip.steps.map((stepText, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative">
                    {/* Index pointer indicator */}
                    <div className="relative z-10 w-6 h-6 rounded-full bg-electric-blue/15 border border-electric-blue/40 text-electric-blue font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    
                    <p className="text-xs text-gray-300 font-sans leading-relaxed pt-0.5">
                      {stepText}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-1.5 items-center text-[10px] text-gray-500 font-sans">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Always wear nitrile safety gloves during paint decontamination and SiO2 quartz coatings.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
