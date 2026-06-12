"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { Map, ArrowRight, Compass, MessageCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const profile = loadProfile();
    if (profile) {
      router.replace("/mentor");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-indigo-100 rounded-2xl p-4">
            <Map className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            MentorPath
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Your AI career mentor. Explore what you could become, discover paths
            you never knew existed, and get real guidance — not just a list of
            jobs.
          </p>
        </div>

        <div className="grid gap-4 text-left">
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <MessageCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-800">Talk to your mentor</p>
              <p className="text-sm text-slate-500">
                Get personalized guidance based on your goals, interests, and what you want to avoid.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <Compass className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-800">Explore careers</p>
              <p className="text-sm text-slate-500">
                See what jobs actually look like day-to-day — not just the title, but the reality.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <TrendingUp className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-800">Grow over time</p>
              <p className="text-sm text-slate-500">
                Your path evolves with you. Come back as your interests change and your mentor remembers.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/onboarding")}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
