/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Package, 
  Search, 
  Calendar, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Truck, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  MessageSquare,
  HelpCircle,
  FileText,
  X,
  AlertCircle,
  Clock
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";
import { motion, AnimatePresence } from "motion/react";
import InvoiceModal from "./InvoiceModal";

export default function OrdersHistoryView({ 
  onExploreProducts,
  onAuthOpen 
}: { 
  onExploreProducts: () => void;
  onAuthOpen: () => void;
}) {
  const { currentUser, userProfile, orders, isOrdersLoading, refreshOrders, requestReturn } = useFirebase();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<any>(null);
  const [returnOrder, setReturnOrder] = useState<any | null>(null);
  const [returnReason, setReturnReason] = useState("Incorrect formulation");
  const [returnDetails, setReturnDetails] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  const handleCopy = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === "all" || 
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/25",
          text: "text-emerald-400",
          pill: "bg-emerald-500",
          label: "Completed"
        };
      case "processing":
        return {
          bg: "bg-[#00d9ff]/10 border-[#00d9ff]/25",
          text: "text-electric-blue",
          pill: "bg-electric-blue",
          label: "Processing"
        };
      case "cancelled":
        return {
          bg: "bg-rose-500/10 border-rose-500/25",
          text: "text-rose-400",
          pill: "bg-rose-500",
          label: "Cancelled"
        };
      case "return_requested":
        return {
          bg: "bg-amber-500/10 border-amber-500/25",
          text: "text-amber-400",
          pill: "bg-amber-500",
          label: "Return Requested"
        };
      case "returned":
        return {
          bg: "bg-purple-500/10 border-purple-500/25",
          text: "text-purple-400",
          pill: "bg-purple-500",
          label: "Returned"
        };
      case "pending":
      default:
        return {
          bg: "bg-amber-400/10 border-amber-400/20",
          text: "text-amber-400",
          pill: "bg-amber-400",
          label: "Pending"
        };
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  const getEstimatedArrival = (isoString: string) => {
    try {
      const d = new Date(isoString);
      d.setDate(d.getDate() + 1); // Estimated Next Day Delivery
      return d.toLocaleDateString("en-ZA", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Next Business Day";
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. SECTION HEADER CONTAINER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-electric-blue uppercase font-mono flex items-center gap-1.5">
            <Package className="w-4 h-4 animate-pulse" />
            CUSTOMER SUITE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-1.5">
            Orders
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans mt-1">
            {currentUser 
              ? `Review tracked shipments and detailing point awards assigned to ${currentUser.email}.`
              : "Access simulated delivery dispatch information and formulation details."
            }
          </p>
        </div>

        {currentUser && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isOrdersLoading}
            className="self-start md:self-auto inline-flex items-center gap-2 border border-white/10 hover:border-electric-blue/30 bg-white/5 hover:bg-electric-blue/10 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync Logs
          </button>
        )}
      </div>

      {/* 2. AUTHENTICATION REQUIRED STATE OR CONTENT SPLIT */}
      {!currentUser ? (
        <div className="bg-card-bg/40 border border-white/5 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto relative overflow-hidden backdrop-blur-md">
          {/* Subtle background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-6 font-mono font-bold">
            iDT
          </div>

          <h3 className="font-display font-bold text-xl text-white tracking-tight">
            Sign In to Fetch Permanent History
          </h3>
          
          <p className="text-xs text-gray-400 mt-3 leading-relaxed max-w-md mx-auto">
            You're currently browsing as a guest. Authenticate with your profile credentials or Google to securely save order dispatch timelines permanently across your automotive devices.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={onAuthOpen}
              className="bg-electric-blue hover:bg-opacity-90 text-dark-bg text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-electric-blue/15 hover:-translate-y-0.5"
            >
              Sign In / Register
            </button>
            <button
              onClick={onExploreProducts}
              className="border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Browse Catalog Only
            </button>
          </div>

          {orders.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/5 text-left">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-500 mb-4 text-center">
                Temporary Guest Session Logs ({orders.length})
              </h4>
              
              <div className="space-y-4">
                {orders.map((order) => {
                  const s = getStatusStyle(order.status);
                  return (
                    <div 
                      key={order.orderId}
                      className="border border-white/5 bg-black/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-electric-blue font-bold tracking-wider">{order.orderId}</code>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${s.bg} ${s.text} uppercase`}>
                            {s.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Placed: {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-start gap-4">
                        <div className="text-right">
                          <p className="text-gray-400 text-[10px]">Total Price</p>
                          <p className="text-white font-bold font-mono">
                            R {order.totalPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue hover:text-white border border-electric-blue/20 hover:border-electric-blue p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                            title="View Tax Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={onAuthOpen}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 p-2 rounded-lg cursor-pointer"
                            title="Login to Claim Points"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* SEARCH & STATUS FILTER RAIL */}
          <div className="flex flex-col sm:flex-row gap-3 bg-panel-bg border border-white/5 p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by formulation ID, name..."
                className="w-full bg-dark-bg text-white pl-10 pr-4 py-2.5 rounded-xl text-xs border border-white/5 focus:border-electric-blue/40 focus:outline-none transition-colors"
                id="order-search-input"
              />
            </div>

            <div className="flex gap-1.5 self-start sm:self-auto shrink-0">
              {["all", "pending", "processing", "completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-electric-blue text-dark-bg border-electric-blue font-extrabold"
                      : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* LOADER STATE */}
          {isOrdersLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.15em] animate-pulse">
                Accessing Firestore Databases...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* EMPTY LOGS STATE */
            <div className="bg-card-bg/30 border border-white/5 rounded-3xl py-16 px-6 text-center max-w-xl mx-auto space-y-5">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-semibold text-lg text-white">No Dispatches Registered</h3>
                <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "Adjust search parameters or status filters to locate specific orders."
                    : "Your active detailing account has not initialized or purchased catalog items yet."
                  }
                </p>
              </div>
              <button
                onClick={onExploreProducts}
                className="inline-flex items-center gap-1.5 bg-electric-blue hover:bg-opacity-90 text-dark-bg text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer hover:translate-x-0.5"
              >
                Go to Chemical Shop
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* LIST OF ORDERS */
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.orderId;
                const progress = getStatusStyle(order.status);
                
                return (
                  <div 
                    key={order.orderId}
                    className="border border-white/5 hover:border-white/10 bg-panel-bg rounded-2xl overflow-hidden transition-all shadow-lg"
                    id={`order-card-${order.orderId}`}
                  >
                    {/* Header Row Clickable to expand */}
                    <div 
                      onClick={() => handleToggleExpand(order.orderId)}
                      className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none relative"
                    >
                      {/* Left Block: Tracking Details */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <code className="text-sm font-bold text-electric-blue tracking-wider">
                            {order.orderId}
                          </code>
                          <button
                            onClick={(e) => handleCopy(order.orderId, e)}
                            className="p-1 px-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer border border-white/5 flex items-center gap-1 text-[9px]"
                            title="Copy Order ID to clipboard"
                          >
                            {copiedId === order.orderId ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 uppercase font-bold font-mono">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="uppercase font-mono">Copy ID</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInvoiceOrder(order);
                            }}
                            className="p-1 px-1.5 rounded bg-electric-blue/5 hover:bg-electric-blue/25 text-electric-blue border border-electric-blue/10 flex items-center gap-1 text-[9px] transition-all cursor-pointer"
                            title="View Tax Invoice"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="uppercase font-mono">Invoice</span>
                          </button>

                          <span className={`px-2.5 py-0.5 rounded text-[9px] border hover:opacity-90 transition-opacity font-extrabold uppercase ${progress.bg} ${progress.text}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${progress.pill} mr-1.5 animate-pulse`} />
                            {progress.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-sans">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} formulation items</span>
                        </div>
                      </div>

                      {/* Right Block: Cost Summary & Action */}
                      <div className="flex items-center justify-between md:justify-end gap-5">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold leading-tight">Total Price</p>
                          <p className="text-lg font-black text-white font-mono leading-tight mt-0.5">
                            R {order.totalPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="hidden sm:block p-1 bg-white/5 border border-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Section Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-white/5 bg-black/20"
                        >
                          <div className="p-5 sm:p-6 space-y-6">
                            
                            {/* Order Specifications Inventory List */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 font-mono">
                                Receipt Formula Breakdown
                              </h4>
                              
                              <div className="border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                                {order.items.map((item, index) => (
                                  <div 
                                    key={index} 
                                    className="p-3.5 flex items-center justify-between gap-4 text-xs bg-dark-bg/30"
                                  >
                                    <div className="space-y-0.5">
                                      <p className="font-bold text-white uppercase tracking-wide">
                                        {item.name}
                                      </p>
                                      <p className="text-[10px] text-gray-500 font-mono">
                                        Quantity: {item.quantity} × R {item.price.toFixed(2)}
                                      </p>
                                    </div>
                                    <p className="font-mono text-white font-bold">
                                      R {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Return Request/Completed Banners */}
                            {order.status.toLowerCase() === "return_requested" && (
                              <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl space-y-1 text-xs">
                                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-amber-400 tracking-wider font-mono">
                                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                                  Return Pending Approval
                                </div>
                                <p className="text-gray-400 leading-normal font-sans">
                                  Reason category: <strong className="text-white">{(order as any).returnReason || "Not specified"}</strong>
                                  {(order as any).returnDetails && (
                                    <>
                                      <br />
                                      Customer feedback: <span className="text-gray-300 italic">"{(order as any).returnDetails}"</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            )}

                            {order.status.toLowerCase() === "returned" && (
                              <div className="border border-purple-500/20 bg-purple-500/5 p-4 rounded-xl space-y-1 text-xs">
                                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-purple-400 tracking-wider font-mono">
                                  <Check className="w-4 h-4 text-purple-400" />
                                  Return Completed
                                </div>
                                <p className="text-gray-400 leading-normal font-sans">
                                  This chemical formulation package was returned successfully. Formulations have been synced and registered points adjusted.
                                </p>
                              </div>
                            )}

                            {/* Logistics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="border border-white/5 bg-white/2 p-4 rounded-xl space-y-1.5 text-xs">
                                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-electric-blue tracking-wider font-mono">
                                  <Truck className="w-4 h-4 text-electric-blue" />
                                  Logistics & Dispatch
                                </div>
                                <p className="text-gray-400 font-sans leading-normal">
                                  Shipping method: <strong className="text-white font-medium">Chemical Ground Cargo</strong>
                                  <br />
                                  Estimated arrival: <strong className="text-emerald-400 font-semibold">{getEstimatedArrival(order.createdAt)}</strong>
                                </p>
                              </div>

                              <div className="border border-white/5 bg-white/2 p-4 rounded-xl space-y-1.5 text-xs">
                                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-emerald-400 tracking-wider font-mono">
                                  <Sparkles className="w-4 h-4 text-emerald-400" />
                                  Award Points
                                </div>
                                <p className="text-gray-400 font-sans leading-normal">
                                  Your professional loyalty club account is credited with <strong className="text-emerald-400 font-semibold">+250 pts</strong> for validating this order structure.
                                </p>
                              </div>
                            </div>

                            {/* Support Assistance */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-white/5">
                              <span className="text-[11px] text-gray-500 font-sans leading-normal flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4 text-gray-600" />
                                Need a specialized corporate invoice or return adjustment?
                              </span>
                              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                                {order.status.toLowerCase() === "completed" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReturnOrder(order);
                                      setReturnReason("Incorrect formulation");
                                      setReturnDetails("");
                                      setReturnError(null);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-400 font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-lg border border-rose-500/30 cursor-pointer text-center transition-all"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Request Return
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInvoiceOrder(order);
                                  }}
                                  className="inline-flex items-center gap-1.5 bg-electric-blue/10 hover:bg-electric-blue text-electric-blue hover:text-dark-bg font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-lg border border-electric-blue/30 cursor-pointer text-center transition-all"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Tax Invoice
                                </button>
                                
                                <a 
                                  href={`https://wa.me/27820000000?text=Hi%20iDetail%20support,%20I%20have%20a%20question%20about%20my%20order%20${order.orderId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-lg border border-white/10 cursor-pointer text-center"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-electric-blue" />
                                  Support Chat
                                </a>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Modern Tax Invoice overlay */}
      <InvoiceModal
        isOpen={invoiceOrder !== null}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
        customerName={userProfile?.displayName || currentUser?.displayName || "iDetail Professional"}
        customerEmail={currentUser?.email || undefined}
      />

      {/* Return Request Modal */}
      <AnimatePresence>
        {returnOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturnOrder(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm print:hidden"
            />

            {/* Modal Canvas wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-lg bg-[#0d0f12] bg-card-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 bg-[#14181f] bg-panel-bg border-b border-white/5 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Return Formulation Request</h3>
                    <p className="text-[10px] text-gray-400 font-mono">Initiate return logistics for chemical packages</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setReturnOrder(null)}
                  className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div className="bg-white/2 border border-white/5 p-4 rounded-xl space-y-1.5 text-xs text-gray-400">
                  <p className="font-semibold text-white uppercase text-[10px] font-mono tracking-wider text-rose-400">Return Eligibility Policy</p>
                  <p className="leading-relaxed font-sans">
                    Chemical formulation containers can only be returned if they are unsealed, completely full, and still in their temperature-regulated containment pads. All returned components undergo chemical validation scans.
                  </p>
                </div>

                {returnError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="font-sans leading-normal">{returnError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-extrabold font-mono mb-1.5">
                      Return Reason Category
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full bg-[#13161a] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500/45 focus:outline-none cursor-pointer"
                    >
                      <option value="Incorrect formulation">Incorrect formulation</option>
                      <option value="Damaged on arrival">Damaged on arrival</option>
                      <option value="Packaging leak / Unsealed container">Packaging leak / Unsealed container</option>
                      <option value="Unsatisfactory performance">Unsatisfactory performance</option>
                      <option value="Ordered by mistake">Ordered by mistake</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-extrabold font-mono mb-1.5">
                      Detailed Return Feedback & Description
                    </label>
                    <textarea
                      value={returnDetails}
                      onChange={(e) => setReturnDetails(e.target.value)}
                      placeholder="Please specify any leaks, damaged labels, or formulation variance details to accelerate validation..."
                      rows={4}
                      className="w-full bg-[#13161a] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500/45 focus:outline-none font-sans leading-normal resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#14181f] bg-panel-bg border-t border-white/5 flex items-center justify-between gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setReturnOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer font-bold uppercase tracking-wider font-mono"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSubmittingReturn}
                  onClick={async () => {
                    if (isSubmittingReturn) return;
                    setIsSubmittingReturn(true);
                    setReturnError(null);
                    try {
                      await requestReturn(returnOrder.orderId, returnOrder.userId, returnReason, returnDetails);
                      setReturnOrder(null);
                      await refreshOrders();
                    } catch (err: any) {
                      console.error("Return submit fail:", err);
                      setReturnError(err?.message || "Failed to submit return request.");
                    } finally {
                      setIsSubmittingReturn(false);
                    }
                  }}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/10"
                >
                  {isSubmittingReturn ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm Return Protocol"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
