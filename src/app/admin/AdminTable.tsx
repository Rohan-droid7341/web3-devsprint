"use client";

import { useState } from "react";
import { promotePlayer, makeAdmin } from "./actions";
import { User, ArrowUpCircle, Crown, Search } from "lucide-react";

interface UserEntry {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  level: number;
}

export function AdminTable({ users }: { users: UserEntry[] }) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
        />
        {search && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="glass !p-0 overflow-hidden border-primary/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-white/5">
                <th className="p-4 text-gray-400 uppercase text-[10px] tracking-widest font-black">Participant</th>
                <th className="p-4 text-gray-400 uppercase text-[10px] tracking-widest font-black">College Email</th>
                <th className="p-4 text-gray-400 uppercase text-[10px] tracking-widest font-black text-center">Status</th>
                <th className="p-4 text-gray-400 uppercase text-[10px] tracking-widest font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-bold flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <User size={16} />
                    </div>
                    {u.name || "Unknown Identity"}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{u.email}</td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-primary font-black text-lg tracking-tighter">
                        {u.level >= 5 ? "✓" : `LVL ${u.level}`}
                      </span>
                      {u.level >= 5 ? (
                        <span className="text-[9px] uppercase font-black tracking-[0.2em] px-3 py-0.5 rounded-full border text-green-400 border-green-500/30 bg-green-500/10">
                          COMPLETED
                        </span>
                      ) : (
                        <span
                          className={`text-[9px] uppercase font-black tracking-[0.2em] px-3 py-0.5 rounded-full border ${
                            u.role === "ADMIN"
                              ? "text-primary border-primary/30 bg-primary/10"
                              : "text-gray-700 border-white/5"
                          }`}
                        >
                          {u.role}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    {u.level < 5 && (
                      <form action={promotePlayer.bind(null, u.id)} className="inline">
                        <button
                          type="submit"
                          title="Elevate Level"
                          className="p-2.5 rounded-xl border border-primary/40 text-primary hover:bg-primary/20 transition-all active:scale-95"
                        >
                          <ArrowUpCircle size={18} />
                        </button>
                      </form>
                    )}
                    {u.role !== "ADMIN" && (
                      <form action={makeAdmin.bind(null, u.id)} className="inline">
                        <button
                          type="submit"
                          title="Grant Admin"
                          className="p-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all active:scale-95"
                        >
                          <Crown size={18} />
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-600 uppercase tracking-[0.3em] font-black text-sm italic opacity-50">
            {search ? "No participants match your search." : "The Arena is Empty. Awaiting Candidates."}
          </div>
        )}
      </div>
    </div>
  );
}
