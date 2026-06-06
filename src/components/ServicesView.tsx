/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Check, 
  Clock, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Car, 
  ShieldCheck, 
  Sliders, 
  Activity,
  Award,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES } from "../data";
import { DetailingService } from "../types";
import ServicePamphletModal from "./ServicePamphletModal";

export default function ServicesView() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("interior-valet");
  const [isPamphletOpen, setIsPamphletOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    preferredDate: "",
    preferredTime: "morning",
    location: "",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  
  const formRef = useRef<HTMLDivElement>(null);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    // Smooth scroll to details/form on mobile if clicked
    if (window.innerWidth < 1024) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list: string[] = [];
    
    if (!formData.name.trim()) list.push("Your Name is required.");
    if (!formData.email.trim() || !formData.email.includes("@")) list.push("A valid Email is required.");
    if (!formData.phone.trim() || formData.phone.length < 5) list.push("A contact Phone Number is required.");
    if (!formData.vehicle.trim()) list.push("Vehicle Year, Make & Model is required.");
    if (!formData.preferredDate) list.push("Preferred Appointment Date is required.");
    if (!formData.location.trim()) list.push("Your street address or mobile detailing location is required.");

    if (list.length > 0) {
      setErrors(list);
      return;
    }

    setErrors([]);
    // Generate random booking code
    const randomRef = "IDT-SERV-" + Math.floor(1000 + Math.random() * 9000);
    setBookingReference(randomRef);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicle: "",
      preferredDate: "",
      preferredTime: "morning",
      location: "",
      notes: ""
    });
  };

  return (
    <div className="py-12 space-y-16">
      {/* 1. Header Banner */}
      <section className="text-center px-4 max-w-4xl mx-auto space-y-4">
        <span className="text-[10px] font-extrabold tracking-[0.25em] text-electric-blue bg-electric-blue/10 px-3.5 py-1.5 rounded-full inline-block uppercase">
          On-Site Mobile Labs
        </span>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Professional Mobile <br />
          <span className="bg-gradient-to-r from-electric-blue via-cyan-400 to-white bg-clip-text text-transparent">
            Detailing Solutions
          </span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We bring our state-of-the-art detailing lab directly to your garage. Absolute water independence, premium silica coatings, and paint correction formulas anywhere in South Africa.
        </p>
      </section>

      {/* 2. Services Grid and Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="services-tabs" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Quick Selector Card List */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-start">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">
              Select Mobile Service Package
            </h3>
            
            <div className="space-y-3.5">
              {SERVICES.map((s) => {
                const isSelected = s.id === selectedServiceId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectService(s.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-4 cursor-pointer group ${
                      isSelected
                        ? "bg-card-bg border-electric-blue/60 shadow-lg shadow-electric-blue/5"
                        : "bg-card-bg/40 border-white/5 hover:border-white/10 hover:bg-card-bg/60"
                    }`}
                  >
                    {/* Glow element */}
                    {isSelected && (
                      <div className="absolute right-0 top-0 h-16 w-16 bg-electric-blue/5 blur-xl pointer-events-none" />
                    )}

                    {/* Icon container */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl shrink-0 transition-all ${
                      isSelected 
                        ? "bg-electric-blue/15 scale-105" 
                        : "bg-white/5 group-hover:scale-105"
                    }`}>
                      {s.icon}
                    </div>

                    {/* Description lines */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-base font-bold truncate transition-colors ${
                          isSelected ? "text-electric-blue" : "text-white"
                        }`}>
                          {s.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 group-hover:text-gray-300 transition-colors">
                        {s.description}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2.5 text-[10px] font-mono text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-electric-blue" />
                          {s.duration}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-electric-blue font-mono">
                          From R {s.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quality Standard badge */}
            <div className="hidden lg:flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mt-auto">
              <Award className="w-8 h-8 text-electric-blue shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">iDETAIL Guarantee</p>
                <p className="text-[10px] text-gray-500 leading-normal">
                  All operators are certified, fully insured and carry onboard filtered deionized water labs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Active Service Detailed Specs */}
          <div ref={formRef} className="lg:col-span-7">
            <div className="bg-card-bg border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              {/* Detail Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <span className="text-[9px] font-mono text-electric-blue font-bold tracking-[0.15em] uppercase">
                    ACTIVE SELECTION DETAILS
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
                    {selectedService.name}
                  </h2>
                </div>
                
                <div className="text-left sm:text-right shrink-0 bg-electric-blue/10 border border-electric-blue/20 rounded-2xl p-4">
                  <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Mobile Base Price
                  </span>
                  <span className="text-2xl font-black font-mono text-electric-blue">
                    R {selectedService.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Dynamic summary */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest font-mono">
                  SERVICE SYNOPSIS
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed font-sans">
                  {selectedService.description}
                </p>
              </div>

              {/* Package Inclusions Checklist */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-electric-blue" />
                  What Is Included In This Mobile Operation
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-electric-blue shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended banner */}
              <div className="bg-dark-bg/60 border border-white/5 rounded-xl p-4 text-xs flex gap-3">
                <span className="text-xl shrink-0 select-none">💡</span>
                <div>
                  <p className="text-electric-blue font-bold uppercase tracking-wider mb-0.5">Recommended Vehicle Profiles</p>
                  <p className="text-gray-400 font-sans leading-normal">{selectedService.recommendedFor}</p>
                </div>
              </div>

              {/* Pamphlet Download Feature */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h5 className="text-white text-xs font-bold leading-normal">Need an Offline Spec Sheet?</h5>
                  <p className="text-[9px] text-gray-400 mt-0.5">Download a detailed PDF/HTML pamphlet for this treatment.</p>
                </div>
                <button
                  type="button"
                  id="btn-open-pamphlet-modal"
                  onClick={() => setIsPamphletOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 bg-dark-bg hover:bg-electric-blue hover:text-dark-bg border border-white/10 hover:border-electric-blue text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 select-none"
                >
                  <FileText className="w-3.5 h-3.5 text-electric-blue tag-pamphlet" />
                  Print & Download Spec Card
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Action Booking Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0f1116] to-[#1a1e26] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-28 w-28 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center max-w-lg mx-auto space-y-2">
                  <Calendar className="w-8 h-8 text-electric-blue mx-auto animate-bounce" />
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    Secure An Appointment
                  </h3>
                  <p className="text-xs text-gray-500">
                    Schedule a fully managed detailing lab dispatch to your location. Confirm details below.
                  </p>
                </div>

                {errors.length > 0 && (
                  <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-rose-400 font-medium">
                      {errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Service Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Selected Detail Treatment
                    </label>
                    <select
                      name="preferredTime" // reuse value
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl px-3.5 py-3 text-xs focus:outline-none"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id} className="bg-card-bg">
                          {s.name} — From R {s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Sipho Nkosi"
                        className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="sipho@detailing.co.za"
                        className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Contact Mobile Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+27 82 123 4567"
                        className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Vehicle Year, Make & Model
                    </label>
                    <div className="relative">
                      <Car className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleInputChange}
                        placeholder="2024 BMW M4 Competition"
                        className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl px-3.5 py-3 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Preferred Time slot
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl px-3.5 py-3 text-xs focus:outline-none"
                    >
                      <option value="morning">Morning (08:00 - 12:00)</option>
                      <option value="afternoon">Afternoon (12:00 - 16:00)</option>
                      <option value="evening">Late slot (16:00 - 19:30)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Mobile Detailing Address / Street Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. 45 Sandton Dr, Sandton, Johannesburg"
                        className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 font-mono">
                      Additional Requests / Paint Swirl details (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Tree sap on roof, spiderweb lines visible under spotlight..."
                      className="w-full bg-dark-bg text-white border border-white/10 focus:border-electric-blue/40 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-electric-blue hover:bg-white text-dark-bg font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-electric-blue/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Reserve Detailing Lab Now
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 space-y-6"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl animate-bounce">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    LAB RESERVATION PENDING!
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1.5 leading-relaxed">
                    Success! A detailing representative has received your request. We will inspect your address and vehicle profile.
                  </p>
                </div>

                {/* Booking Receipt Ticket */}
                <div className="bg-dark-bg/60 border border-white/10 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-4">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5 font-mono">
                    <span className="text-gray-500 uppercase tracking-widest">APPOINTMENT REFERENCE</span>
                    <span className="text-electric-blue font-extrabold">{bookingReference}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans text-gray-300">
                    <div>
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                        CLIENT
                      </span>
                      <span className="text-white font-bold">{formData.name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                        MOBILE LOCATION
                      </span>
                      <span className="text-white font-bold truncate block" title={formData.location}>
                        {formData.location}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                        VEHICLE
                      </span>
                      <span className="text-white font-bold">{formData.vehicle}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                        DATE & TIMESLOT
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {formData.preferredDate} ({formData.preferredTime.toUpperCase()})
                      </span>
                    </div>

                    <div className="col-span-2 pt-2.5 border-t border-white/5">
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                        REQUESTED OPERATION
                      </span>
                      <span className="text-electric-blue font-bold font-display">{selectedService.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-white hover:bg-electric-blue hover:text-dark-bg text-dark-bg font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
                  >
                    New Reservation
                  </button>
                  <button
                    onClick={() => {
                      // Navigate client back to catalog home
                      const btn = document.querySelector('button[aria-label="Toggle Shopping Cart"]');
                      if (btn) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      location.hash = "";
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 px-4 border border-white/10 rounded-xl transition-all cursor-pointer uppercase tracking-widest"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <ServicePamphletModal 
        isOpen={isPamphletOpen}
        onClose={() => setIsPamphletOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
