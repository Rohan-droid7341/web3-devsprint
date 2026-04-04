"use client";

import React, { useState, useEffect } from "react";
import { updateTeamName } from "@/app/admin/actions";
import { Loader2, Users } from "lucide-react";

export const TeamSetupModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Wait slightly to let page load, then check if they've registered a team
    const hasSetTeam = localStorage.getItem("devsprint_team_setup_complete");
    if (!hasSetTeam) {
      setIsOpen(true);
    }
  }, []);

  if (!isMounted || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || teamName.length < 3) return;
    
    setIsLoading(true);
    try {
      await updateTeamName(teamName);
      localStorage.setItem("devsprint_team_setup_complete", "true");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to set team name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0a0a0a] border border-[color:var(--primary)] rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[color:var(--primary)] blur-xl opacity-50"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[color:var(--primary-faint,rgba(212,175,55,0.15))] border border-[color:var(--primary)] mx-auto flex items-center justify-center mb-4">
            <Users className="text-[color:var(--primary)]" size={28} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest font-heading mb-2">Claim Your Identity</h2>
          <p className="text-gray-400 text-sm">Welcome to the Arena. What is your officially registered Team Name?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--primary)] mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Satoshi Seekers"
              className="w-full bg-black/50 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[color:var(--primary)] focus:ring-1 focus:ring-[color:var(--primary)] transition-all font-mono"
              required
              minLength={3}
              maxLength={30}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || teamName.length < 3}
            className="w-full bg-[color:var(--primary)] text-black font-black uppercase tracking-[0.15em] text-sm py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "ENTER THE ARENA"}
          </button>
        </form>
      </div>
    </div>
  );
};
