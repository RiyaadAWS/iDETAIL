/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Check, ShieldAlert, MessageCircle, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Product } from "./types";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import ShopView from "./components/ShopView";
import CategoriesView from "./components/CategoriesView";
import AboutView from "./components/AboutView";
import ServicesView from "./components/ServicesView";
import CartSidebar from "./components/CartSidebar";
import CheckoutDrawer from "./components/CheckoutDrawer";
import StandaloneProductView from "./components/StandaloneProductView";
import OrdersHistoryView from "./components/OrdersHistoryView";
import AuthModal from "./components/AuthModal";
import AdminPortalView from "./components/AdminPortalView";
import ContactView from "./components/ContactView";
import { useFirebase } from "./context/FirebaseContext";

export default function App() {
  const { currentUser, userProfile, updateLoyaltyPointsFirebase, authError, clearAuthError, isAdmin, products } = useFirebase();
  const [activeTab, setActiveTab ] = useState<string>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [standaloneProductId, setStandaloneProductId] = useState<number | null>(null);

  // Theme Management (Light and Dark Mode Toggle)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("idetail-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    try {
      localStorage.setItem("idetail-theme", theme);
    } catch {}
  }, [theme]);

  // Read product ID from query parameter on initial load
  useEffect(() => {
    const handleUrlCheck = () => {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get("product");
      if (prodId) {
        setStandaloneProductId(parseInt(prodId, 10));
      } else {
        setStandaloneProductId(null);
      }
    };

    handleUrlCheck();
    window.addEventListener("popstate", handleUrlCheck);
    return () => window.removeEventListener("popstate", handleUrlCheck);
  }, []);
  
  // Points loyalty
  const [guestLoyaltyPoints, setGuestLoyaltyPoints] = useState(() => {
    try {
      const saved = localStorage.getItem("idetail-loyalty-points");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Save loyalty points
  useEffect(() => {
    localStorage.setItem("idetail-loyalty-points", guestLoyaltyPoints.toString());
  }, [guestLoyaltyPoints]);

  const activePoints = currentUser && userProfile ? userProfile.loyaltyPoints : guestLoyaltyPoints;

  // Load initial cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("idetail-cart-v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to local storage whenever items change
  useEffect(() => {
    localStorage.setItem("idetail-cart-v1", JSON.stringify(cartItems));
  }, [cartItems]);

  // Toast confirmation helper
  const [toast, setToast] = useState<{ id: string; message: string } | null>(null);

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3800);
  };

  // Add Item to cart
  const handleAddToCart = (product: Product) => {
    const dbProduct = products.find(p => p.id === product.id) || product;
    const stockCount = dbProduct.stockCount !== undefined ? dbProduct.stockCount : 15;

    if (stockCount <= 0 || !dbProduct.inStock) {
      showToast(`Cannot add ${product.name}: OUT OF STOCK.`);
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= stockCount) {
          showToast(`Cannot add more: only ${stockCount} units on hand.`);
          return prevItems;
        }
        showToast(`Incremented: ${product.name} count in cart.`);
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showToast(`Added ${product.name} to your detailing cart.`);
      return [...prevItems, { product: dbProduct, quantity: 1 }];
    });
    // Auto-open sliding panel drawer
    setIsCartOpen(true);
  };

  // Update item counts (-1 / +1)
  const handleUpdateQuantity = (productId: number, delta: number) => {
    const dbProduct = products.find(p => p.id === productId);
    const stockCount = dbProduct?.stockCount !== undefined ? dbProduct.stockCount : 15;

    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (delta > 0 && nextQty > stockCount) {
              showToast(`Only ${stockCount} units of ${item.product.name} are available.`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Remove completely from cart
  const handleRemoveItem = (productId: number) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((item) => item.product.id === productId);
      if (target) {
        showToast(`Removed ${target.product.name} from cart.`);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  // Checkout Success callback
  const handleOrderCompletedSuccess = () => {
    setCartItems([]); // Clear local state list
    localStorage.removeItem("idetail-cart-v1"); // Reset persistent storage
    if (currentUser && userProfile) {
      updateLoyaltyPointsFirebase(250);
    } else {
      setGuestLoyaltyPoints((prev) => prev + 250); // Add 250 loyalty club points!
    }
    showToast("SUCCESS: Chemical formulations ordered. Check email tracking.");
  };

  const totalCartCount = cartItems.reduce((currSum, item) => currSum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col justify-between">
      
      {/* 1. TOP HEADER & NAVBAR NAVIGATION */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.history.pushState({}, "", window.location.pathname);
          setStandaloneProductId(null);
        }}
        cartCount={totalCartCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab("shop");
          window.history.pushState({}, "", window.location.pathname);
          setStandaloneProductId(null);
        }}
        theme={theme}
        onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        onAuthOpen={() => setIsAuthModalOpen(true)}
      />

      {/* Main Structural Area - Dashboard sidebar layout */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto overflow-hidden">
        
        {/* Left Side Aside - Desktop navigation/analytics */}
        {standaloneProductId === null && (
          <aside className="hidden lg:flex w-64 border-r border-white/10 p-8 flex-col justify-between shrink-0 bg-panel-bg">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-5 font-bold">
                  Catalog Navigation
                </h3>
                <ul className="space-y-3.5">
                  {[
                    { id: "all", label: "All Products" },
                    { id: "exterior", label: "Exterior Care" },
                    { id: "interior", label: "Interior Detail" },
                    { id: "ceramic", label: "Ceramic Coatings" },
                    { id: "accessories", label: "Accessories" },
                  ].map((cat) => {
                    const isActive = activeTab === "shop" && selectedCategory === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setActiveTab("shop");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`flex items-center text-xs font-bold uppercase tracking-wider transition-all w-full text-left cursor-pointer group ${
                            isActive
                              ? "text-electric-blue"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-3.5 transition-all ${
                              isActive
                                ? "bg-electric-blue scale-125 shadow-lg shadow-electric-blue/50"
                                : "bg-gray-700 group-hover:bg-white"
                            }`}
                          />
                          {cat.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-5 font-bold">
                  Applet Views
                </h3>
                <ul className="space-y-3.5">
                  {[
                    { id: "home", label: "Home Showcase" },
                    { id: "services", label: "Mobile Services" },
                    { id: "categories", label: "Categories Grid" },
                    { id: "about", label: "Detailing Academy" },
                    { id: "contact", label: "Contact Us" },
                    ...(currentUser ? [{ id: "orders", label: "My Orders" }] : []),
                    ...(isAdmin ? [{ id: "admin", label: "Admin Portal" }] : []),
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`flex items-center text-xs font-bold uppercase tracking-wider transition-all w-full text-left cursor-pointer group ${
                            isActive
                              ? "text-electric-blue"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-3.5 transition-all ${
                              isActive
                                ? "bg-electric-blue scale-125 shadow-lg"
                                : "bg-gray-700 group-hover:bg-white"
                            }`}
                          />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-electric-blue/15 to-transparent border border-electric-blue/20 rounded-xl mt-6">
              <p className="text-[10px] text-electric-blue font-bold uppercase mb-1 tracking-[0.1em]">
                Pro Loyalty
              </p>
              <p className="text-xl font-black text-white font-mono">
                {activePoints.toLocaleString()}{" "}
                <span className="text-xs font-normal text-gray-400 font-sans">pts</span>
              </p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-electric-blue h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activePoints % 2000) / 20)}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-wider">
                Earn +250 per order
              </p>
            </div>
          </aside>
        )}

        {/* 2. CORE VIEW COORDINATION PORT FRAMEWORK */}
        <main className="flex-1 min-w-0">
          {standaloneProductId !== null ? (
            <StandaloneProductView
              productId={standaloneProductId}
              onBackToApp={() => {
                window.history.pushState({}, "", window.location.pathname);
                setStandaloneProductId(null);
              }}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {activeTab === "home" && (
                  <HomeView
                    onNavigate={setActiveTab}
                    onSelectCategory={setSelectedCategory}
                    onAddToCart={handleAddToCart}
                  />
                )}

                {activeTab === "shop" && (
                  <ShopView
                    onAddToCart={handleAddToCart}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                )}

                {activeTab === "categories" && (
                  <CategoriesView
                    onSelectCategory={setSelectedCategory}
                    onNavigate={setActiveTab}
                  />
                )}

                {activeTab === "services" && (
                  <ServicesView />
                )}

                {activeTab === "about" && <AboutView />}

                {activeTab === "contact" && <ContactView />}

                {activeTab === "orders" && (
                  <OrdersHistoryView
                    onExploreProducts={() => {
                      setSelectedCategory("all");
                      setActiveTab("shop");
                    }}
                    onAuthOpen={() => setIsAuthModalOpen(true)}
                  />
                )}

                {activeTab === "admin" && (
                  <AdminPortalView
                    onExploreProducts={() => {
                      setSelectedCategory("all");
                      setActiveTab("shop");
                    }}
                    onAuthOpen={() => setIsAuthModalOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* 3. FOOTER SIGN-OFF PANEL (Sleek Professional Polish Theme Footer) */}
      <footer className="bg-panel-bg border-t border-white/10 flex flex-col md:flex-row items-center py-6 px-4 sm:px-10 justify-between gap-4 shrink-0 text-xs font-mono text-gray-500">
        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-widest">
          <span className="flex items-center">
            <span className="text-electric-blue mr-2">●</span> Free Express Shipping
          </span>
          <span className="flex items-center">
            <span className="text-electric-blue mr-2">●</span> 24/7 Expert Support
          </span>
          <span className="flex items-center">
            <span className="text-electric-blue mr-2">●</span> Secure Payments
          </span>
        </div>
        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] text-center md:text-right">
          © 2026 iDETAIL LLC AUTOMOTIVE SOLUTIONS • ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* 4. MODULAR SLIDING DRAWERS & OVERLAYS */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderCompletedSuccess}
      />

      {/* Auth Modal Custom Form */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 5. FLOATING CONFIRMATION TOAST CARD */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-card-bg border border-electric-blue/40 rounded-xl p-4 shadow-2xl flex gap-3 items-start"
          >
            <div className="bg-electric-blue/10 rounded-full p-1.5 shrink-0 text-electric-blue mt-0.5">
              <Check className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-display uppercase tracking-wider mb-0.5">
                Cart Notification
              </p>
              <p className="text-xs text-gray-300 font-sans leading-normal">
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Auth Error Helper Modal */}
      <AnimatePresence>
        {authError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-lg w-full bg-panel-bg border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Decorative light ring */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent" />

              {/* Close Button */}
              <button
                onClick={clearAuthError}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                aria-label="Dismiss error modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center mt-2">
                {/* Warning Icon Badge */}
                <div className="bg-amber-500/15 text-amber-400 rounded-full p-3.5 mb-5 ring-1 ring-amber-500/30">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                {authError === "UNAUTHORIZED_DOMAIN" ? (
                  <>
                    <h3 className="text-lg font-bold text-white text-center font-sans uppercase tracking-wide leading-tight">
                      Authorize App Domain in Firebase
                    </h3>
                    
                    <p className="text-xs text-gray-400 mt-2 text-center max-w-sm leading-relaxed">
                      To secure your login flow, Firebase requires your active preview domain to be explicitly listed as an authorized domain in the Firebase Console.
                    </p>

                    {/* Step by Step Guide */}
                    <div className="w-full mt-6 space-y-4 text-left">
                      <div className="border border-electric-blue/30 bg-electric-blue/5 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="bg-electric-blue text-dark-bg font-mono font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">1</span>
                          Copy Your Preview Domain
                        </h4>
                        <div className="bg-black/40 rounded-lg p-2.5 flex items-center justify-between gap-2 border border-white/5 select-all">
                          <code className="text-xs text-electric-blue font-mono select-all truncate">
                            {window.location.hostname}
                          </code>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.hostname);
                              showToast("Domain copied to clipboard!");
                            }}
                            className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-2 py-1 rounded border border-white/10 shrink-0 cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="border border-white/5 bg-white/2 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="bg-white/10 text-gray-400 font-mono font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">2</span>
                          Add to Firebase Console
                        </h4>
                        <ol className="text-[11px] text-gray-400 space-y-1.5 pl-1 list-decimal list-inside">
                          <li>Go to <a href={`https://console.firebase.google.com/project/idetail-d891c/authentication/providers`} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline inline-flex items-center gap-0.5 font-bold">Firebase Console <ExternalLink className="w-2.5 h-2.5 inline" /></a></li>
                          <li>Click on the <strong>Settings</strong> tab in Authentication</li>
                          <li>Click on <strong>Authorized Domains</strong> in the left pane</li>
                          <li>Click <strong>Add domain</strong> and paste the copied domain above</li>
                        </ol>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white text-center font-sans uppercase tracking-wide leading-tight">
                      Google Sign-In Preview Hint
                    </h3>
                    
                    <p className="text-xs text-gray-400 mt-2 text-center max-w-sm leading-relaxed">
                      The Google login popup was closed, blocked, or failed to communicate. Sandbox preview environments (using iframes) enforce strict browser cross-origin limits that inspect popup communications.
                    </p>

                    {/* Guide Options */}
                    <div className="w-full mt-6 space-y-4 text-left">
                      {/* Option 1: Open in New Tab */}
                      <div className="border border-electric-blue/30 bg-electric-blue/5 rounded-xl p-4 flex gap-3.5 items-start">
                        <div className="bg-electric-blue/10 rounded-lg p-1.5 shrink-0 text-electric-blue text-[10px] font-bold font-mono px-2 py-0.5 mt-0.5">
                          TAB
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                            Open App in a New Tab (Recommended)
                          </h4>
                          <p className="text-[11px] text-gray-300 leading-normal">
                            Click below to launch the detached full-screen application. Standard Google login will execute without iframe origin constraints!
                          </p>
                          <a
                            href={window.location.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2.5 bg-electric-blue hover:bg-opacity-90 text-dark-bg text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all shadow-md cursor-pointer"
                          >
                            Launch in New Tab
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Option 2: Fallback */}
                      <div className="border border-white/5 bg-white/2 rounded-xl p-4 flex gap-3.5 items-start animate-fade-in">
                        <div className="bg-white/10 rounded-lg p-1.5 shrink-0 text-gray-400 text-[10px] font-bold font-mono px-2 py-0.5 mt-0.5">
                          GUEST
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                            Or Continue as Guest
                          </h4>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            You can continue using the application offline or as a guest. All detailing point awards and order forms remain fully operational!
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer Controls */}
                <div className="w-full flex gap-3 mt-6">
                  <button
                    onClick={clearAuthError}
                    className="flex-1 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close & proceed as guest
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. WHATSAPP CHAT SUPPORT WIDGET */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <div className="absolute -top-12 left-0 scale-90 opacity-0 bg-gray-900 border border-white/10 text-white text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl">
          Chat with an Expert 💬
        </div>
        <a
          href="https://wa.me/27766441575"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 active:scale-95 hover:shadow-[#25D366]/35 transition-all duration-300 cursor-pointer"
          aria-label="Contact via WhatsApp"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-35 animate-ping" />
          <MessageCircle className="w-5 h-5 shrink-0 relative z-10 fill-current" />
          {/* Animated notification dot */}
          <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </a>
      </div>

    </div>
  );
}
