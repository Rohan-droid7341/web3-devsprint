import Link from "next/link";
import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="container text-center space-y-12 py-20 flex flex-col items-center">
        <header className="space-y-6">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tight">
            WEB3 <br />
            <span className="gold-gradient">DEVSPRINT</span>
          </h1>
          <p className="text-2xl text-gray-400 font-light tracking-[0.2em] uppercase">
            Evolution of the Decentralized Mind
          </p>
        </header>

        <section className="glass mt-12 max-w-3xl space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl">4 LEVELS. 1 CHAMPION.</h2>
            <p className="text-gray-300 leading-relaxed text-xl">
              Unlock the secrets of the blockchain. Solve tasks, earn badges, and prove your 
              mastery in person to the guardians. 
            </p>
            
            <div className="pt-8">
              {session ? (
                <div className="space-y-6">
                  <p className="text-gray-400">Welcome back, {session.user?.name}</p>
                  <Link href="/dashboard" className="gold-button">
                    Enter the Arena
                  </Link>
                </div>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/dashboard" });
                  }}
                >
                  <button type="submit" className="gold-button">
                    Login with Google
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Subtle Decorative elements - Removed animations as per user request */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
        </section>

        <footer className="pt-20 text-gray-500 text-sm tracking-widest uppercase pb-12">
          &copy; 2026 IIITL  &bull; AXIOS WEB3 WING
        </footer>
      </div>
    </main>
  );
} 
