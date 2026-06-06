/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  Clock, 
  ShieldCheck, 
  Award, 
  Droplet, 
  Cpu, 
  Flame, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DetailingService } from "../types";

interface ServicePamphletModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: DetailingService;
}

export default function ServicePamphletModal({ isOpen, onClose, service }: ServicePamphletModalProps) {
  // Styles of pamphlet to preview: 'dark' (Digital-slate) or 'light' (Ink-saver print)
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    try {
      const isLight = document.documentElement.classList.contains("light") || localStorage.getItem("idetail-theme") === "light";
      return isLight ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  // Keep theme synced when modal opens
  React.useEffect(() => {
    if (isOpen) {
      try {
        const isLight = document.documentElement.classList.contains("light") || localStorage.getItem("idetail-theme") === "light";
        setThemeMode(isLight ? "light" : "dark");
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Render randomized barcode bars for design layout
  const barcodeBars = Array.from({ length: 42 }).map((_, i) => {
    const width = i % 3 === 0 ? "w-[3px]" : i % 5 === 0 ? "w-[1px]" : i % 2 === 0 ? "w-[2px]" : "w-[4px]";
    const gap = i % 4 === 0 ? "mr-[1px]" : i % 7 === 0 ? "mr-[3px]" : "mr-[2px]";
    return { width, gap };
  });

  // Unique spec identifier for realistic feel
  const specNumber = `iDT-SPEC-${service.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Function to download the fully styled offline interactive HTML pamphlet
  const handleDownloadHTML = () => {
    const includesListHTML = service.includes
      .map(
        (inc) => `
        <li class="flex items-start gap-3 text-sm text-slate-700">
          <svg class="w-5 h-5 text-[#00d4ff] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span class="leading-relaxed font-sans">${inc}</span>
        </li>`
      )
      .join("");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iDETAIL Spec Card — ${service.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0c0f14;
      color: #ffffff;
    }
    @media print {
      body {
        background-color: #ffffff !important;
        color: #0f172a !important;
      }
      .no-print {
        display: none !important;
      }
      .print-light-card {
        background: #ffffff !important;
        color: #0f172a !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: none !important;
      }
      .print-blue-text {
        color: #0284c7 !important;
      }
      .print-dark-text {
        color: #0f172a !important;
      }
      .print-muted-text {
        color: #475569 !important;
      }
      .barcode-bar {
        background-color: #0f172a !important;
      }
    }
  </style>
</head>
<body class="min-h-screen py-10 px-4 md:px-8 bg-[#0a0c10]">

  <!-- Top Utilities Bar (Hidden on print) -->
  <div class="max-w-4xl mx-auto mb-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
    <div class="flex items-center gap-3">
      <span class="text-2xl">📄</span>
      <div>
        <h2 class="text-sm font-bold text-white font-display">Offline Detailing Specification Pamphlet</h2>
        <p class="text-xs text-slate-400">This self-contained document belongs to you. Keep it offline or print/save as PDF.</p>
      </div>
    </div>
    
    <div class="flex gap-2 shrink-0">
      <button onclick="window.print()" class="bg-[#00d4ff] hover:bg-white text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center gap-2 uppercase tracking-wider font-display">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        Print / PDF
      </button>
    </div>
  </div>

  <!-- Real-life pamphlet (Format layout tailored for screen & A4 print-matching) -->
  <main class="max-w-4xl mx-auto bg-white text-[#0f172a] rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden print-light-card border border-slate-200">
    
    <!-- Design side-borders/decorations -->
    <div class="absolute left-0 top-0 bottom-0 w-2.5 bg-[#00d4ff]"></div>
    
    <!-- Front Header Segment -->
    <header class="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b-2 border-dashed border-slate-200 mb-8">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2.5 py-1 text-[9px] font-mono font-bold uppercase bg-slate-900 text-[#00d4ff] rounded tracking-wider">Mobile Lab Dispatch</span>
          <span class="text-[9px] font-mono text-slate-500 font-semibold">${specNumber}</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-black font-display text-slate-900 tracking-tight leading-none">${service.name}</h1>
        <p class="text-sm font-medium text-[#0284c7] mt-1 pr-6 max-w-xl font-display uppercase tracking-wider">iDETAIL Premium Mobile Labs — Technical Specification Card</p>
      </div>

      <div class="text-left md:text-right shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-5 min-w-[200px]">
        <span class="block text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">MOBILE BASE PRICE</span>
        <span class="text-3xl font-black font-mono text-[#0284c7]">R ${service.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
        <div class="flex items-center gap-1.5 justify-start md:justify-end mt-2 text-xs font-mono text-slate-500 font-medium">
          <span>🕒 DURATION:</span>
          <span class="font-bold text-slate-800">${service.duration}</span>
        </div>
      </div>
    </header>

    <!-- Mid Section grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
      
      <!-- Primary Core Specifications -->
      <section class="lg:col-span-7 space-y-6">
        <div>
          <h3 class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2.5">01 // Treatment Synopsis</h3>
          <p class="text-sm text-slate-600 leading-relaxed font-sans font-medium">
            ${service.description}
          </p>
        </div>

        <div>
          <h3 class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>02 // Full Operational Inclusions</span>
          </h3>
          <ul class="space-y-3.5 pl-0">
            ${includesListHTML}
          </ul>
        </div>
      </section>

      <!-- Right Column: Lab Guarantee & Barcode Stamp -->
      <section class="lg:col-span-5 space-y-6">
        
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
          <h4 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-2">
            <span>🛠️ iDETAIL MOBILE LAB PLATFORM</span>
          </h4>
          <div class="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <span class="block text-[9px] font-mono text-slate-400 uppercase font-semibold">DI WATER SPEC</span>
              <span class="font-bold text-slate-800 font-mono">0 TDS (Ultra Pure)</span>
            </div>
            <div>
              <span class="block text-[9px] font-mono text-slate-400 uppercase font-semibold">POWER INDEPENDENCE</span>
              <span class="font-bold text-slate-800">100% Onboard</span>
            </div>
            <div>
              <span class="block text-[9px] font-mono text-slate-400 uppercase font-semibold">OPERATOR PROFILE</span>
              <span class="font-bold text-slate-800">Certified S.A. Master</span>
            </div>
            <div>
              <span class="block text-[9px] font-mono text-slate-400 uppercase font-semibold">LIABILITY BORDER</span>
              <span class="font-bold text-emerald-600">R5m Full Risk Cover</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
          <h4 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-widest">📝 RECOMMENDED USE-PROFILE</h4>
          <p class="text-xs text-slate-600 leading-relaxed font-sans font-medium">
            ${service.recommendedFor}
          </p>
        </div>

        <!-- Authorized Sign-Off block -->
        <div class="border border-slate-200 rounded-2xl p-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="border-b border-slate-300 pb-1 mt-4">
              <span class="block text-[8px] font-mono text-slate-400 uppercase">TECHNICIAN FIELD DISPATCHER</span>
            </div>
            <div class="border-b border-slate-300 pb-1 mt-4">
              <span class="block text-[8px] font-mono text-slate-400 uppercase">CLIENT AUTHORIZATION</span>
            </div>
          </div>
          <p class="text-[8.5px] text-slate-400 leading-tight font-sans">
            By signing above, both parties verify the vehicle thick-meter inspection completed prior to mobile operation startup.
          </p>
        </div>

      </section>

    </div>

    <!-- Voucher/Authentics Footer -->
    <footer class="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
      
      <!-- Brand & QR block -->
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 bg-[#0c0f14] rounded-lg text-lg flex items-center justify-center font-display text-white select-none shrink-0 font-black">
          iD
        </div>
        <div>
          <h4 class="text-xs font-bold font-display text-slate-900 uppercase">iDETAIL On-Site Mobile Labs</h4>
          <p class="text-[9px] font-mono text-slate-400 uppercase tracking-wider">South Africa's Smart Detailing Franchise</p>
        </div>
      </div>

      <!-- Real CSS Barcode for realism -->
      <div class="flex flex-col items-center sm:items-end">
        <div class="flex items-end h-8 h-9 overflow-hidden max-w-[170px]">
          ${barcodeBars
            .map(
              (bar) =>
                `<div class="${bar.width} ${bar.gap} h-full bg-slate-900 barcode-bar"></div>`
            )
            .join("")}
        </div>
        <span class="text-[8px] font-mono text-slate-500 font-bold tracking-[0.25em] mt-1">${specNumber}</span>
      </div>

    </footer>

  </main>

  <footer class="text-center py-10 text-[10px] text-slate-500 font-mono no-print">
    iDETAIL MOBILE VEHICLE INTELLECTS © 2026. ALL SPECIFICATION STANDARDS LICENSED WITH NANO-COAT S.A.
  </footer>

</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Flyer_${service.name.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Perform standard browser printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* 1. Backdrop overlay */}
      <AnimatePresence>
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center overflow-y-auto px-4 py-8 select-none"
        >
          {/* Prevent close on container click */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#0d1015] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative select-text"
          >
            {/* Modal sticky utilities row */}
            <div className="bg-[#12161f]/90 border-b border-white/5 py-4 px-6 md:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="font-display font-black text-white text-base leading-none">
                    Services Spec Card
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-1">
                    Ready to download or print/save
                  </p>
                </div>
              </div>

              {/* Utility Action Buttons */}
              <div className="flex items-center gap-2 text-xs">
                {/* Theme toggle preview mode */}
                <div className="flex border border-white/10 rounded-xl overflow-hidden p-0.5 bg-dark-bg/85 font-mono text-[9px] mr-2">
                  <button 
                    onClick={() => setThemeMode("dark")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      themeMode === "dark" 
                        ? "bg-electric-blue text-dark-bg" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Dark Slate
                  </button>
                  <button 
                    onClick={() => setThemeMode("light")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      themeMode === "light" 
                        ? "bg-white text-dark-bg" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Paper Print
                  </button>
                </div>

                {/* Print standard tool */}
                <button 
                  onClick={handlePrint}
                  id="btn-print-pamphlet"
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10"
                >
                  <Printer className="w-3.5 h-3.5 text-electric-blue" />
                  <span>Print / PDF</span>
                </button>

                {/* Direct offline download */}
                <button 
                  onClick={handleDownloadHTML}
                  id="btn-download-offline"
                  className="flex items-center gap-1.5 px-4 py-2 bg-electric-blue hover:bg-white text-dark-bg font-extrabold rounded-xl shadow-lg shadow-electric-blue/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Offline File</span>
                </button>

                {/* Close Button */}
                <button 
                  onClick={onClose}
                  aria-label="Close specification modal"
                  className="p-2 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-gray-400 border border-white/5 hover:border-rose-500/20 rounded-xl transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Active view of pamphlet */}
            <div className="p-6 md:p-10 max-h-[75vh] overflow-y-auto bg-dark-bg/40">
              
              <div 
                id="printable-pamphlet"
                className={`w-full max-w-3xl mx-auto rounded-3xl p-6 md:p-8 border relative overflow-hidden transition-all duration-300 ${
                  themeMode === "dark" 
                    ? "bg-[#0f1116] border-white/5 text-white" 
                    : "bg-white border-zinc-200 text-zinc-950 shadow-xl"
                }`}
              >
                {/* Decorative border bar */}
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-electric-blue"></div>

                {/* Header segment */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b-2 border-dashed border-gray-400/20 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded tracking-wider ${
                        themeMode === "dark" ? "bg-white/10 text-electric-blue" : "bg-[#0c0f14] text-[#00d4ff]"
                      }`}>
                        Mobile Lab Dispatch Spec
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 font-semibold">{specNumber}</span>
                    </div>
                    <h2 className={`text-2xl md:text-3.5xl font-black font-display tracking-tight leading-none ${
                      themeMode === "dark" ? "text-white" : "text-zinc-950"
                    }`}>
                      {service.name}
                    </h2>
                    <p className={`text-xs font-bold mt-1 max-w-lg font-display uppercase tracking-widest ${
                      themeMode === "dark" ? "text-electric-blue/90" : "text-sky-800"
                    }`}>
                      iDETAIL Premium Mobile Labs — Spec Card File
                    </p>
                  </div>

                  <div className={`text-left md:text-right shrink-0 rounded-2xl p-4 min-w-[200px] border ${
                    themeMode === "dark" 
                      ? "bg-white/5 border-white/5" 
                      : "bg-zinc-50 border-zinc-200 shadow-sm"
                  }`}>
                    <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">
                      MOBILE BASE PRICE
                    </span>
                    <span className="text-2xl font-black font-mono text-electric-blue">
                      R {service.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1.5 justify-start md:justify-end mt-1.5 text-xs font-mono text-gray-400">
                      <span>DURATION:</span>
                      <span className={`font-bold font-mono ${themeMode === "dark" ? "text-white" : "text-zinc-900"}`}>
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inside grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Column: Primary scope */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <span>01 // Technical Synopsis</span>
                      </h4>
                      <p className={`text-xs leading-relaxed font-sans ${themeMode === "dark" ? "text-gray-300" : "text-zinc-650"}`}>
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                        02 // Full Operational Inclusions
                      </h4>
                      <ul className="space-y-3 pl-0">
                        {service.includes.map((inc, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-xs">
                            <Check className="w-4 h-4 text-electric-blue shrink-0 mt-0.5" />
                            <span className={themeMode === "dark" ? "text-gray-300" : "text-zinc-700"}>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Specifications Card / Stamp */}
                  <div className="md:col-span-5 space-y-5">
                    
                    <div className={`border rounded-2xl p-4 space-y-3.5 ${
                      themeMode === "dark" ? "bg-white/5 border-white/5" : "bg-zinc-50 border-zinc-200"
                    }`}>
                      <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-electric-blue" />
                        <span>MOBILE LAB ASSURANCE</span>
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-[10px] leading-normal font-sans">
                        <div>
                          <span className="block font-mono text-gray-400 font-bold uppercase tracking-wider text-[8px]">DI WATER TDS</span>
                          <span className="font-bold text-electric-blue">0 (De-ionized)</span>
                        </div>
                        <div>
                          <span className="block font-mono text-gray-400 font-bold uppercase tracking-wider text-[8px]">DISPATCH UNIT</span>
                          <span className={themeMode === "dark" ? "text-white" : "text-zinc-900"}>Onboard Genset</span>
                        </div>
                        <div>
                          <span className="block font-mono text-gray-400 font-bold uppercase tracking-wider text-[8px]">TECHNICIANS</span>
                          <span className={themeMode === "dark" ? "text-white" : "text-zinc-900"}>iD Certified S.A.</span>
                        </div>
                        <div>
                          <span className="block font-mono text-gray-400 font-bold uppercase tracking-wider text-[8px]">INSURANCE LIMIT</span>
                          <span className="text-emerald-500 font-bold">R5m Sovereign</span>
                        </div>
                      </div>
                    </div>

                    <div className={`border rounded-2xl p-4 space-y-2 ${
                      themeMode === "dark" ? "bg-white/5 border-white/5" : "bg-zinc-50 border-zinc-150"
                    }`}>
                      <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                        📝 RECOMMENDED SUITE
                      </h4>
                      <p className={`text-[10px] leading-relaxed ${themeMode === "dark" ? "text-gray-400" : "text-zinc-650"}`}>
                        {service.recommendedFor}
                      </p>
                    </div>

                    {/* Authorized Signatures */}
                    <div className={`border rounded-2xl p-4 space-y-3 ${
                      themeMode === "dark" ? "border-white/5" : "border-zinc-200"
                    }`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-b border-gray-400/30 pb-0.5 mt-2">
                          <span className="block text-[7.5px] font-mono text-gray-400 font-bold uppercase tracking-wider">iDETAIL FIELD OPERATOR</span>
                        </div>
                        <div className="border-b border-gray-400/30 pb-0.5 mt-2">
                          <span className="block text-[7.5px] font-mono text-gray-400 font-bold uppercase tracking-wider">VEHICLE OWNER</span>
                        </div>
                      </div>
                      <p className="text-[8px] text-gray-500 leading-tight">
                        Authenticates matching baseline paint-swirl diagram assessment before commencing detailing operations.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Footer and barcode decorative stamp */}
                <div className="pt-6 border-t border-gray-450/15 mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                  
                  {/* Brand signature */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-black text-white rounded-lg text-sm font-black flex items-center justify-center font-display shadow-lg shadow-black/10 select-none border border-white/10 shrink-0">
                      iD
                    </div>
                    <div>
                      <h5 className={`text-[10px] font-bold font-display uppercase tracking-wider ${
                        themeMode === "dark" ? "text-white" : "text-zinc-950"
                      }`}>
                        iDETAIL On-Site Mobile Labs
                      </h5>
                      <p className="text-[8px] font-mono text-gray-400 uppercase">
                        S.A. Mobile Auto Detailing Enterprise
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic Barcode */}
                  <div className="flex flex-col items-center sm:items-end">
                    <div className="flex items-end h-7 overflow-hidden select-none">
                      {barcodeBars.map((bar, index) => (
                        <div 
                          key={index} 
                          className={`${bar.width} ${bar.gap} h-full ${themeMode === "dark" ? "bg-white" : "bg-zinc-900"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[8px] font-mono text-gray-450 font-semibold tracking-[0.25em] mt-1">
                      {specNumber}
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* Note prompt on standard PDF settings */}
            <div className="bg-[#12161f] border-t border-white/5 py-3 px-6 text-center text-[10px] text-gray-400 font-mono">
              💡 Pro Tip: When print window opens, select <span className="text-white hover:text-electric-blue">"Save as PDF"</span>. Keep background graphics active for maximum color fidelity.
            </div>

          </motion.div>
        </div>
      </AnimatePresence>

      {/* Hidden container styled solely for printing paper (forces white template background dynamically) */}
      <style>{`
        @media print {
          /* Hide parent application nodes */
          body * {
            visibility: hidden !important;
          }
          /* Override body styling */
          body {
            background-color: #ffffff !important;
            color: #0c0f17 !important;
          }
          /* Show just print core element */
          #print-pamphlet-root, #print-pamphlet-root * {
            visibility: visible !important;
          }
          #print-pamphlet-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 210mm !important; /* A4 scale */
            height: auto !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            color: #0f172a !important;
            border: none !important;
            color-scheme: light !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Force standard components of the printable page to light style */
          .bg-zinc-50, .bg-[#0f1116], .bg-[#0d1015], .bg-[#12161f] {
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
          }
          .text-white, .text-zinc-950, h2, h3, h4, h5, span {
            color: #0f172a !important;
          }
          .text-gray-300, .text-gray-450, .text-gray-400, p, li {
            color: #334155 !important;
          }
          .text-electric-blue {
            color: #0284c7 !important;
          }
          /* Retain barcode values */
          #print-pamphlet-root .bg-zinc-900, #print-pamphlet-root .bg-white {
            background-color: #0f172a !important;
          }
          #print-pamphlet-root .bg-electric-blue {
            background-color: #0284c7 !important;
          }
        }
      `}</style>
      
      {/* Absolute root node which only shows during standard print trigger */}
      <div id="print-pamphlet-root" className="hidden">
        <div className="w-full bg-white text-slate-900 p-8 border-slate-350 select-text">
          <div className="mb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#0284c7] font-bold">iDETAIL MOBILE DETAILING SYSTEM</span>
            <span className="float-right text-[9px] font-mono text-slate-500 font-semibold">{specNumber}</span>
          </div>
          
          <h1 className="text-3xl font-black font-display text-slate-900 mt-2 mb-1">{service.name}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-display mb-6">Master Specifications Leaflet</p>
          
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mb-6 flex justify-between items-center">
            <div>
              <span class="block text-[8px] font-semibold text-slate-400 tracking-[0.2em] font-mono">GUIDE PRICE</span>
              <span className="text-xl font-bold font-mono text-[#0284c7]">R {service.price}</span>
            </div>
            <div>
              <span class="block text-[8px] font-semibold text-slate-400 tracking-[0.2em] font-mono">EXECUTION TIME</span>
              <span className="text-sm font-bold font-mono text-slate-800">{service.duration}</span>
            </div>
            <div>
              <span class="block text-[8px] font-semibold text-slate-400 tracking-[0.2em] font-mono">LAB INTEGRITY</span>
              <span className="text-sm font-bold text-slate-800">0 TDS Water</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2.5">PROCESS DESCRIPTION</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">{service.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">INCLUDED TECHNICAL OPERATIONS</h3>
            <ul className="grid grid-cols-2 gap-3 pl-0">
              {service.includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800">
                  <span className="text-[#0284c7] font-bold">✔</span>
                  <span className="leading-relaxed font-sans font-medium">{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mb-8 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-900 font-mono mb-1.5 uppercase tracking-wider">DIAGNOSTIC CRITERIA</h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed font-sans">{service.recommendedFor}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-900 font-mono mb-1.5 uppercase tracking-wider">SYSTEM CERTIFICATIONS</h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                All personnel carry full S.A. master detailing certifications. Mobile lab includes generator capacity, 10-stage water filter system, and paint thickness testers.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-slate-900 font-display uppercase tracking-wide">iDETAIL MOBILE DETAILING LABS</span>
              <p className="text-[9px] text-slate-500">Corporate Operations Sheet — South Africa</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex h-6 items-end">
                {barcodeBars.slice(0, 30).map((bar, i) => (
                  <div key={i} className={`${bar.width} ${bar.gap} h-full bg-slate-950`} />
                ))}
              </div>
              <span className="text-[8px] font-mono tracking-widest text-slate-400 mt-1">{specNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
