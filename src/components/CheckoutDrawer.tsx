/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Check, ArrowRight, ShieldCheck, CreditCard, Truck, UserCheck, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Order } from "../types";
import { useFirebase } from "../context/FirebaseContext";
import InvoiceModal from "./InvoiceModal";

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

export default function CheckoutDrawer({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}: CheckoutDrawerProps) {
  const { currentUser, saveOrderToFirebase } = useFirebase();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showInvoice, setShowInvoice] = useState(false);

  // Address State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.displayName || "");
      if (!email) setEmail(currentUser.email || "");
    }
  }, [currentUser, isOpen]);

  // Card State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Tracking Code & Summary State
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Validation
  const validateStep1 = () => {
    const list: string[] = [];
    if (!fullName.trim()) list.push("Full Name is required.");
    if (!email.trim() || !email.includes("@")) list.push("A valid email is required.");
    if (!address.trim()) list.push("Delivery address is required.");
    if (!city.trim()) list.push("City is required.");
    if (!zip.trim() || zip.length < 3) list.push("A postal ZIP code is required.");
    
    setErrors(list);
    return list.length === 0;
  };

  const validateStep2 = () => {
    const list: string[] = [];
    if (cardNumber.replace(/\s+/g, "").length < 16) {
      list.push("Card number requires 16 digits (simulated secure).");
    }
    if (!cardExpiry.includes("/") || cardExpiry.length < 5) {
      list.push("Expiry date format MM/YY is required.");
    }
    if (cardCVV.length < 3) {
      list.push("CVV is required (3 or 4 digits).");
    }

    setErrors(list);
    return list.length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setErrors([]);
        setStep(2);
      }
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      if (validateStep2()) {
        setErrors([]);
        // Generate random tracking number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const randomAlpha = Math.random().toString(36).substring(3, 7).toUpperCase();
        const orderId = `IDT-${randomNum}-${randomAlpha}`;
        setGeneratedOrderId(orderId);

        // Sync order with Firebase Firestore under orders/{orderId}
        try {
          await saveOrderToFirebase(orderId, cartItems, cartTotal);
        } catch (err) {
          console.error("Firestore order write rejected or failed:", err);
          // Permissive failover for checkout representation
        }

        setStep(3);
      }
    }
  };

  const handleFinish = () => {
    onOrderSuccess(); // Clears cart
    onClose(); // Closes drawer
    setStep(1); // Resets step
    setFullName("");
    setEmail("");
    setAddress("");
    setCity("");
    setZip("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-center items-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={step === 3 ? undefined : onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Checkout Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-xl bg-card-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top Bar */}
            <div className="px-6 py-4 bg-dark-bg/50 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">SECURE ORDER</h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">
                  {step === 3 ? "Order Completed" : `STEP ${step} OF 2`}
                </p>
              </div>

              {step !== 3 && (
                <button
                  onClick={onClose}
                  className="p-1 px-1.5 rounded-lg border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Error notifications */}
            {errors.length > 0 && (
              <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-3">
                <ul className="list-disc pl-4 space-y-0.5">
                  {errors.map((err, idx) => (
                    <li key={idx} className="text-[11px] font-medium text-rose-400">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step Contents */}
            <div className="p-6 sm:p-8 space-y-5">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-electric-blue uppercase font-mono tracking-wider">
                    <UserCheck className="w-4 h-4" />
                    Delivery & Contact Details
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@automotive.com"
                        className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Shipping Street Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Performance Parkway"
                        className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Cape Town"
                          className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder="48201"
                          className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <span className="text-xs text-gray-500 font-mono">
                      Subtotal: R {cartTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={handleNextStep}
                      className="flex items-center gap-1.5 bg-midnight-blue hover:bg-electric-blue hover:text-dark-bg text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer hover:translate-x-0.5"
                    >
                      Payment Setup
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmitCheckout} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-electric-blue uppercase font-mono tracking-wider">
                    <CreditCard className="w-4 h-4" />
                    Simulated Payment Processing
                  </div>

                  <div className="bg-dark-bg/60 border border-white/5 p-4 rounded-xl space-y-3 relative overflow-hidden">
                    {/* Metallic glow */}
                    <div className="absolute right-0 top-0 h-20 w-20 bg-indigo-500/5 blur-2xl pointer-events-none" />

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Secure Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        maxLength={19}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCardNumber(val);
                        }}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none tracking-widest font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                          Expiry MM/YY
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          maxLength={5}
                          placeholder="12/28"
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length > 2) {
                              val = val.substring(0, 2) + "/" + val.substring(2, 4);
                            }
                            setCardExpiry(val);
                          }}
                          className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none tracking-widest font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                          CVV Code
                        </label>
                        <input
                          type="password"
                          value={cardCVV}
                          maxLength={4}
                          placeholder="•••"
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none tracking-widest font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 font-sans flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    Payments are fully simulated for catalog demo. No actual money will be charged.
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-white/5 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-electric-blue hover:text-dark-bg text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      Complete Purchase
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="text-center py-4 space-y-6">
                  {/* Glowing success circle */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-white">
                      ORDER DISPATCHED!
                    </h3>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
                      Thank you for choosing iDETAIL. Your formulations are being packed and sealed for delivery.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-dark-bg/60 border border-white/5 rounded-xl p-4 text-left space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5 font-mono">
                      <span className="text-gray-500">TRACKING ORDER ID</span>
                      <span className="text-electric-blue font-bold tracking-wider">{generatedOrderId}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                        DELIVERY DESTINATION
                      </span>
                      <p className="text-xs text-gray-300 font-sans">
                        <span className="block font-bold text-white">{fullName}</span>
                        {address}, {city}, {zip}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase font-bold tracking-widest text-[9px] font-mono">
                        ESTIMATED ARRIVAL
                      </span>
                      <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Next Business day
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowInvoice(true)}
                      className="flex-1 border border-electric-blue/30 hover:border-electric-blue bg-electric-blue/10 hover:bg-electric-blue hover:text-dark-bg text-electric-blue font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      View Tax Invoice
                    </button>

                    <button
                      onClick={handleFinish}
                      className="flex-1 bg-white hover:bg-electric-blue hover:text-dark-bg text-dark-bg font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      Complete & Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Success Invoice Modal overlay */}
            {step === 3 && (
              <InvoiceModal
                isOpen={showInvoice}
                onClose={() => setShowInvoice(false)}
                order={{
                  orderId: generatedOrderId,
                  userId: currentUser?.uid || "guest_detailing_client",
                  items: cartItems.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                  })),
                  totalPrice: cartTotal,
                  status: "pending",
                  createdAt: new Date().toISOString()
                }}
                customerName={fullName || "iDetail Client"}
                customerEmail={email || undefined}
              />
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
