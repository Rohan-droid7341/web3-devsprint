"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
      {/* Backdrop - Takes all screen and blurs background */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Box - Smaller than screen, centered */}
      <div className="relative glass w-full max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden gold-border-glow shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <header className="flex items-center justify-between p-8 border-b border-primary/20 bg-primary/5">
          <h2 className="text-3xl font-black font-heading uppercase tracking-tight text-primary">{title}</h2>
          <button 
            onClick={onClose}
            aria-label="Close"
            className="p-3 rounded-xl hover:bg-white/10 transition-all text-primary hover:text-white border border-primary/20 hover:border-primary/50"
          >
            <X size={32} />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-black/60">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, var(--primary), var(--primary-deep));
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>
    </div>
  );
};
