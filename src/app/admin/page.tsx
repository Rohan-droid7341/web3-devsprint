import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { promotePlayer, makeAdmin } from "./actions";
import { Shield, User, ArrowUpCircle, Crown, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminPanel() {
  const session = await auth();

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { level: "desc" },
  });

  return (
    <div className="min-h-screen py-20">
      <div className="container space-y-16">
        <header className="flex flex-wrap items-center justify-between gap-8 pb-12 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield size={40} className="text-primary" />
            </div>
            <div>
              <p className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2">Internal Operations</p>
              <h1 className="text-6xl font-black font-heading uppercase tracking-tight">GUARDIANS'S CONSOLE</h1>
            </div>
          </div>
          <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors uppercase text-sm font-black tracking-[0.2em] flex items-center gap-2 group border border-white/10 px-8 py-4 rounded-xl">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
             Return to Arena
          </Link>
        </header>

        <section className="glass p-0 overflow-hidden border-primary/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-white/5">
                  <th className="p-10 text-gray-400 uppercase text-xs tracking-widest font-black">Participant</th>
                  <th className="p-10 text-gray-400 uppercase text-xs tracking-widest font-black">College Email</th>
                  <th className="p-10 text-gray-400 uppercase text-xs tracking-widest font-black text-center">Status Matrix</th>
                  <th className="p-10 text-gray-400 uppercase text-xs tracking-widest font-black text-right">Sanctioned Protocols</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-10 font-bold flex items-center gap-6 text-2xl tracking-tight">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                        <User size={24} />
                      </div>
                      {u.name || "Unknown Identity"}
                    </td>
                    <td className="p-10 text-gray-500 text-lg">{u.email}</td>
                    <td className="p-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-primary font-black text-4xl tracking-tighter">LVL {u.level}</span>
                        <span className={`text-[10px] uppercase font-black tracking-[0.3em] px-4 py-1 rounded-full border ${u.role === 'ADMIN' ? 'text-primary border-primary/30 bg-primary/10' : 'text-gray-700 border-white/5'}`}>
                           {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-10 text-right space-x-6">
                      {u.level < 4 && (
                        <form action={promotePlayer.bind(null, u.id)} className="inline">
                          <button 
                            type="submit" 
                            title="Elevate Level Status"
                            className="p-5 rounded-2xl border border-primary/40 text-primary hover:bg-primary/20 transition-all active:scale-95"
                          >
                            <ArrowUpCircle size={32} />
                          </button>
                        </form>
                      )}
                      {u.role !== "ADMIN" && (
                        <form action={makeAdmin.bind(null, u.id)} className="inline">
                          <button 
                            type="submit" 
                            title="Grant Guardian Privileges"
                            className="p-5 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-all active:scale-95"
                          >
                            <Crown size={32} />
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-40 text-center text-gray-600 uppercase tracking-[0.4em] font-black text-xl italic opacity-50">
              The Arena is Empty. Awaiting Candidates.
            </div>
          )}
        </section>
        
        <footer className="text-gray-600 text-xs text-center uppercase tracking-[0.3em] font-black py-12">
          Protocol: Physical presence verification is strictly mandatory before level elevation.
        </footer>
      </div>
    </div>
  );
}
