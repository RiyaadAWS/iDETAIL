/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Trash2, Plus, Minus, CreditCard, Gift, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartSidebarProps) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express">("standard");

  const promoOffers = [
    { code: "SHINE10", discount: 0.10, label: "10% off cart" },
    { code: "DETAILPRO", discount: 0.20, label: "20% off coatings & wash" }
  ];

  const handleApplyPromo = () => {
    setPromoError("");
    const matched = promoOffers.find(p => p.code.toUpperCase() === promoCode.trim().toUpperCase());
    
    if (matched) {
      setAppliedPromo(matched);
      setPromoCode("");
    } else {
      setPromoError("Invalid code. Try 'DETAILPRO' or 'SHINE10'");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, current) => acc + (current.product.price * current.quantity), 0);
  };

  const subtotal = getSubtotal();
  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const shippingAmount = deliverySpeed === "express" ? 150 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-card-bg border-l border-white/5 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white">Your Cart</h3>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} ITEMS SELECTED
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 px-1.5 rounded-lg border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
                  aria-label="Close cart sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="text-6xl mb-4 select-none">🛒</span>
                    <h4 className="font-display font-bold text-lg text-white mb-2">Cart is empty</h4>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                      Add professional automotive wax, silica ceramic kits, or microfiber buffing towels to get started.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 font-bold text-xs uppercase bg-midnight-blue hover:bg-electric-blue hover:text-dark-bg text-white py-2.5 px-6 rounded-lg transition-all cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 bg-dark-bg/40 border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors"
                    >
                      {/* Product Symbol */}
                      <div className="bg-white/5 rounded-lg w-12 h-12 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-2xl select-none">{item.product.icon}</span>
                        )}
                      </div>

                      {/* Detail Column */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-sm text-white truncate mb-0.5">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-electric-blue font-bold font-mono">
                          R {item.product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                        </p>

                        {/* Increment / Decrement Frame */}
                        <div className="flex items-center gap-2.5 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono text-white select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Trash action */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-500 rounded hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}

                {/* Promo Code & Suggestions panel */}
                {cartItems.length > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span>APPLY CAR DETAILING OFFERS</span>
                      <span className="text-[10px] text-electric-blue font-mono">CODES: DETAILPRO / SHINE10</span>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="PROMO CODE"
                          className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none placeholder-gray-600"
                        />
                        <Gift className="absolute right-3 top-2.5 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        {promoError}
                      </p>
                    )}

                    {appliedPromo && (
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-emerald-400">
                        <span className="font-mono font-bold">
                          {appliedPromo.code} ACTIVE (-{(appliedPromo.discount * 100)}%)
                        </span>
                        <button
                          onClick={removePromoCode}
                          className="text-xs font-bold underline cursor-pointer hover:text-emerald-300"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Shipping Speed option */}
                    <div className="bg-dark-bg/30 border border-white/5 rounded-xl p-3 space-y-2">
                      <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                        Delivery Speed
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setDeliverySpeed("standard")}
                          className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all cursor-pointer ${
                            deliverySpeed === "standard"
                              ? "bg-midnight-blue/20 border-midnight-blue text-white"
                              : "border-white/5 bg-transparent text-gray-400 hover:border-white/10"
                          }`}
                        >
                          <span className="block text-white">Standard Delivery</span>
                          <span className="text-[10px] text-gray-500">FREE • 3-5 Business Days</span>
                        </button>

                        <button
                          onClick={() => setDeliverySpeed("express")}
                          className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all cursor-pointer ${
                            deliverySpeed === "express"
                              ? "bg-midnight-blue/20 border-midnight-blue text-white"
                              : "border-white/5 bg-transparent text-gray-400 hover:border-white/10"
                          }`}
                        >
                          <span className="block text-white">Express Delivery</span>
                          <span className="text-[10px] text-gray-500">R 150.00 • Ships Next Day</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Summary Card */}
              {cartItems.length > 0 && (
                <div className="px-6 py-5 bg-dark-bg border-t border-white/5 space-y-4">
                  <div className="space-y-1.5 text-xs text-gray-400 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">R {subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount ({appliedPromo?.code})</span>
                        <span className="font-mono">-R {discountAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Shipping</span>
                      <span className="font-mono text-white">
                        {shippingAmount === 0 ? "FREE" : `R ${shippingAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-white pt-2.5 border-t border-white/5">
                      <span className="font-display">Total Due</span>
                      <span className="font-mono text-electric-blue">R {totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Complete actions button */}
                  <button
                    onClick={onProceedToCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-midnight-blue to-blue-600 hover:from-white hover:to-white hover:text-dark-bg text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer text-sm"
                  >
                    <CreditCard className="w-4.5 h-4.5" />
                    Secure Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
