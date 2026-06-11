/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowRight,
  Sliders,
  Sparkles,
  PackageCheck,
  Calendar,
  Truck,
  Edit2,
  Trash2,
  Lock,
  Compass,
  ArrowLeft,
  Plus,
  Minus,
  Cpu
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";
import { motion, AnimatePresence } from "motion/react";
import { Order } from "../types";
import DiagnosticsTestSuite from "./DiagnosticsTestSuite";

export default function AdminPortalView({ 
  onExploreProducts,
  onAuthOpen 
}: { 
  onExploreProducts: () => void;
  onAuthOpen: () => void;
}) {
  const { 
    currentUser, 
    isAdmin, 
    fetchAllOrdersForAdmin, 
    updateOrderStatus, 
    saveOrderToFirebase,
    products,
    isProductsLoading,
    addProductToFirebase,
    updateProductInFirebase
  } = useFirebase();

  const [activeAdminTab, setActiveAdminTab] = useState<"orders" | "inventory" | "diagnostics">("orders");
  const [invSearchQuery, setInvSearchQuery] = useState("");
  const [invFilter, setInvFilter] = useState<"all" | "low" | "out">("all");

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: 150,
    category: "exterior" as "exterior" | "interior" | "ceramic" | "accessories",
    categoryLabel: "Exterior Care",
    icon: "✨",
    image: "",
    description: "",
    fullDescription: "",
    rating: 5,
    reviewsCount: 0,
    benefits: "",
    instructions: "",
    size: "500ml",
    inStock: true,
    isFeatured: false,
    stockCount: 15,
  });

  const startEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      category: prod.category,
      categoryLabel: prod.categoryLabel,
      icon: prod.icon,
      image: prod.image || "",
      description: prod.description,
      fullDescription: prod.fullDescription,
      rating: prod.rating,
      reviewsCount: prod.reviewsCount,
      benefits: (prod.benefits || []).join(", "),
      instructions: prod.instructions,
      size: prod.size,
      inStock: prod.inStock,
      isFeatured: prod.isFeatured,
      stockCount: prod.stockCount || 0,
    });
  };

  const startAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 150,
      category: "exterior",
      categoryLabel: "Exterior Care",
      icon: "✨",
      image: "",
      description: "",
      fullDescription: "",
      rating: 5,
      reviewsCount: 0,
      benefits: "Deep Clean, High Gloss, UV Resistant",
      instructions: "Apply to cool surface. Wipe off with clean towel.",
      size: "500ml",
      inStock: true,
      isFeatured: false,
      stockCount: 15,
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBenefits = formData.benefits
      .split(",")
      .map(b => b.trim())
      .filter(b => b.length > 0);
      
    const catLabels = {
      exterior: "Exterior Care",
      interior: "Interior Detail",
      ceramic: "Ceramic Coatings",
      accessories: "Accessories"
    };

    const productPayload = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      categoryLabel: catLabels[formData.category],
      icon: formData.icon || "✨",
      image: formData.image || "/src/assets/images/detailing_hero_new_1780495259509.png",
      description: formData.description,
      fullDescription: formData.fullDescription,
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      benefits: cleanBenefits,
      instructions: formData.instructions,
      size: formData.size,
      inStock: Number(formData.stockCount) > 0,
      isFeatured: formData.isFeatured,
      stockCount: Number(formData.stockCount),
    };

    try {
      if (editingProduct) {
        await updateProductInFirebase(editingProduct.id, productPayload);
        setEditingProduct(null);
      } else {
        await addProductToFirebase(productPayload);
        setIsAddProductOpen(false);
      }
    } catch (saveErr) {
      alert("Error saving formulation: " + (saveErr as Error).message);
    }
  };

  const quickAdjustStock = async (product: any, delta: number) => {
    const nextStock = Math.max(0, (product.stockCount || 0) + delta);
    const nextInStock = nextStock > 0;
    try {
      await updateProductInFirebase(product.id, {
        stockCount: nextStock,
        inStock: nextInStock
      });
    } catch (err) {
      console.error("Failed to fast adjust stock:", err);
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedAccount, setSimulatedAccount] = useState("vxHLhkjyyCg6P1oqlM7SQInHKVi1");

  // Load all user orders
  useEffect(() => {
    async function loadData() {
      if (!isAdmin) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetched = await fetchAllOrdersForAdmin();
        setOrders(fetched);
      } catch (err) {
        console.error("Error fetching admin logs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [isAdmin, refreshTrigger, fetchAllOrdersForAdmin]);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleStatusChange = async (orderId: string, userId: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, userId, nextStatus);
      // Manually updates local orders array state
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: nextStatus } : o));
    } catch (err) {
      console.error("Failed to update status on admin dashboard:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const triggerManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Place Simulation test order for vxHLhkjyyCg6P1oqlM7SQInHKVi1 or guest
  const handlePlaceSampleOrder = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const randomOrderId = `iDT-${Math.floor(100000 + Math.random() * 900000)}`;
    const productsList = [
      { product: { id: 101, name: "Ceramic Sealant Spray v2", price: 450 }, quantity: 1 },
      { product: { id: 104, name: "Microfiber Plush Wash Pad", price: 125 }, quantity: 2 },
      { product: { id: 108, name: "pH Balanced Active Snow Foam", price: 295 }, quantity: 1 }
    ];
    // Select subset
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = productsList.slice(0, numItems);
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    try {
      await saveOrderToFirebase(randomOrderId, items, total);
      // Wait for firebase to settle
      setTimeout(() => {
        triggerManualRefresh();
        setIsSimulating(false);
      }, 1000);
    } catch (err) {
      console.error("Simulation order creation fail:", err);
      setIsSimulating(false);
    }
  };

  // KPI calculations
  const totalRevenue = orders
    .filter(o => o.status.toLowerCase() !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingCount = orders.filter(o => o.status.toLowerCase() === "pending").length;
  const processingCount = orders.filter(o => o.status.toLowerCase() === "processing").length;
  const completedCount = orders.filter(o => o.status.toLowerCase() === "completed").length;

  // Filter list
  const filteredOrders = orders.filter(o => {
    const term = searchQuery.toLowerCase();
    const idMatch = o.orderId.toLowerCase().includes(term);
    const userMatch = o.userId.toLowerCase().includes(term);
    const itemMatch = o.items.some(item => item.name.toLowerCase().includes(term));
    const statusMatch = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return (idMatch || userMatch || itemMatch) && statusMatch;
  });

  const filteredProductsInInv = products.filter(p => {
    const term = invSearchQuery.trim().toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(term) || 
                        p.description.toLowerCase().includes(term) ||
                        p.category.toLowerCase().includes(term);
    
    if (!matchSearch) return false;
    
    const stock = p.stockCount || 0;
    if (invFilter === "low") {
      return stock < 10;
    }
    if (invFilter === "out") {
      return !p.inStock || stock === 0;
    }
    return true;
  });

  const getStatusChipStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 border-emerald-500/25 text-emerald-400";
      case "processing":
        return "bg-[#00d9ff]/10 border-[#00d9ff]/25 text-electric-blue";
      case "cancelled":
        return "bg-rose-500/10 border-rose-500/25 text-rose-400";
      case "return_requested":
        return "bg-amber-500/10 border-amber-500/25 text-amber-400";
      case "returned":
        return "bg-purple-500/10 border-purple-500/25 text-purple-400";
      case "pending":
      default:
        return "bg-amber-400/10 border-amber-400/20 text-amber-400";
    }
  };

  // Convert Date
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  // Unauthorized Guardian Shield
  if (!currentUser || !isAdmin) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-8">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-3">
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-white uppercase">
            RESTRICTED AUDIT PORTAL
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-sm mx-auto">
            Access to order dispatches and inventory databases is restricted to verified iDetail Automotive Administrators. Please authenticate with administrator profile credentials to continue.
          </p>
        </div>

        <div className="bg-panel-bg border border-white/5 p-6 rounded-2xl text-left space-y-4">
          <div className="flex gap-3 items-start">
            <Lock className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-white font-bold uppercase tracking-wider font-mono">Simulated Demo Credentials</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                To bypass rules authorization and trigger instant administrator permissions, sign in or register with email:
                <br />
                <code className="text-electric-blue font-bold font-mono text-[11px] select-all bg-black/30 p-1 rounded mt-1.5 inline-block">
                  RiyaadRyklief92@gmail.com
                </code>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onAuthOpen}
          className="bg-electric-blue hover:bg-opacity-90 text-dark-bg text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shadow-electric-blue/10 hover:-translate-y-0.5 cursor-pointer"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-[#00d4ff] uppercase font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            SECURE MANAGEMENT PROTOCOL
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-1.5">
            Administrator Portal
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans mt-0.5">
            Real-time control station for chemical formulation sales, dispatch monitoring, and customer fulfillment logs.
          </p>
        </div>

        {/* DEMO TOOLBAR */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={handlePlaceSampleOrder}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 border border-[#00d4ff]/30 hover:border-[#00d4ff]/60 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer transition-all disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-electric-blue" />
            {isSimulating ? "Ordering..." : "Place Sample Order"}
          </button>

          <button
            onClick={triggerManualRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 border border-white/10 hover:border-electric-blue/30 bg-white/5 hover:bg-electric-blue/10 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Sync Db
          </button>
        </div>
      </div>

      {/* METRIC CARD BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* REVENUE */}
        <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">Gross Income</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
            R {totalRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>Active Sales Stream</span>
          </div>
        </div>

        {/* PENDING */}
        <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-10 h-10 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider font-sans">Pending Queue</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
            {pendingCount}
          </p>
          <p className="text-[10px] text-gray-500 mt-2 font-sans">Awaiting formulation review</p>
        </div>

        {/* PROCESSING */}
        <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-10 h-10 bg-electric-blue/10 rounded-full flex items-center justify-center text-electric-blue">
            <Sliders className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">Processing</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
            {processingCount}
          </p>
          <p className="text-[10px] text-gray-500 mt-2">In chemical packaging lines</p>
        </div>

        {/* SETTLED / COMPLETED */}
        <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
            <PackageCheck className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">Fulfillments</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
            {completedCount}
          </p>
          <p className="text-[10px] text-gray-500 mt-2">Dispatched to freight carriers</p>
        </div>
      </div>

      {/* SECTOR FOCUS TABS */}
      <div className="flex border-b border-white/5 pb-1 gap-2">
        <button
          onClick={() => setActiveAdminTab("orders")}
          className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === "orders"
              ? "bg-[#00d4ff]/10 text-electric-blue font-extrabold border border-electric-blue/20"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Orders Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveAdminTab("inventory")}
          className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === "inventory"
              ? "bg-[#00d4ff]/10 text-electric-blue font-extrabold border border-electric-blue/20"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Stock Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveAdminTab("diagnostics")}
          className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === "diagnostics"
              ? "bg-[#00d4ff]/10 text-electric-blue font-extrabold border border-electric-blue/20"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <Cpu className="w-4 h-4" />
          System Integrity Test
        </button>
      </div>

      {activeAdminTab === "orders" ? (
        <>
          {/* FILTER & ACCENT LOGISTICS BAR */}
          <div className="flex flex-col md:flex-row gap-4 bg-panel-bg border border-white/5 p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by formulation ID, customer account, or items..."
                className="w-full bg-dark-bg text-white pl-10 pr-4 py-2.5 rounded-xl text-xs border border-white/5 focus:border-electric-blue/40 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
              {["all", "pending", "processing", "completed", "cancelled", "return_requested", "returned"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-electric-blue text-dark-bg border-electric-blue font-extrabold"
                      : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5"
                  }`}
                >
                  {st === "return_requested" ? "return" : st === "returned" ? "returned" : st}
                </button>
              ))}
            </div>
          </div>

          {/* ORDERS LOADER STATE */}
          {isLoading ? (
            <div className="py-24 bg-panel-bg rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.15em] animate-pulse">
                Querying Master Orders Collection...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* EMPTY DASHBOARD LOCK */
            <div className="bg-panel-bg border border-white/5 rounded-3xl py-16 px-6 text-center max-w-xl mx-auto space-y-5">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-semibold text-lg text-white">No Database Invoices Found</h3>
                <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "No matching entries found in active search queries."
                    : "Active collection contains no registered purchases. Place a test sample order above."
                  }
                </p>
              </div>
            </div>
          ) : (
            /* POWER ORDERS INVENTORY LIST */
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div 
                  key={order.orderId}
                  className="border border-white/5 bg-panel-bg rounded-2xl overflow-hidden transition-all shadow-lg hover:border-white/10"
                >
                  {/* Desktop view Grid */}
                  <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left block Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <code className="text-sm font-bold text-electric-blue tracking-wider font-mono">
                          {order.orderId}
                        </code>
                        
                        <button
                          onClick={(e) => handleCopy(order.orderId, e)}
                          className="p-1 px-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex items-center gap-1 text-[9px] cursor-pointer"
                          title="Copy Dispatch Identifier"
                        >
                          {copiedId === order.orderId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold uppercase font-mono">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="uppercase font-mono font-semibold">Copy ID</span>
                            </>
                          )}
                        </button>

                        <span className={`px-2.5 py-0.5 rounded text-[9px] border font-extrabold uppercase ${getStatusChipStyle(order.status)}`}>
                          {order.status === "return_requested" ? "return" : order.status === "returned" ? "returned" : order.status}
                        </span>
                      </div>

                      {/* Customer, Date metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Calendar className="w-4 h-4 text-gray-600 shrink-0" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-gray-500 shrink-0 font-bold">UID:</span>
                          <span className="truncate select-all bg-black/20 px-1.5 py-0.5 rounded border border-white/5 text-[11px] font-sans text-gray-300" title={order.userId}>
                            {order.userId}
                          </span>
                          {order.userId === simulatedAccount && (
                            <span className="text-[9px] bg-electric-blue/10 text-electric-blue font-bold px-1.5 py-0.2 rounded border border-electric-blue/20">TEST TARGET</span>
                          )}
                        </div>
                      </div>

                      {/* Receipt lists */}
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500 mb-1.5">Packaging Items Breakdown</p>
                        <div className="flex flex-wrap gap-2 animate-fadeIn font-mono">
                          {order.items.map((item, index) => (
                            <span key={index} className="text-[11px] bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-white font-sans flex items-center gap-1">
                              <strong className="text-electric-blue font-semibold">{item.quantity}×</strong> {item.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {order.returnReason && (
                        <div className="mt-3 pt-2.5 border-t border-white/5 text-xs text-amber-400 space-y-1 animate-fadeIn bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400">Formulation Return Petition</p>
                          <p className="leading-relaxed font-sans text-gray-300 select-all">
                            Reason selection: <strong className="text-white">{order.returnReason}</strong>
                            {order.returnDetails && (
                              <>
                                <br />
                                Details notes: <span className="text-gray-400 italic">"{order.returnDetails}"</span>
                              </>
                            )}
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Right controls block */}
                    <div className="flex flex-row sm:items-center justify-between lg:flex-col lg:items-end gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5 font-sans">
                      
                      {/* Amount summary */}
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold">Total Price</p>
                        <p className="text-xl font-black text-white font-mono mt-0.5">
                          R {order.totalPrice.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      {/* Order Status Action Picker */}
                      <div className="space-y-1 text-left lg:text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold mb-1">State Transition</p>
                        
                        <div className="flex flex-wrap items-center gap-1 border border-white/5 bg-dark-bg p-1 rounded-xl">
                          {["pending", "processing", "completed", "cancelled", "return_requested", "returned"].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(order.orderId, order.userId, st)}
                              disabled={updatingId === order.orderId}
                              className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                order.status.toLowerCase() === st
                                  ? "bg-white/10 text-white font-black animate-pulse"
                                  : "text-gray-500 hover:text-white"
                              }`}
                            >
                              {st === "pending" && "Pend"}
                              {st === "processing" && "Proc"}
                              {st === "completed" && "Comp"}
                              {st === "cancelled" && "Can"}
                              {st === "return_requested" && "return"}
                              {st === "returned" && "returned"}
                            </button>
                          ))}
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : activeAdminTab === "inventory" ? (
        /* PRODUCT INVENTORY VIEWER */
        <div className="space-y-6 animate-fadeIn">
          {/* INVENTORY METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-xl p-2 bg-white/5 rounded-xl border border-white/5">🧴</span>
              <p className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">Total Formulations</p>
              <p className="text-2xl font-black text-white mt-1 font-mono">{products.length}</p>
              <p className="text-[10px] text-gray-500 mt-2">Active chemical inventory listings</p>
            </div>
            <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-xl p-2 bg-white/5 rounded-xl border border-white/10">⚠️</span>
              <p className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider">Low Stock Warnings</p>
              <p className="text-2xl font-black text-amber-400 mt-1 font-mono">
                {products.filter(p => (p.stockCount || 0) < 10 && (p.stockCount || 0) > 0).length}
              </p>
              <p className="text-[10px] text-gray-500 mt-2">Items with under 10 units remaining</p>
            </div>
            <div className="bg-panel-bg border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-xl p-2 bg-white/5 rounded-xl border border-white/10">🛑</span>
              <p className="text-[10px] font-bold text-rose-400 font-mono uppercase tracking-wider">Sold Out Items</p>
              <p className="text-2xl font-black text-rose-400 mt-1 font-mono">
                {products.filter(p => !p.inStock || (p.stockCount || 0) === 0).length}
              </p>
              <p className="text-[10px] text-gray-500 mt-2">Formulas requiring replenishment run</p>
            </div>
          </div>

          {/* INVENTORY ACTIONS BAR */}
          <div className="flex flex-col md:flex-row gap-4 bg-panel-bg border border-white/5 p-4 rounded-2xl justify-between items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={invSearchQuery}
                onChange={(e) => setInvSearchQuery(e.target.value)}
                placeholder="Search products by formulation name, category, size..."
                className="w-full bg-dark-bg text-white pl-10 pr-4 py-2.5 rounded-xl text-xs border border-white/5 focus:border-electric-blue/40 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 justify-end">
              {(["all", "low", "out"] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setInvFilter(filterType)}
                  className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    invFilter === filterType
                      ? "bg-[#00d4ff] text-dark-bg border-[#00d4ff] font-extrabold"
                      : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5"
                  }`}
                >
                  {filterType === "all" && "All Formulas"}
                  {filterType === "low" && "Low Stock"}
                  {filterType === "out" && "Out of Stock"}
                </button>
              ))}

              <button
                onClick={startAddProduct}
                className="bg-[#00d4ff] hover:bg-opacity-90 text-dark-bg text-[10px] font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md shadow-electric-blue/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                Add New Product
              </button>
            </div>
          </div>

          {/* INVENTORY DATA GRID */}
          {isProductsLoading ? (
            <div className="py-24 bg-panel-bg rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.15em] animate-pulse">
                Querying Warehousing Inventory...
              </p>
            </div>
          ) : filteredProductsInInv.length === 0 ? (
            <div className="bg-panel-bg border border-white/5 rounded-3xl py-16 px-6 text-center max-w-xl mx-auto space-y-5 animate-fadeIn">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-semibold text-lg text-white">No Inventory Matched</h3>
                <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto">
                  No active product formulations coordinate with your filter choice or keyword queries.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-white/5 rounded-2xl bg-panel-bg animate-fadeIn">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400 bg-white/[0.01]">
                    <th className="py-4 px-5">ID & Name</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Price (ZAR)</th>
                    <th className="py-4 px-5 text-center">Stock Level (On Hand)</th>
                    <th className="py-4 px-5 text-center">Featured status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProductsInInv.map((prod) => {
                    const isLow = (prod.stockCount || 0) < 10;
                    const isOut = !prod.inStock || (prod.stockCount || 0) === 0;

                    return (
                      <tr 
                        key={prod.id} 
                        className="border-b border-white/5 hover:bg-white/[0.01] transition-colors text-xs text-gray-200"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <span className="text-xl shrink-0 p-2 bg-dark-bg border border-white/5 rounded-xl">{prod.icon}</span>
                            <div>
                              <p className="font-semibold text-white font-sans text-sm">{prod.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                ID: {prod.id} • Size: {prod.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-mono">
                          <span className="px-2.5 py-1 rounded bg-[#00d4ff]/10 text-electric-blue text-[10px] uppercase font-bold tracking-wider border border-electric-blue/10">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono text-white text-sm font-semibold">
                          R {prod.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex flex-col items-center justify-center gap-1.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => quickAdjustStock(prod, -1)}
                                className="w-7 h-7 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-gray-300 hover:text-white flex items-center justify-center rounded-lg transition-transform cursor-pointer"
                                title="Decrement stock"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2.5px]" />
                              </button>
                              <span className={`text-sm font-black font-mono w-10 text-center ${
                                isOut ? "text-rose-500" : isLow ? "text-amber-500" : "text-emerald-400"
                              }`}>
                                {prod.stockCount || 0}
                              </span>
                              <button
                                onClick={() => quickAdjustStock(prod, 1)}
                                className="w-7 h-7 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-gray-300 hover:text-white flex items-center justify-center rounded-lg transition-transform cursor-pointer"
                                title="Increment stock"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                              </button>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded ${
                              isOut 
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/10" 
                                : isLow 
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" 
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            }`}>
                              {isOut ? "sold out" : isLow ? "low stock" : "in stock"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => updateProductInFirebase(prod.id, { isFeatured: !prod.isFeatured })}
                            className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer select-none ${
                              prod.isFeatured
                                ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                : "bg-white/5 text-gray-500 border-white/5"
                            }`}
                          >
                            {prod.isFeatured ? "Featured" : "Standard"}
                          </button>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider bg-white/5 hover:bg-white/10 border border-white/5 px-2.5 py-1.5 rounded-xl cursor-pointer text-white transition-all hover:border-electric-blue/20"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#00d4ff]" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <DiagnosticsTestSuite />
      )}

      {/* MODALS OVERLAY FOR ADD & EDIT FORMULATION */}
      <AnimatePresence>
        {(isAddProductOpen || editingProduct) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-panel-bg border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-electric-blue" />
                    {editingProduct ? "Edit Chemical Formulation" : "Add New Inventory Formula"}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Configure specifications, chemical pricing levels, and real-time stock parameters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setEditingProduct(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Product Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. HydroShield Sealant Ultra"
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Size / Fluid volume</label>
                    <input
                      required
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                      placeholder="e.g. 500ml or Pack of 3"
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Price (ZAR Rands)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Stock on Hand</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.stockCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, stockCount: Number(e.target.value) }))}
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Emoji / Icon badge</label>
                    <input
                      required
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g. ✨ or 🧴"
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40 text-center text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Formulation Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    >
                      <option value="exterior">Exterior Care</option>
                      <option value="interior">Interior Detail</option>
                      <option value="ceramic">Ceramic Coatings</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Featured Image Asset URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="e.g. /src/assets/images/...png or blank"
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Short description (Catalog card)</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Briefly state characteristics..."
                    className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Full chemistry specs & performance</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                    placeholder="Full chemistry detail..."
                    className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Formula Benefits (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.benefits}
                      onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                      placeholder="e.g. Eco-Friendly, UV Shield, Easy Application"
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider">Application Instructions</label>
                    <input
                      required
                      type="text"
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Directions for application..."
                      className="w-full bg-dark-bg text-white px-3.5 py-2 rounded-xl text-xs border border-white/10 focus:border-electric-blue/40"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-white select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-white/10 bg-dark-bg text-electric-blue focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer text-[#00d4ff]"
                    />
                    Featured Formulation spotlight
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5 bg-white/[0.01] -mx-6 -mb-6 p-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddProductOpen(false);
                      setEditingProduct(null);
                    }}
                    className="border border-white/5 hover:bg-white/5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00d4ff] hover:bg-opacity-95 text-dark-bg px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-electric-blue/10 justify-center"
                  >
                    {editingProduct ? "Save Changes" : "Create Formula"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
