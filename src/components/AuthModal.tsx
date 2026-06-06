/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, LogIn, UserPlus, Mail, Lock, User, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFirebase } from "../context/FirebaseContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError, clearAuthError } = useFirebase();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMode = () => {
    setMode(prev => prev === "login" ? "register" : "login");
    setLocalError(null);
    clearAuthError();
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  const handleClose = () => {
    setLocalError(null);
    clearAuthError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    // Standard Validation
    if (!email.trim() || !email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "register" && !displayName.trim()) {
      setLocalError("Full name is required.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      // Friendly messaging (stripping Firebase codes if present)
      let customMsg = err.message || "";
      if (customMsg.includes("auth/email-already-in-use")) {
        customMsg = "This email is already in use by another account.";
      } else if (customMsg.includes("auth/invalid-credential")) {
        customMsg = "Incorrect credentials. Please verify your email and password.";
      } else if (customMsg.includes("auth/weak-password")) {
        customMsg = "The password is too weak. Must be at least 6 characters.";
      } else if (customMsg.includes("auth/user-not-found")) {
        customMsg = "No account exists with this email address.";
      } else if (customMsg.includes("auth/wrong-password")) {
        customMsg = "Incorrect password. Please try again.";
      }
      setLocalError(customMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setLocalError(null);
    clearAuthError();
    setIsLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error("Google login failed inside AuthModal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="auth-modal-overlay" className="fixed inset-0 z-50 overflow-hidden flex justify-center items-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Form Container Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-md bg-card-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header branding background */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-electric-blue via-indigo-500 to-electric-blue" />

            {/* Top Bar close */}
            <button
              onClick={handleClose}
              id="auth-modal-close-btn"
              className="absolute top-4 right-4 p-1 rounded-lg border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer z-10"
              aria-label="Close Authentication Form"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title Block */}
            <div className="px-6 sm:px-8 pt-8 pb-5 text-center">
              <div className="mx-auto w-10 h-10 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center text-electric-blue mb-3">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>

              <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                {mode === "login" ? "Welcome Back" : "Formulate Account"}
              </h2>
              <p className="text-xs text-gray-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                {mode === "login" 
                  ? "Sign in to save loyalty formulations, review order tracks, and secure points." 
                  : "Register today and receive a formulation welcome pack matching your specs."}
              </p>
            </div>

            {/* Notifications and feedback errors */}
            {(localError || authError) && (
              <div className="bg-rose-500/10 border-y border-rose-500/10 px-6 sm:px-8 py-3.5 flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-300 leading-relaxed">
                  {localError || authError}
                </p>
              </div>
            )}

            {/* Body Forms */}
            <div className="px-6 sm:px-8 pb-8 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* For signup displayName input */}
                {mode === "register" && (
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5 font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500 pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email address field */}
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@automotive.com"
                      className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5 font-mono flex justify-between items-center">
                    <span>Password</span>
                    {mode === "login" && (
                      <span className="text-[9px] lowercase text-gray-500 hover:text-electric-blue cursor-pointer transition-colors">
                        forgot?
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-dark-bg text-white border border-white/5 focus:border-electric-blue/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none transition-colors"
                    />
                  </div>
                  {mode === "register" && (
                    <p className="text-[9px] text-gray-500 mt-1 font-sans">
                      Must be at least 6 alphanumeric characters.
                    </p>
                  )}
                </div>

                {/* Main Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  id="auth-submit-btn"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-midnight-blue to-electric-blue hover:from-electric-blue hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : mode === "login" ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In to Premium
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Register Account
                    </>
                  )}
                </button>

              </form>

              {/* Separator / Google Provider integration */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] font-mono tracking-widest uppercase">
                  <span className="bg-card-bg px-3 text-gray-500">OR PROVIDER ACTION</span>
                </div>
              </div>

              {/* Google Log in action */}
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isLoading}
                id="auth-google-btn"
                className="w-full flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 px-4 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {/* Mode Switch Toggle link */}
              <div className="text-center mt-5 text-gray-400 text-xs">
                {mode === "login" ? "Don't have an account? " : "Already secure an account? "}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="font-black text-electric-blue hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                >
                  {mode === "login" ? "Create One" : "Sign In"}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
