/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Star, ShieldCheck, Check, Info, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOutOfStock = !product.inStock || (product.stockCount !== undefined && product.stockCount <= 0);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("product", product.id.toString());
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={handleCardClick}
        className="group relative flex flex-col justify-between bg-card-bg/50 border border-white/5 rounded-2xl p-5 hover:border-electric-blue/30 transition-all duration-300 backdrop-blur-sm shadow-xl hover:shadow-electric-blue/5 cursor-pointer"
      >
        <div>
          {/* Top category & tag metrics */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase bg-electric-blue/10 px-2.5 py-1 rounded-full">
              {product.categoryLabel}
            </span>
            {isOutOfStock ? (
              <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10">SOLD OUT</span>
            ) : product.stockCount !== undefined && product.stockCount < 10 ? (
              <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10">ONLY {product.stockCount} LEFT</span>
            ) : (
              <span className="text-xs font-mono text-gray-500">{product.size}</span>
            )}
          </div>

          {/* Product Icon Frame */}
          <div className="relative h-44 rounded-xl bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-5xl mb-4 overflow-hidden group-hover:from-midnight-blue/10 group-hover:to-electric-blue/5 transition-all duration-300">
            {/* Background glowing rings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,123,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <motion.span
                whileHover={{ scale: 1.15, rotate: 5 }}
                className="relative z-10 select-none drop-shadow-lg filter group-hover:brightness-110"
              >
                {product.icon}
              </motion.span>
            )}
            
            {/* Quick View & Standalone Window Buttons on Hover */}
            <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 flex flex-col sm:flex-row items-center justify-center gap-2 transition-all duration-300 backdrop-blur-xs">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 bg-white text-dark-bg font-bold text-xs py-2 px-3 rounded-lg border border-transparent shadow hover:scale-105 active:scale-95 transition-all duration-250 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick Specs
              </button>
              <button
                onClick={() => {
                  window.open(`${window.location.origin}${window.location.pathname}?product=${product.id}`, "_blank");
                }}
                className="flex items-center gap-1.5 bg-electric-blue text-white font-extrabold text-xs py-2 px-3 rounded-lg border border-transparent shadow hover:scale-105 active:scale-95 transition-all duration-250 cursor-pointer"
                title="Open product description in separate window"
              >
                <Info className="w-3.5 h-3.5" />
                New Window
              </button>
            </div>
          </div>

          {/* Title & Ratings */}
          <h3 className="font-display font-bold text-lg text-white mb-1.5 group-hover:text-electric-blue transition-colors duration-250 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold font-mono text-gray-300 ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-gray-500">({product.reviewsCount} reviews)</span>
          </div>

          <p className="text-xs text-gray-400 font-normal leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>

        {/* Action Bottom */}
        <div className="flex flex-col pt-3 border-t border-white/5 mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">Price</span>
            <span className="text-base font-extrabold font-mono text-electric-blue">
              R {product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest border rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? "bg-rose-500/10 text-rose-400/50 border-rose-500/10 cursor-not-allowed"
                : "bg-white/5 text-white border-white/10 group-hover:bg-electric-blue group-hover:border-transparent group-hover:text-dark-bg cursor-pointer"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </motion.div>

      {/* Modern Specification Modal Container */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Spec Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-card-bg border border-white/10 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6 sm:p-8">
                {/* Header elements */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase bg-electric-blue/10 px-3 py-1 rounded-full mb-3 inline-block">
                      {product.categoryLabel}
                    </span>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                      {product.name}
                    </h2>
                  </div>
                  
                  {/* Container Volume */}
                  <div className="text-right shrink-0 space-y-1">
                    <span className="block font-mono text-[10px] text-gray-400">VOLUME: <b className="text-white">{product.size}</b></span>
                    {isOutOfStock ? (
                      <span className="block text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10 text-center">SOLD OUT</span>
                    ) : product.stockCount !== undefined && product.stockCount < 10 ? (
                      <span className="block text-[10px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10 text-center">LOW STOCK ({product.stockCount})</span>
                    ) : (
                      <span className="block text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-center">IN STOCK ({product.stockCount !== undefined ? product.stockCount : 15})</span>
                    )}
                  </div>
                </div>

                {/* Sub-Layout: Left icon, Right facts */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-7">
                  <div className="sm:col-span-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-7xl overflow-hidden relative min-h-[140px]">
                    <Sparkles className="absolute top-2 right-2 w-4 h-4 text-electric-blue opacity-50 z-20" />
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      product.icon
                    )}
                  </div>

                  <div className="sm:col-span-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "fill-current" : "opacity-30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold font-mono text-gray-200">
                        {product.rating.toFixed(1)} / 5.0
                      </span>
                      <span className="text-xs text-gray-500">({product.reviewsCount} verified reviews)</span>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {product.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Benefits / Advantages Checklist */}
                <div className="mb-6">
                  <h4 className="font-display font-bold text-sm text-white mb-3 tracking-wider uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-electric-blue" />
                    Key Product Advantages
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailing application guide */}
                <div className="bg-dark-bg/60 border border-white/5 rounded-xl p-4 mb-7">
                  <h4 className="font-display font-bold text-xs text-electric-blue mb-2 tracking-wider uppercase flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Professional Application Procedure
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {product.instructions}
                  </p>
                </div>

                {/* Purchase Action Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">
                      MSRP Price
                    </span>
                    <span className="text-2xl font-extrabold font-mono text-electric-blue">
                      R {product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    <button
                      onClick={() => {
                        window.open(`${window.location.origin}${window.location.pathname}?product=${product.id}`, "_blank");
                        setIsModalOpen(false);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-2.5 px-3.5 rounded-xl border border-white/5 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Open full specs in new window"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">New Window</span>
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-2.5 px-5 rounded-xl border border-white/5 transition-all cursor-pointer"
                    >
                      Close Specs
                    </button>
                    <button
                      onClick={() => {
                        if (!isOutOfStock) {
                          onAddToCart(product);
                          setIsModalOpen(false);
                        }
                      }}
                      disabled={isOutOfStock}
                      className={`flex items-center gap-1.5 font-extrabold text-xs py-2.5 px-6 rounded-xl shadow-lg transition-all uppercase tracking-wider ${
                        isOutOfStock
                          ? "bg-rose-500/10 text-rose-400/50 cursor-not-allowed"
                          : "bg-electric-blue hover:bg-white text-dark-bg cursor-pointer"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isOutOfStock ? "Sold Out" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
