import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { startCompetitionTimer, resetCompetitionTimer } from "@/app/admin/actions";
import { Timer, Trophy, Medal, Clock, Play, RotateCcw, Crown } from "lucide-react";
import Link from "next/link";

function formatDuration(ms: number): string {
  if (ms < 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getRankStyle(rank: number) {
  if (rank === 1) return { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-400" };
  if (rank === 2) return { bg: "bg-gray-300/10", border: "border-gray-400/40", text: "text-gray-300" };
  if (rank === 3) return { bg: "bg-amber-700/10", border: "border-amber-700/40", text: "text-amber-600" };
  return { bg: "bg-white/5", border: "border-white/5", text: "text-gray-500" };
}

export default async function Leaderboard() {
  const session = await auth();

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Get competition start time
  const startSetting = await prisma.settings.findUnique({
    where: { key: "competition_start" },
  });
  const competitionStart = startSetting ? new Date(startSetting.value) : null;

  // Get all players who have been promoted (level > 1)
  const players = await prisma.user.findMany({
    where: {
      level: { gt: 1 },
      role: { not: "ADMIN" },
    },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      lastPromotedAt: true,
    },
    orderBy: [
      { level: "desc" },
      { lastPromotedAt: "asc" },
    ],
  });

  // Compute rankings
  const rankings = players.map((player, index) => {
    const timeTaken = competitionStart && player.lastPromotedAt
      ? player.lastPromotedAt.getTime() - competitionStart.getTime()
      : -1;
    return {
      ...player,
      rank: index + 1,
      timeTaken,
    };
  });

  const now = new Date();
  const elapsedSinceStart = competitionStart
    ? now.getTime() - competitionStart.getTime()
    : 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass !rounded-none border-x-0 border-t-0 !p-4 sticky top-0 z-50">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-primary" />
            <h1 className="text-xl font-black font-heading uppercase">
              LIVE <span className="gold-gradient">LEADERBOARD</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/api/export-leaderboard" download className="text-primary hover:text-white transition text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-primary/20 px-3 py-1 rounded-md bg-primary/10">
              Download CSV
            </a>
            <span className="w-px h-4 bg-white/10 mx-2"></span>
            <Link href="/admin" className="text-gray-500 hover:text-white transition text-xs font-bold uppercase tracking-widest">
              Admin Panel
            </Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-white transition text-xs font-bold uppercase tracking-widest">
              Arena
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">

        {/* Timer Control Panel */}
        <div className="glass !p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Timer size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Competition Timer</p>
              {competitionStart ? (
                <p className="text-xl font-black text-primary font-mono tracking-wider">
                  RUNNING — Started {competitionStart.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  <span className="text-gray-500 text-sm ml-3">
                    ({formatDuration(elapsedSinceStart)} elapsed)
                  </span>
                </p>
              ) : (
                <p className="text-xl font-black text-gray-600">NOT STARTED</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!competitionStart ? (
              <form action={startCompetitionTimer}>
                <button type="submit" className="gold-button !py-2 !px-5 !text-sm flex items-center gap-2">
                  <Play size={16} /> START TIMER
                </button>
              </form>
            ) : (
              <form action={resetCompetitionTimer}>
                <button type="submit" className="border border-red-500/30 text-red-400 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-red-500/10 transition flex items-center gap-2">
                  <RotateCcw size={16} /> RESET
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass !p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total Ranked</p>
            <p className="text-2xl font-black text-primary">{rankings.length}</p>
          </div>
          <div className="glass !p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Highest Level</p>
            <p className="text-2xl font-black text-primary">{rankings.length > 0 ? rankings[0].level : "—"}</p>
          </div>
          <div className="glass !p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Fastest Time</p>
            <p className="text-2xl font-black text-primary font-mono">
              {rankings.length > 0 && rankings[0].timeTaken > 0 ? formatDuration(rankings[0].timeTaken) : "—"}
            </p>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="glass !p-0 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-primary/5 border-b border-primary/10 text-[10px] text-gray-500 uppercase tracking-widest font-black">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Team</div>
            <div className="col-span-3 text-center">Level</div>
            <div className="col-span-3 text-center">Time</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
            {rankings.map((player) => {
              const style = getRankStyle(player.rank);
              return (
                <div
                  key={player.id}
                  className={`grid grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-white/5 transition-colors ${
                    player.rank <= 3 ? style.bg : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    {player.rank <= 3 ? (
                      <div className={`w-8 h-8 mx-auto rounded-full border ${style.border} flex items-center justify-center`}>
                        {player.rank === 1 ? (
                          <Crown size={16} className={style.text} />
                        ) : (
                          <span className={`text-sm font-black ${style.text}`}>{player.rank}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-600">{player.rank}</span>
                    )}
                  </div>

                  {/* Player info */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                      {player.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{player.name || "Unknown"}</p>
                      <p className="text-[10px] text-gray-600 truncate">{player.email}</p>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-black ${player.level >= 5 ? 'text-green-400' : 'text-primary'}`}>
                      <Medal size={14} /> {player.level >= 5 ? 'COMPLETED' : `LEVEL ${player.level}`}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="col-span-3 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-mono font-bold text-gray-300">
                      <Clock size={14} className="text-gray-500" />
                      {player.timeTaken > 0 ? formatDuration(player.timeTaken) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {rankings.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-600 uppercase tracking-widest text-xs font-black">
                No rankings yet. Start the timer and approve submissions to see rankings here.
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-[10px] text-center uppercase tracking-[0.2em] font-bold">
          Rankings: Sorted by highest level, then fastest completion time
        </p>
      </div>
    </div>
  );
}
