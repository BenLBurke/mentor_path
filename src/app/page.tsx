"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const profile = loadProfile();
    if (profile) {
      router.replace("/mentor");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Decorative drifting clouds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="animate-drift absolute top-[12%] left-[8%] w-48 h-16 bg-white/70 rounded-full blur-2xl" />
        <div className="animate-drift absolute top-[25%] right-[10%] w-64 h-20 bg-white/60 rounded-full blur-2xl [animation-delay:2s]" />
        <div className="animate-drift absolute bottom-[18%] left-[18%] w-56 h-16 bg-white/50 rounded-full blur-2xl [animation-delay:4s]" />
      </div>

      <div className="relative max-w-2xl w-full space-y-10">
        <p className="label-caps text-[#1e9fc4] animate-float-up">
          Your AI Career Mentor
        </p>

        <h1 className="font-serif text-6xl md:text-7xl font-medium leading-[1.05] animate-float-up delay-100">
          Discover the path
          <br />
          <span className="italic">you were meant for</span>
        </h1>

        <p className="text-base md:text-lg text-[#0e3a47]/70 max-w-md mx-auto leading-relaxed animate-float-up delay-200">
          Explore what you could become, see what careers really look like, and
          get guidance that grows with you — for years, not minutes.
        </p>

        <div className="animate-float-up delay-300">
          <button
            onClick={() => router.push("/onboarding")}
            className="label-caps inline-flex items-center gap-3 border border-[#0e3a47] text-[#0e3a47] px-10 py-4 rounded-full hover:bg-[#0e3a47] hover:text-white transition-all duration-300 cursor-pointer"
          >
            Begin Your Journey
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 animate-float-up delay-300">
          {[
            ["Mentor", "Personal AI guidance shaped around you"],
            ["Explore", "The daily reality of every career"],
            ["Grow", "A companion that evolves as you do"],
          ].map(([title, desc]) => (
            <div key={title} className="space-y-2">
              <p className="font-serif italic text-2xl text-[#1e9fc4]">{title}</p>
              <p className="text-xs text-[#0e3a47]/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
