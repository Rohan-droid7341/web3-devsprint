import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function formatDuration(ms: number): string {
  if (ms < 0) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export async function GET() {
  const session = await auth();

  if ((session?.user as any)?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const startSetting = await prisma.settings.findUnique({
    where: { key: "competition_start" },
  });
  const competitionStart = startSetting ? new Date(startSetting.value) : null;

  const players = await prisma.user.findMany({
    where: { level: { gt: 1 } },
    orderBy: [
      { level: "desc" },
      { lastPromotedAt: "asc" },
    ],
  });

  let csv = "Rank,Team Name,Email,Level,Time Elapsed\n";
  
  players.forEach((player, index) => {
    const timeTaken = competitionStart && player.lastPromotedAt
      ? player.lastPromotedAt.getTime() - competitionStart.getTime()
      : -1;
      
    // Escape quotes to prevent CSV injection
    const escapedName = player.name ? player.name.replace(/"/g, '""') : "Unknown";
    const escapedEmail = player.email ? player.email.replace(/"/g, '""') : "";
    
    csv += `${index + 1},"${escapedName}","${escapedEmail}",${player.level},${formatDuration(timeTaken)}\n`;
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=web3_devsprint_leaderboard.csv",
    },
  });
}
