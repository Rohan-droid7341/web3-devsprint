import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Shield, ChevronLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { AdminTable } from "./AdminTable";

export default async function AdminPanel() {
  const session = await auth();

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { level: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      level: true,
    },
  });

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="glass !rounded-none border-x-0 border-t-0 !p-4 sticky top-0 z-50 mb-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold">Internal Operations</p>
              <h1 className="text-lg font-black font-heading uppercase tracking-tight">
                GUARDIAN&apos;S <span className="gold-gradient">CONSOLE</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/leaderboard" className="gold-button !py-2 !px-4 !text-[10px] flex items-center gap-1.5">
              <Trophy size={14} /> Leaderboard
            </Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-white transition text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/10 px-4 py-2 rounded-lg">
              <ChevronLeft size={16} /> Arena
            </Link>
          </div>
        </div>
      </header>

      <div className="container space-y-6">
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass !p-3 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Total Players</p>
            <p className="text-xl font-black text-primary">{users.length}</p>
          </div>
          <div className="glass !p-3 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Admins</p>
            <p className="text-xl font-black text-primary">{users.filter(u => u.role === "ADMIN").length}</p>
          </div>
          <div className="glass !p-3 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Completed</p>
            <p className="text-xl font-black text-green-400">{users.filter(u => u.level >= 5).length}</p>
          </div>
        </div>

        {/* Table with search */}
        <AdminTable users={users} />

        <footer className="text-gray-600 text-[10px] text-center uppercase tracking-[0.2em] font-bold pt-4">
          Protocol: Physical presence verification is strictly mandatory before level elevation.
        </footer>
      </div>
    </div>
  );
}
