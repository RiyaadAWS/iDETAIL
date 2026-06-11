/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertTriangle, HelpCircle, Shield, Sparkles } from "lucide-react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useFirebase } from "../context/FirebaseContext";
import { motion } from "motion/react";

export default function ContactView() {
  const { currentUser } = useFirebase();

  // Form states
  const [name, setName] = useState(currentUser?.displayName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync name/email if currently signed-in user changes
  React.useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.displayName || "");
      if (!email) setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validation
    if (!name.trim()) {
      setSubmitError("Name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError("A valid email address is required.");
      setIsSubmitting(false);
      return;
    }
    if (!message.trim()) {
      setSubmitError("Message, question, or request cannot be empty.");
      setIsSubmitting(false);
      return;
    }

    let messageId = "new_submission";
    try {
      // 1. Generate doc ref inside 'contacts' collection
      const contactsCol = collection(db, "contacts");
      const docRef = doc(contactsCol);
      messageId = docRef.id;

      // 2. Write to Firebase adhering strictly to ContactMessage schema
      await setDoc(docRef, {
        id: messageId,
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });

      // 3. Clear form and trigger success
      setMessage("");
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error("Error submitting contact form to Firestore:", err);
      setSubmitError("Could not submit your inquiry. Please try again or authenticate.");
      
      // Attempt logging with specialized firestore handler
      try {
        handleFirestoreError(err, OperationType.CREATE, `contacts/${messageId}`);
      } catch (logErr) {
        // Safe bypass
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Dynamic Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-electric-blue" />
          Customer Support & Diagnostics Portal
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed font-sans">
          Have an inquiry about our premium chemical formulations, detailing academy, or active orders? Fill out the secure form, and our engineering team will get back to you immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
        {/* Left Column: Operations & Contacts */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
          <div className="bg-card-bg/20 border border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-8 flex-1 flex flex-col justify-center">
            <h2 className="font-display font-extrabold text-lg text-white tracking-wide border-b border-white/5 pb-4">
              Operation Channels
            </h2>

            <div className="space-y-6">
              {/* Phone Channel */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-2xl flex items-center justify-center text-electric-blue shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
                    Hotline & Support
                  </h3>
                  <p className="text-sm font-bold text-white font-sans hover:text-electric-blue transition-colors">
                    +27 76 644 1575
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Direct line / Detailing emergency help
                  </p>
                </div>
              </div>

              {/* Email Channel */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-2xl flex items-center justify-center text-electric-blue shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
                    Electronic Mail
                  </h3>
                  <p className="text-sm font-bold text-white font-sans hover:text-electric-blue transition-colors">
                    info@idetail.co.za
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Order inquiries & logistics assistance
                  </p>
                </div>
              </div>

              {/* Hours Channel */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-2xl flex items-center justify-center text-electric-blue shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
                    Operational Hours
                  </h3>
                  <p className="text-sm font-bold text-white font-sans">
                    Mon - Sat: 08:00 - 18:00
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Sundays: Closed for detailing events
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Badge */}
          <div className="bg-card-bg/10 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-sans">
                Zero-Trust Data Protection
              </h4>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5 leading-relaxed">
                Your submitted messages are stored securely inside our partitioned Firestore database with active security rules.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-3">
          <div className="bg-card-bg/40 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <h2 className="font-display font-extrabold text-xl text-white tracking-wide border-b border-white/5 pb-4 mb-8 flex items-center gap-2">
              Submit Secure Inquiry
            </h2>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 text-center space-y-3.5"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-white">
                    Transmission Successful!
                  </h3>
                  <p className="text-xs text-gray-400 font-sans max-w-sm mx-auto">
                    We have successfully logged your contact form submission into our secure records. Our specialists will review and reply via email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 hover:text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Submit Another Message
                </button>
              </motion.div>
            )}

            {!submitSuccess && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-bold font-sans">{submitError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Johan Smith"
                      required
                      disabled={isSubmitting}
                      className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-electric-blue/60 transition-colors duration-300 font-sans disabled:opacity-50"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. johan@example.com"
                      required
                      disabled={isSubmitting}
                      className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-electric-blue/60 transition-colors duration-300 font-sans disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Subject type */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                    Inquiry Category
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-electric-blue/60 transition-colors duration-300 font-sans disabled:opacity-50 cursor-pointer"
                  >
                    <option value="General Inquiry" className="bg-[#12141c]">General Inquiry</option>
                    <option value="Order Tracking & Logistics" className="bg-[#12141c]">Order Tracking & Logistics</option>
                    <option value="Chemical Formulations Feedback" className="bg-[#12141c]">Chemical Formulations Feedback</option>
                    <option value="Detailing Academy Training" className="bg-[#12141c]">Detailing Academy Training</option>
                    <option value="Custom Partnership / Wholesale" className="bg-[#12141c]">Custom Partnership & Wholesale</option>
                  </select>
                </div>

                {/* Message body */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question or request here..."
                    required
                    rows={5}
                    maxLength={2000}
                    disabled={isSubmitting}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-electric-blue/60 transition-colors duration-300 font-sans disabled:opacity-50 resize-y min-h-[120px]"
                  />
                  <div className="flex justify-between items-center text-[10px] text-gray-600 font-mono mt-1">
                    <span>Required fields symbol (*)</span>
                    <span>{message.length} / 2000 characters</span>
                  </div>
                </div>

                {/* Submit trigger */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 bg-electric-blue hover:bg-electric-blue/90 disabled:bg-electric-blue/40 disabled:cursor-not-allowed text-dark-bg font-extrabold uppercase tracking-wider rounded-xl px-6 py-3.5 text-xs transition-all shadow-lg cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-dark-bg border-t-transparent animate-spin" />
                      SUBMITTING TRANSMISSION...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SEND SECURE INQUIRY
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
