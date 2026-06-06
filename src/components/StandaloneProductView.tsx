import React, { useState } from "react";
import { Star, ShieldCheck, Check, Info, ArrowLeft, Share2, Printer, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../types";
import { useFirebase } from "../context/FirebaseContext";

interface StandaloneProductViewProps {
  productId: number;
  onBackToApp: () => void;
  onAddToCart: (product: Product) => void;
}

export default function StandaloneProductView({ productId, onBackToApp, onAddToCart }: StandaloneProductViewProps) {
  const [qty, setQty] = useState(1);
  const { products } = useFirebase();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-[60vh] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <Sparkles className="w-12 h-12 text-electric-blue mb-4 animate-spin" />
        <h1 className="font-display font-black text-2xl mb-2">Formulation Not Found</h1>
        <p className="text-gray-400 mb-6">The requested detailing formulation or tool does not exist.</p>
        <button
          onClick={onBackToApp}
          className="bg-electric-blue text-dark-bg font-extrabold text-xs py-3 px-6 rounded-xl hover:scale-105 transition-all uppercase tracking-wider cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard successfully!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-6 sm:py-10 space-y-10 selection:bg-electric-blue selection:text-dark-bg">
      {/* Back breadcrumb and utility row */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Main Catalog</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
            title="Share Specification Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
            title="Print Detailing Guide"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main product representation grid layout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-card-bg border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Glow backdrop decorative shield */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

        {/* Column 1: Visually stunning item image showcase container */}
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-8xl overflow-hidden relative shadow-lg">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover relative z-10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="select-none select-all">{product.icon}</span>
            )}
            <div className="absolute top-3 left-3 bg-dark-bg/85 border border-white/10 px-3 py-1.5 rounded-full z-20 text-[10px] font-bold font-mono text-electric-blue uppercase tracking-wider">
              FORMULATION #{product.id}
            </div>
          </div>

          {/* Size and specs badge metrics */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Volume</span>
              <span className="text-white font-extrabold">{product.size}</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</span>
              <span className={`font-extrabold flex items-center gap-1.5 ${product.inStock ? "text-emerald-400" : "text-gray-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
                {product.inStock ? "IN STOCK" : "BACKORDER"}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Specific description detail column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-extrabold tracking-widest text-electric-blue uppercase bg-electric-blue/10 border border-electric-blue/10 px-3 py-1 rounded-full">
                {product.categoryLabel}
              </span>

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold font-mono text-gray-200">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
              {product.fullDescription || product.description}
            </p>
          </div>

          {/* Intersecting Pricing and Direct Action Center Card */}
          <div className="border border-white/10 bg-panel-bg p-6 rounded-2xl space-y-5 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 font-bold font-mono uppercase tracking-widest block mb-1">
                  Suggested Retail Price
                </span>
                <span className="text-3xl font-black font-mono text-electric-blue">
                  R {product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-gray-500 font-bold font-mono uppercase tracking-widest block mb-1">
                  Loyalty Points Value
                </span>
                <span className="text-sm font-bold font-mono text-white bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                  +125 Pts
                </span>
              </div>
            </div>

            {/* Quantity Selector and Dynamic High-Output Purchase Trigger Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Stepper controls */}
              <div className="flex items-center justify-between border border-white/10 rounded-xl p-1 bg-dark-bg/40 max-w-full sm:max-w-[140px] shrink-0">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  disabled={qty <= 1}
                  title="Decrease amount"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-center w-8 text-white">{qty}</span>
                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="Increase amount"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CTA ADD TO BASKET BUTTON */}
              <button
                onClick={() => {
                  for (let i = 0; i < qty; i++) {
                    onAddToCart(product);
                  }
                }}
                className="flex-1 bg-electric-blue hover:bg-white text-dark-bg font-black text-xs py-3.5 px-6 rounded-xl transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-electric-blue/10 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Add to Cart • R {(product.price * qty).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lab tested advantages and instruction columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card-bg border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <div className="p-2 bg-electric-blue/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-electric-blue" />
            </div>
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
              Laboratory Certified Specs
            </h3>
          </div>

          <ul className="space-y-3">
            {product.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card-bg border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <div className="p-2 bg-electric-blue/10 rounded-lg">
              <Info className="w-5 h-5 text-electric-blue" />
            </div>
            <h4 className="font-display font-bold text-base text-white uppercase tracking-wider">
              Methodical Detailing Guide
            </h4>
          </div>

          <div className="bg-panel-bg border border-white/5 rounded-xl p-5 text-sm text-gray-300 space-y-2.5">
            <p className="font-bold text-electric-blue text-[10px] uppercase font-mono tracking-widest">
              PROFESSIONAL TIPS
            </p>
            <p className="leading-relaxed text-xs sm:text-sm">
              {product.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
