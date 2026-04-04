"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function promotePlayer(userId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });

  if (user && user.level < 5) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        level: user.level + 1,
        lastPromotedAt: new Date(),
      },
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/leaderboard");
  }
}

export async function makeAdmin(userId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });
  revalidatePath("/admin");
}

export async function startCompetitionTimer() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.settings.upsert({
    where: { key: "competition_start" },
    update: { value: new Date().toISOString() },
    create: { key: "competition_start", value: new Date().toISOString() },
  });
  revalidatePath("/leaderboard");
  revalidatePath("/admin");
}

export async function resetCompetitionTimer() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.settings.deleteMany({ where: { key: "competition_start" } });
  revalidatePath("/leaderboard");
  revalidatePath("/admin");
}

export async function getGistContent(gistUrl: string) {
  try {
    const rawUrl = gistUrl.replace("gist.github.com", "gist.githubusercontent.com") + "/raw?t=" + Date.now();
    const response = await fetch(rawUrl, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error("Failed to fetch raw Gist");
    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Gist Fetch Error:", error);
    return "Could not retrieve task content. Please verify your connection or contact an admin.";
  }
}

export async function updateTeamName(newName: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: newName },
  });
  
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
}
