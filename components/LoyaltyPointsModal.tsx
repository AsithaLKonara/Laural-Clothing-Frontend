"use client";

import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { X, Search } from "lucide-react";

interface LoyaltyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPoints: (points: number) => void;
}

export default function LoyaltyPointsModal({ isOpen, onClose, onApplyPoints }: LoyaltyPointsModalProps) {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [pointsToApply, setPointsToApply] = useState<string>("");
  const [step, setStep] = useState<"search" | "found">("search");

  if (!isOpen) return null;

  const handleSearch = () => {
    if (phoneNumber && phoneNumber.length > 5) {
      setStep("found");
    }
  };

  const handleApply = () => {
    const points = parseInt(pointsToApply);
    if (!isNaN(points) && points > 0) {
      onApplyPoints(points);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[800px] bg-[#FAFAF9] rounded-[24px] overflow-hidden shadow-2xl flex flex-col p-8 md:p-12 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500 hover:text-[#1C1917]"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-6 mb-10 w-full border-b border-stone-300 pb-8">
          <h2 className="font-poppins font-semibold text-[24px] md:text-[32px] text-[#0C0A09]">
            {step === "search" ? "Loyalty Points" : "You have 257 points"}
          </h2>
        </div>

        {/* Step 1: Search by Phone */}
        {step === "search" && (
          <div className="flex flex-col gap-6 w-full max-w-[500px]">
            <div className="flex flex-col gap-3 w-full">
              <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                Phone number <span className="text-[#C19A5B]">*</span>
              </label>
              
              <PhoneInput 
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="LK"
                className="w-full h-[52px] px-[20px] border border-[#44403B] rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus-within:ring-1 focus-within:ring-[#1C1917] transition-all"
                numberInputProps={{
                  className: "w-full h-full bg-transparent border-none outline-none text-[#1C1917] font-poppins text-[15px] placeholder:text-stone-400 pl-4",
                }}
              />
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={!phoneNumber}
              className="h-[52px] w-full md:w-[160px] flex justify-center items-center gap-2 bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 transition-colors rounded-full font-poppins font-semibold text-[14px] text-white uppercase tracking-widest mt-2"
            >
              <Search size={18} />
              Check
            </button>
          </div>
        )}

        {/* Step 2: Apply Points */}
        {step === "found" && (
          <div className="flex flex-col gap-8 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex flex-col gap-3 w-full max-w-[500px]">
              <label className="font-poppins font-medium text-[15px] text-[#0C0A09]">
                Add Points
              </label>
              <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                <input 
                  type="number"
                  placeholder="Enter Value"
                  value={pointsToApply}
                  onChange={(e) => setPointsToApply(e.target.value)}
                  className="w-full md:flex-1 h-[52px] px-[20px] border border-[#44403B] rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:ring-1 focus:ring-[#1C1917] transition-all placeholder:text-stone-400"
                />
                <button 
                  onClick={handleApply}
                  disabled={!pointsToApply || parseInt(pointsToApply) <= 0 || parseInt(pointsToApply) > 257}
                  className="w-full md:w-[120px] h-[52px] flex justify-center items-center bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 transition-colors rounded-full font-poppins font-semibold text-[14px] text-white uppercase tracking-widest"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full pt-8 mt-4 border-t border-stone-200">
              <button 
                onClick={onClose}
                className="w-full sm:w-auto h-[52px] px-10 flex justify-center items-center border border-[#44403B] hover:bg-stone-100 transition-colors rounded-full font-poppins font-semibold text-[14px] text-[#1C1917] uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                disabled={!pointsToApply || parseInt(pointsToApply) <= 0 || parseInt(pointsToApply) > 257}
                className="w-full sm:w-auto h-[52px] px-10 flex justify-center items-center bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 transition-colors rounded-full font-poppins font-semibold text-[14px] text-white uppercase tracking-widest"
              >
                Apply
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
