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
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen blurred backdrop */}
      <div className="overlay-backdrop" onClick={onClose} />

      {/* Centered box smaller than screen */}
      <div className="overlay-box">
        <div className="overlay-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="overlay-close" aria-label="Close overlay">
            <X size={28} />
          </button>
        </div>

        <div className="overlay-body">
          {children}
        </div>
      </div>
    </>
  );
};
