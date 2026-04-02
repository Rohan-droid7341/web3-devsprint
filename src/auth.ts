import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if email ends with @iiitl.ac.in
      if (user.email?.endsWith("@iiitl.ac.in")) {
        return true
      }
      return false // Return false to deny sign-in
    },
    async session({ session, user }) {
      if (session.user) {
        // Fetch role and level from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, level: true, email: true },
        })
        
        let role = dbUser?.role || "PLAYER"
        
        // Root admin logic
        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
        if (dbUser?.email && adminEmails.includes(dbUser.email)) {
            role = "ADMIN"
        }

        (session.user as any).role = role;
        (session.user as any).level = dbUser?.level || 1;
        (session.user as any).id = user.id;
      }
      return session
    },
  },
})
