import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LEVELS } from "@/data/levels";
import { LogOut, Trophy, Lock, Unlock, ExternalLink } from "lucide-react";
import { signOut } from "@/auth";
import { TaskView } from "@/components/TaskView";
import { TeamSetupModal } from "@/components/TeamSetupModal";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const userLevel = (session.user as any).level || 1;
  const userRole = (session.user as any).role || "PLAYER";

  return (
    <div className="min-h-screen pb-20">
      <TeamSetupModal />
      
      {/* Navigation Header */}
      <header className="glass p-6 sticky top-0 z-50 rounded-none border-t-0 border-x-0 mb-12 py-6">
        <div className="container flex items-center justify-between">
          <h1 className="text-3xl font-black font-heading">
            WEB3 <span className="gold-gradient">DEVSPRINT</span>
          </h1>
          <div className="flex items-center gap-8">
            {userRole === "ADMIN" && (
              <a href="/admin" className="text-primary hover:text-white transition uppercase text-xs font-bold tracking-[0.2em] border border-primary/40 px-4 py-2 rounded-lg">
                Admin Console
              </a>
            )}
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <span className="text-gray-400 text-sm font-medium">{session.user?.name} (Lvl {userLevel})</span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={22} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container space-y-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Progress (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <header className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">ARENA PROGRESS</h2>
            </header>
            
            <div className="space-y-4">
              {LEVELS.map((level) => {
                const isUnlocked = level.level <= userLevel;
                const isCurrent = level.level === userLevel;
                const isCompleted = level.level < userLevel;

                return (
                  <div 
                    key={level.level}
                    className={`glass !p-6 transition-all duration-300 ${
                      isCurrent && 'gold-border-glow ring-1 ring-primary/20'
                    } ${!isUnlocked && 'opacity-40 grayscale pointer-events-none'}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary/20 ${
                            isCompleted ? 'bg-success/10 border-success text-success' : 
                            isCurrent ? 'bg-primary/20 border-primary text-primary' : 
                            'text-gray-600'
                          }`}>
                          {isCompleted ? <Unlock size={16} /> : (isUnlocked ? <Unlock size={16} /> : <Lock size={16} />)}
                        </div>
                        <div>
                          <p className="text-primary font-black uppercase tracking-widest text-xs mb-1">Level {level.level}</p>
                          <h3 className="text-xl font-black uppercase tracking-tight">
                            {level.title}
                          </h3>
                        </div>
                      </div>
                      {isCompleted && (
                        <span className="bg-success/20 text-success text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-success/30 flex items-center gap-2">
                          Evolution Complete <Trophy size={14} />
                        </span>
                      )}
                    </div>

                    {isUnlocked ? (
                      <div className="space-y-3">
                        <p className="text-gray-400 text-sm font-light italic leading-relaxed">"{level.description}"</p>
                        {level.content && (
                          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-white text-base font-medium leading-relaxed">{level.content}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 items-center pt-2">
                           <TaskView levelTitle={level.title} gistUrl={level.link || ""} />
                           {isCurrent && (
                             <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest border border-white/10 px-4 py-2 rounded-lg bg-white/5">
                               Awaiting Guardian Verification
                             </span>
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                         <p className="text-gray-600 uppercase text-xs tracking-[0.3em] font-black">LOCKED BY THE GUARDIANS</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Achievements (4 columns) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-40">
            <div className="glass !p-6 text-center border-primary/20 bg-primary/5">
               <h2 className="text-lg font-black uppercase tracking-widest mb-6">BADGE ARCHIVE</h2>
               <div className="grid grid-cols-2 gap-4 place-items-center">
                  {LEVELS.map((level) => {
                    const isEarned = level.level < userLevel;
                    return (
                      <div key={level.level} className={`flex flex-col items-center gap-4 transition-all duration-300 ${!isEarned && 'opacity-20 grayscale scale-75'}`}>
                        <div className="badge">
                          <Trophy size={24} className="text-primary" />
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-tight">{level.badges[0]}</span>
                      </div>
                    );
                  })}
               </div>
               
               
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
