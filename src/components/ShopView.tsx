/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Layers } from "lucide-react";
import { Product } from "../types";
import { useFirebase } from "../context/FirebaseContext";
import ProductCard from "./ProductCard";

interface ShopViewProps {
  onAddToCart: (product: Product) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function ShopView({
  onAddToCart,
  selectedCategory,
  setSelectedCategory,
}: ShopViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const { products } = useFirebase();

  const categories = [
    { id: "all", label: "All Formulations" },
    { id: "exterior", label: "Exterior Care" },
    { id: "interior", label: "Interior Detail" },
    { id: "ceramic", label: "Ceramic Coatings" },
    { id: "accessories", label: "Accessories" },
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
  };

  const processedProducts = useMemo(() => {
    let list = [...products];

    // 1. Filter by category
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // 2. Filter by search text query
    if (searchQuery.trim()) {
      const criteria = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(criteria) ||
          p.description.toLowerCase().includes(criteria) ||
          p.categoryLabel.toLowerCase().includes(criteria)
      );
    }

    // 3. Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // "featured" -> fallback to initial array ordering, but put featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-10 py-12">
      {/* Visual Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase">
          iDETAIL CATALOG
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          All Formulated Supplies
        </h2>
        <p className="text-xs text-gray-400 font-sans max-w-lg mx-auto">
          Secure military-grade silica formulas, wet carnauba synthetic polymers, and custom dual-pile edgeless buffers.
        </p>
      </div>

      {/* Control center panel & searches */}
      <section className="bg-card-bg/40 border border-white/5 rounded-2xl p-4 sm:p-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Active Search Field */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search HydroGloss, Clay, Microfiber..."
              className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs uppercase font-mono tracking-wider focus:outline-none placeholder-gray-600"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          </div>

          {/* Sorter Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
              <ArrowUpDown className="w-4 h-4 text-electric-blue" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-4 py-3 text-xs font-mono uppercase focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category navigational quick pills */}
        <div className="pt-4 border-t border-white/5 overflow-x-auto scrollbar-none flex items-center gap-2">
          <div className="flex items-center text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mr-2 shrink-0">
            <Layers className="w-4 h-3.5 text-electric-blue mr-1.5" />
            <span>Category:</span>
          </div>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-electric-blue text-dark-bg shadow-md border border-electric-blue"
                  : "bg-white/5 hover:bg-white/10 text-gray-400 border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid displays */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-6">
          <span>CATALOG SELECTIONS</span>
          <span className="text-electric-blue font-bold">
            {processedProducts.length} PRODUCTS FOUND
          </span>
        </div>

        {processedProducts.length === 0 ? (
          <div className="text-center py-24 bg-card-bg/20 rounded-2xl border border-white/5 border-dashed max-w-xl mx-auto space-y-4 px-6">
            <span className="text-5xl select-none">🧪</span>
            <h3 className="font-display font-semibold text-lg text-white">
              No formulas matched your criteria
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              No matching chemical products of category '{selectedCategory}' or query phrase '{searchQuery}' are in stock.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-2.5 px-5 rounded-xl border border-white/5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-electric-blue" />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
