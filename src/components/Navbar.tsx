/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShoppingBag, Menu, X, Car, Sparkles, Sun, Moon, LogIn, LogOut, User } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onCartToggle: () => void;
  setSelectedCategory: (cat: string) => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
  onAuthOpen: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  onCartToggle,
  setSelectedCategory,
  theme = "dark",
  onThemeToggle,
  onAuthOpen,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout, isAdmin } = useFirebase();

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    { id: "services", label: "Services" },
    { id: "categories", label: "Categories" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    ...(currentUser ? [{ id: "orders", label: "My Orders" }] : []),
    ...(isAdmin ? [{ id: "admin", label: "Admin" }] : []),
  ];

  const handleNavClick = (tabId: string) => {
    if (tabId === "shop") {
      setSelectedCategory("all");
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-white/10 shadow-lg h-20 flex items-center shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-electric-blue/10 border border-electric-blue/30 group-hover:border-electric-blue/50 transition-colors duration-300">
              <Car className="w-5 h-5 text-electric-blue" />
              <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-electric-blue animate-pulse" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-white transition-colors duration-300">
              i<span className="text-electric-blue">DETAIL</span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === item.id
                    ? "text-electric-blue border-b-2 border-electric-blue pb-1"
                    : "text-gray-400 hover:text-white pb-1"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Shopping Cart, Auth Status, Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Trigger */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="p-2.5 rounded-lg border border-white/10 hover:border-electric-blue/30 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                aria-label="Toggle Theme Color"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-500" />
                )}
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={onCartToggle}
              className="relative p-2.5 rounded-lg border border-white/10 hover:border-electric-blue/30 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
              aria-label="Toggle Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-electric-blue transition-colors duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-electric-blue text-[10px] font-black text-dark-bg ring-2 ring-dark-bg animate-bounce font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Firebase Authentication Chip */}
            <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] font-bold text-white max-w-[110px] truncate leading-tight">
                      {currentUser.displayName || "iDetail Member"}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono font-bold leading-none">
                      {userProfile ? `${userProfile.loyaltyPoints.toLocaleString()} pts` : "Loading..."}
                    </span>
                  </div>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User Avatar"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-electric-blue/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-electric-blue/20 border border-electric-blue/40 flex items-center justify-center text-electric-blue font-bold text-xs">
                      {currentUser.email?.[0].toUpperCase() || "U"}
                    </div>
                  )}
                  <button
                    onClick={logout}
                    className="p-1 px-1.5 ml-1 rounded-lg border border-white/10 hover:border-rose-500/30 text-gray-400 hover:text-rose-400 transition-all cursor-pointer"
                    title="Log Out of Firebase"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthOpen}
                  className="flex items-center gap-1.5 bg-electric-blue/10 hover:bg-electric-blue hover:text-dark-bg text-electric-blue border border-electric-blue/20 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer hover:-translate-y-0.5 shadow-lg active:translate-y-0"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0f1116] px-4 py-4 space-y-3 absolute top-20 left-0 right-0 z-50 animate-fadeIn duration-200 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left py-2.5 px-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id
                  ? "bg-electric-blue/15 border-l-4 border-electric-blue text-electric-blue"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Auth Button */}
          <div className="pt-3 border-t border-white/15">
            {currentUser ? (
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <User className="w-4.5 h-4.5 text-electric-blue" />
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[150px]">
                      {currentUser.displayName || currentUser.email}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      {userProfile ? `${userProfile.loyaltyPoints} loyalty pts` : "Active Member"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAuthOpen();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-electric-blue text-dark-bg rounded-xl py-2.5 text-xs font-bold cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

