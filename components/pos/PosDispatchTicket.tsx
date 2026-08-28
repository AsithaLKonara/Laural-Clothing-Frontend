"use client";

import React, { useState } from "react";
import { X, Phone, MapPin, Truck, CheckCircle2, Trash2, Link as LinkIcon, User, CreditCard, Banknote } from "lucide-react";
import { useCreateShipment } from "@/hooks/useShipping";
import { useProcessPosOrder, useCurrentSession } from "@/hooks/usePos";
import { globalDialog } from "@/store/dialog.store";

interface PosDispatchTicketProps {
  isMobileCartOpen: boolean;
  setIsMobileCartOpen: (open: boolean) => void;
  cart: any[];
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
}

export default function PosDispatchTicket({ isMobileCartOpen, setIsMobileCartOpen, cart, updateQty, clearCart }: PosDispatchTicketProps) {
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [customerFound, setCustomerFound] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Transfer" | "Link">("COD");
  const [deliveryMethod, setDeliveryMethod] = useState<"Fardar" | "Pickup">("Fardar");
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (val === "0771234567") {
      setCustomerFound(true);
      setCustomerName("Kasun Perera");
      setAddress("123 Sample St, Colombo 03, Sri Lanka");
    } else {
      setCustomerFound(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = deliveryMethod === "Fardar" ? 400 : 0;
  const total = subtotal + deliveryFee;

  const createShipmentMutation = useCreateShipment();
  const processPosOrderMutation = useProcessPosOrder();
  const { data: activeSession } = useCurrentSession("TERM-001"); // In real app, pass from parent

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      if (!activeSession) throw new Error("No active shift session");

      // 1. Create POS Order to deduct inventory and log sale
      const orderRes = await processPosOrderMutation.mutateAsync({
        branchId: "BR-001",
        sessionId: activeSession.id,
        items: cart.map(i => ({ variantId: i.id, qty: i.qty })),
        paymentMethod: paymentMethod === "Transfer" ? "BANK_TRANSFER" : paymentMethod,
        appliedVouchers: [],
        subtotal,
        total,
        tax: 0
      });

      // 2. Forward to 3PL if applicable
      if (deliveryMethod === "Fardar") {
        await createShipmentMutation.mutateAsync({
          orderReference: orderRes.orderNumber || "POS-DISPATCH-" + Math.floor(Math.random() * 100000),
          customerName: customerName || "Guest",
          customerPhone: phone,
          customerAddress: address || "No address provided",
          city: "Colombo", // Normally would be parsed from address or explicit dropdown
          amountToCollect: paymentMethod === "COD" ? total : 0,
          pieces: cart.length
        });
      }
      setSuccess(true);
    } catch (error) {
      console.error(error);
      globalDialog.alert("Failed to process dispatch order.");
    } finally {
      setIsDispatching(false);
    }
  };

  if (success) {
    return (
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface flex flex-col shrink-0 shadow-2xl lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-50 lg:z-0 lg:static transform transition-transform duration-300 lg:translate-x-0 ${isMobileCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-inter font-bold text-2xl text-foreground mb-2">Order Dispatched!</h2>
          <p className="font-inter text-muted mb-8 text-sm">
            {paymentMethod === "Link" 
              ? `Payment link sent to ${phone}. Order will be dispatched via ${deliveryMethod} once paid.`
              : `Order has been routed to the warehouse for ${deliveryMethod} delivery.`}
          </p>
          <button 
            onClick={() => { setSuccess(false); clearCart(); setPhone(""); setCustomerName(""); setAddress(""); setCustomerFound(false); setIsMobileCartOpen(false); }}
            className="w-full py-4 bg-primary text-white rounded-xl font-inter font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
          >
            New Phone Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface flex flex-col shrink-0 shadow-2xl lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-50 lg:z-0 lg:static transform transition-transform duration-300 lg:translate-x-0 ${isMobileCartOpen ? "translate-x-0" : "translate-x-full"}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-background flex justify-between items-center shrink-0 h-[60px]">
        <h2 className="font-inter font-bold text-lg flex items-center gap-2">
          <button className="lg:hidden p-1 -ml-1 text-muted" onClick={() => setIsMobileCartOpen(false)}>
            <X size={20} />
          </button>
          Dispatch Ticket
        </h2>
      </div>

      {/* Customer Lookup */}
      <div className="p-4 border-b border-border bg-surface shrink-0 flex flex-col gap-3">
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="tel" 
            value={phone}
            onChange={handlePhoneSearch}
            placeholder="Customer Phone (e.g. 0771234567)"
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {(phone.length > 5 || customerFound) && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-inter text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-muted" />
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shipping Address"
                rows={2}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-inter text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-background">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted gap-2 h-full opacity-60">
            <p className="font-inter text-sm">Select products to dispatch</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex flex-col bg-surface border border-border rounded-lg p-3 relative group">
              <div className="flex justify-between items-start mb-1">
                <span className="font-inter font-bold text-foreground leading-snug pr-8">{item.name}</span>
                <button onClick={() => updateQty(item.id, -item.qty)} className="absolute top-3 right-3 text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-background border border-border font-bold text-muted flex items-center justify-center hover:bg-surface">-</button>
                  <span className="font-inter font-bold text-lg w-4 text-center text-foreground">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-background border border-border font-bold text-muted flex items-center justify-center hover:bg-surface">+</button>
                </div>
                <span className="font-inter font-bold text-foreground">{(Number(typeof item.price === 'string' ? item.price.replace(/,/g, "") : item.price) * item.qty).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & Logistics */}
      <div className="border-t border-border bg-surface p-5 shrink-0 flex flex-col gap-5 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        
        <div className="flex flex-col gap-4">
          {/* Delivery Method */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-muted uppercase tracking-wider">Logistics</label>
            <div className="flex bg-background p-1 rounded-lg border border-border">
              <button 
                onClick={() => setDeliveryMethod("Fardar")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-inter font-semibold rounded-md transition-all ${deliveryMethod === 'Fardar' ? 'bg-surface text-foreground shadow-sm border border-border' : 'text-muted'}`}
              >
                <Truck size={14}/> Fardar
              </button>
              <button 
                onClick={() => setDeliveryMethod("Pickup")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-inter font-semibold rounded-md transition-all ${deliveryMethod === 'Pickup' ? 'bg-surface text-foreground shadow-sm border border-border' : 'text-muted'}`}
              >
                <MapPin size={14}/> Store Pickup
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-muted uppercase tracking-wider">Payment</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPaymentMethod("COD")}
                className={`flex flex-col items-center justify-center gap-1 p-2 border rounded-lg text-xs font-inter font-semibold transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-background text-muted hover:border-accent'}`}
              >
                <Banknote size={16}/> COD
              </button>
              <button 
                onClick={() => setPaymentMethod("Transfer")}
                className={`flex flex-col items-center justify-center gap-1 p-2 border rounded-lg text-xs font-inter font-semibold transition-all ${paymentMethod === 'Transfer' ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-background text-muted hover:border-accent'}`}
              >
                <CreditCard size={16}/> Transfer
              </button>
              <button 
                onClick={() => setPaymentMethod("Link")}
                className={`flex flex-col items-center justify-center gap-1 p-2 border rounded-lg text-xs font-inter font-semibold transition-all ${paymentMethod === 'Link' ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-background text-muted hover:border-accent'}`}
              >
                <LinkIcon size={16}/> Send Link
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border my-1"></div>

        <div className="flex flex-col gap-1 font-inter text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="text-foreground">{subtotal.toLocaleString()}</span>
          </div>
          {deliveryMethod === "Fardar" && (
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span className="text-foreground">{deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-end mt-2 pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground">Total</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-muted">Rs.</span>
              <span className="text-2xl font-bold text-foreground tracking-tight">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDispatch}
          disabled={isDispatching || cart.length === 0 || !phone}
          className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl py-4 transition-colors font-inter font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
        >
          {isDispatching ? "Processing..." : paymentMethod === "Link" ? "Send Link & Hold" : "Confirm & Dispatch"}
        </button>

      </div>
    </div>
  );
}
