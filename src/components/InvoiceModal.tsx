/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Printer, 
  Download, 
  Mail, 
  Check, 
  AlertCircle, 
  Building, 
  Hash, 
  MapPin, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Percent,
  Sparkles
} from "lucide-react";
import { Order } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  customerName?: string;
  customerEmail?: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  order,
  customerName = "iDetail Professional",
  customerEmail
}: InvoiceModalProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Custom billing details inputs for tax compliance
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vatNo, setVatNo] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customCity, setCustomCity] = useState("");

  if (!order) return null;

  // Invoice Date calculation
  const formattedDate = () => {
    try {
      const d = new Date(order.createdAt);
      return d.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return new Date().toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  };

  // South African VAT calculation (15%)
  // Total Price is inclusive of 15% VAT
  const total = order.totalPrice;
  const subtotalExclVat = total / 1.15;
  const vatAmount = total - subtotalExclVat;

  const handlePrint = () => {
    // We create a temporary, clean printable content window or use CSS @media print
    // To ensure a stellar experience in the sandbox, we built print-specific styles directly in the component.
    // We can directly call window.print().
    window.print();
  };

  const handleEmailInvoice = () => {
    if (isSendingEmail || emailSent) return;
    setIsSendingEmail(true);
    
    // Simulate API call to email SMTP server
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }, 1200);
  };

  const downloadJsonInvoice = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      invoiceNumber: `INV-${order.orderId}`,
      date: order.createdAt,
      vatRegistrationNo: "4920284719",
      seller: {
        name: "iDetail Chemical Detailing (Pty) Ltd",
        address: "102 Detailer's Boulevard, Paarden Eiland, Cape Town, 7405"
      },
      buyer: {
        name: companyName || customerName,
        email: customerEmail || order.userId,
        vatNumber: vatNo || "N/A",
        address: [customAddress, customCity].filter(Boolean).join(", ") || "Standard Ground Courier Address"
      },
      items: order.items,
      subtotalExcludingVat: subtotalExclVat.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      totalInclusiveVat: total.toFixed(2),
      status: "PAID - thank you for your support"
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `iDetail_Invoice_${order.orderId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm print:hidden"
            id="invoice-backdrop"
          />

          {/* Modal Canvas wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-2xl bg-[#0d0f12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh] print:max-h-none print:w-full print:border-none print:bg-white print:text-black print:rounded-none print:shadow-none print:static"
            id="invoice-modal-content"
          >
            {/* 0. PRINT ONLY HIDDEN INJECTED STYLES to override dark theme when printing */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                html, body {
                  background-color: white !important;
                  color: black !important;
                  font-size: 11pt !important;
                }
                #invoice-backdrop, .print\\:hidden {
                  display: none !important;
                }
                #invoice-printable-area {
                  background-color: white !important;
                  color: black !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .invoice-print-text-dark {
                  color: #000000 !important;
                }
                .invoice-print-border {
                  border-color: #e5e7eb !important;
                }
                .invoice-print-bg-light {
                  background-color: #f9fafb !important;
                }
              }
            `}} />

            {/* Top Toolbar Action Header (Hidden on print) */}
            <div className="px-6 py-4 bg-[#14181f] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-electric-blue/10 border border-electric-blue/20">
                  <FileText className="w-4 h-4 text-electric-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Tax Invoice Manager</h3>
                  <p className="text-[10px] text-gray-500 font-mono">Compliant South African invoicing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrint}
                  className="p-2 bg-white/5 hover:bg-electric-blue/10 border border-white/5 hover:border-electric-blue/30 rounded-xl text-xs text-white hover:text-electric-blue font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Print or Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>

                <button
                  onClick={downloadJsonInvoice}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-gray-300 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Download digital Invoice as JSON file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">JSON</span>
                </button>

                <button
                  onClick={handleEmailInvoice}
                  disabled={isSendingEmail || emailSent}
                  className="p-2 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl text-xs text-gray-300 hover:text-emerald-400 font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {emailSent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline text-emerald-400">Sent</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Email Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/15 border border-white/5 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer transition-all"
                  id="invoice-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customizable Corporate Details Accordion Collapse (Hidden on print) */}
            <div className="border-b border-white/5 bg-[#101217] print:hidden shrink-0">
              <button
                onClick={() => setShowBillingForm(!showBillingForm)}
                className="w-full text-left px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/2 cursor-pointer transition-colors"
                id="invoice-toggle-details-btn"
              >
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5 text-electric-blue" />
                  Add Corporate / Business Invoicing Details?
                </span>
                {showBillingForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showBillingForm && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-[#0a0c0f]"
                  >
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5">
                      <div>
                        <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-black font-mono mb-1">Company Registered Name</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Detailing Services (Pty) Ltd"
                          className="w-full bg-[#13161a] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-blue/45 focus:outline-none"
                          id="invoice-company-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-black font-mono mb-1">VAT Registration Number (10 digit)</label>
                        <input
                          type="text"
                          value={vatNo}
                          onChange={(e) => setVatNo(e.target.value)}
                          placeholder="e.g. 4920184711"
                          maxLength={10}
                          className="w-full bg-[#13161a] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-blue/45 focus:outline-none"
                          id="invoice-vat-input"
                        />
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-black font-mono mb-1">Company Billing Address</label>
                          <input
                            type="text"
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                            placeholder="e.g. Unit 4, Platinum Park, Neptune Str"
                            className="w-full bg-[#13161a] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-blue/45 focus:outline-none"
                            id="invoice-address-input"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-black font-mono mb-1">City / Region</label>
                          <input
                            type="text"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            placeholder="e.g. Paarden Eiland, Cape Town"
                            className="w-full bg-[#13161a] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-blue/45 focus:outline-none"
                            id="invoice-city-input"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scrollable Printable Invoice Sheet Body */}
            <div 
              className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 bg-[#0a0c0e] print:overflow-visible print:p-0 print:bg-white"
              id="invoice-printable-area"
            >
              {/* Header block: TAX INVOICE label & Company details */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6 print:border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-electric-blue rounded-full print:bg-black" />
                    <span className="text-xs uppercase font-extrabold text-electric-blue tracking-widest font-mono print:text-black">
                      iDETAIL PREMIUM DETAILING
                    </span>
                  </div>
                  <h1 className="font-display font-black text-3xl tracking-tight text-white print:text-black">
                    TAX INVOICE
                  </h1>
                  <span className="inline-block bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-mono text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full print:border-black print:text-black print:bg-gray-100">
                    Paid In Full
                  </span>
                </div>

                {/* Company legal details */}
                <div className="text-right text-xs text-gray-400 space-y-0.5 font-sans print:text-black">
                  <p className="font-bold text-white print:text-black">iDetail Detailing (Pty) Ltd</p>
                  <p>102 Detailer's Boulevard, Paarden Eiland</p>
                  <p>Cape Town, South Africa, 7405</p>
                  <p className="font-mono text-[10px] text-gray-500 print:text-gray-700 mt-1.5 flex items-center justify-end gap-1.5">
                    <Hash className="w-3 h-3 text-electric-blue print:text-black" />
                    VAT No: 4920284719
                  </p>
                  <p className="text-[10px]">billing@idetail.co.za</p>
                </div>
              </div>

              {/* Meta Grid: Details of order, date, and client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-white/5 pb-8 print:border-gray-200">
                
                {/* Billing Address / Customer information */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">
                    Billed & Shipped To:
                  </p>
                  
                  <div className="space-y-1 text-gray-300 print:text-black">
                    {companyName ? (
                      <>
                        <p className="font-black text-white text-sm print:text-black uppercase tracking-wide">
                          {companyName}
                        </p>
                        {vatNo && (
                          <p className="font-mono text-[10px] text-electric-blue print:text-black">
                            VAT No: {vatNo}
                          </p>
                        )}
                        <p className="text-gray-400 print:text-black text-[11px] mt-1">Recipient Account contact:</p>
                      </>
                    ) : null}
                    
                    <p className="font-bold text-white print:text-black text-sm">
                      {customerName}
                    </p>
                    
                    {customerEmail && (
                      <p className="font-mono text-gray-400 print:text-black">{customerEmail}</p>
                    )}
                    
                    <p className="text-gray-400 print:text-black leading-relaxed mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5 print:hidden" />
                      <span>
                        {customAddress 
                          ? `${customAddress}, ${customCity}` 
                          : "Express Chemical Ground Courier Delivery"
                        }
                      </span>
                    </p>
                  </div>
                </div>

                {/* Metadata properties */}
                <div className="space-y-4 sm:text-right flex flex-col sm:items-end justify-between">
                  <div className="space-y-2.5 w-full sm:max-w-xs">
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5 print:border-gray-100">
                      <span className="text-gray-500 font-mono uppercase text-[10px] font-bold">Invoice Number:</span>
                      <span className="font-bold text-white font-mono tracking-wider print:text-black">INV-{order.orderId}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5 print:border-gray-100">
                      <span className="text-gray-500 font-mono uppercase text-[10px] font-bold">Issue Date:</span>
                      <span className="text-gray-300 font-mono print:text-black">{formattedDate()}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-mono uppercase text-[10px] font-bold">Payment Method:</span>
                      <span className="text-gray-300 font-mono print:text-black">CARD (SECURE)</span>
                    </div>
                  </div>

                  <div className="pt-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase font-mono print:border-gray-200 print:text-black print:bg-gray-50">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Loyalty Points Earned: +250 PTS
                  </div>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="space-y-2.5">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">
                  Inventory Items Breakdown:
                </p>

                <div className="border border-white/10 rounded-xl overflow-hidden print:border-gray-200">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[9px] font-bold tracking-wider border-b border-white/10 print:bg-gray-100 print:text-black print:border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Formula / Product Name</th>
                        <th className="px-4 py-3 font-semibold text-center w-24">Unit Price</th>
                        <th className="px-4 py-3 font-semibold text-center w-20">Quantity</th>
                        <th className="px-4 py-3 font-semibold text-right w-28">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-gray-100">
                      {order.items.map((item, index) => (
                        <tr key={index} className="text-gray-300 print:text-black hover:bg-white/2">
                          <td className="px-4 py-3.5">
                            <span className="font-extrabold text-white print:text-black uppercase block tracking-wide">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-500 print:text-gray-700">Premium Blend formulation</span>
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono">
                            R {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold font-mono">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3.5 text-right font-black font-mono text-white print:text-black">
                            R {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monetary Financial Calculation Summary Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-white/5 print:border-gray-200">
                <div className="bg-white/3 border border-white/5 p-4 rounded-xl text-xs max-w-sm text-gray-400 space-y-1 print:border-gray-100 print:text-black">
                  <p className="font-bold text-white print:text-black flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-electric-blue print:text-black" />
                    Tax Compliance Notes
                  </p>
                  <p className="leading-relaxed text-[11px]">
                    All amounts are stated in South African Rand (ZAR) and include Value Added Tax (VAT) at the standard rate of 15% where applicable. This document constitutes a valid South African Tax Invoice.
                  </p>
                </div>

                <div className="w-full sm:max-w-xs space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-gray-400 print:text-black">
                    <span className="font-mono text-[10px]">Net Total (Excl. VAT):</span>
                    <span className="font-mono">R {subtotalExclVat.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2.5 print:text-black print:border-gray-100">
                    <span className="font-mono text-[10px] flex items-center gap-1">
                      <Percent className="w-3 h-3 text-gray-500" />
                      VAT @ 15%:
                    </span>
                    <span className="font-mono">R {vatAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-xs uppercase tracking-widest text-white font-mono font-bold print:text-black">
                      Total Invoice:
                    </span>
                    <span className="text-xl font-black text-white font-mono tracking-tight print:text-black">
                      R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thank you Footer stamp */}
              <div className="text-center pt-10 border-t border-white/5 space-y-1.5 print:border-gray-200 print:pt-4">
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-electric-blue font-mono print:text-black">
                  Thank You For Your Business
                </p>
                <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                  For support inquiries, contact billing@idetail.co.za or call +27 21 000 0000.
                  <br />
                  <span className="font-mono text-[9px] text-[#4b5563] print:text-black">ISO Compliant Sealing Systems • Clean Water Protection Accredited</span>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
