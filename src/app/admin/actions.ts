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

  if (user && user.level < 4) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: user.level + 1 },
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
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

export async function getGistContent(gistUrl: string) {
    try {
        // Construct the raw URL: https://gist.github.com/user/id -> https://gist.githubusercontent.com/user/id/raw
        const rawUrl = gistUrl.replace("gist.github.com", "gist.githubusercontent.com") + "/raw";

        // Fetch raw text directly
        const response = await fetch(rawUrl, {
            next: { revalidate: 300 } // Cache for 5 mins
        });

        if (!response.ok) throw new Error("Failed to fetch raw Gist");

        const content = await response.text();
        return content;
    } catch (error) {
        console.error("Gist Fetch Error:", error);
        return "Could not retrieve task content. Please verify your connection or contact an admin.";
    }
}
