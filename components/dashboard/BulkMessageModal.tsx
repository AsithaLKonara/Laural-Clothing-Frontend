"use client";

import { useState } from "react";
import { X, Send, Users, AlertCircle } from "lucide-react";

interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkMessageModal({ isOpen, onClose }: BulkMessageModalProps) {
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  
  if (!isOpen) return null;

  const numberCount = numbers.split(",").filter(n => n.trim().length > 0).length;
  const messageLength = message.length;
  const smsCount = Math.ceil(messageLength / 160) || 1;

  function handleSend() {
    // TODO: Hook into backend SMS API
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900 flex items-center gap-2">
              <Send size={18} className="text-blue-600" /> 
              Send Bulk SMS
            </h2>
            <p className="font-inter text-xs text-stone-500 mt-0.5">Send a promotional text message to a list of numbers.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          
          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700 flex justify-between">
              Target Phone Numbers
              <span className="text-stone-500 font-normal">{numberCount} numbers detected</span>
            </label>
            <textarea
              value={numbers}
              onChange={e => setNumbers(e.target.value)}
              rows={3}
              placeholder="+94771234567, 0719876543, ..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-mono resize-none"
            />
            <p className="text-xs text-stone-400 font-inter">Separate numbers with commas or spaces.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700 flex justify-between">
              Message Body
              <span className={`font-normal ${messageLength > 160 ? "text-amber-600" : "text-stone-500"}`}>
                {messageLength} chars ({smsCount} SMS/person)
              </span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              placeholder="Hi there! Get 20% off all oversized tees this weekend with code TEE20..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter resize-none"
            />
            {messageLength > 160 && (
              <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200 mt-1">
                <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 font-inter leading-relaxed">
                  Your message exceeds 160 characters and will be split into multiple SMS segments, which may increase billing costs.
                </p>
              </div>
            )}
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
            <h3 className="font-inter text-xs font-bold text-stone-700 uppercase tracking-wider">Campaign Summary</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-stone-600">
                <Users size={16} />
                <span className="font-inter text-sm font-semibold">{numberCount} Recipients</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Send size={16} />
                <span className="font-inter text-sm font-semibold">{numberCount * smsCount} Total SMS</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={numberCount === 0 || messageLength === 0}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={14} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
