"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProfile, clearProfile } from "@/lib/profile";
import { UserProfile } from "@/lib/types";
import Nav from "@/components/nav";
import { User, Target, Heart, ShieldOff, Star, Calendar, RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
  }, [router]);

  const handleReset = () => {
    if (
      confirm(
        "This will reset your profile and start over. Your chat history will also be cleared. Continue?"
      )
    ) {
      clearProfile();
      router.push("/onboarding");
    }
  };

  if (!profile) return null;

  const ageLabels: Record<string, string> = {
    "middle-school": "Middle School (11–14)",
    "high-school": "High School (14–18)",
    college: "College (18–25)",
    adult: "Adult (25+)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-6 md:pt-18 pb-24">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Profile</h1>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {ageLabels[profile.ageRange]}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                <Target className="w-4 h-4" />
                Primary Goal
              </div>
              <p className="text-slate-900 font-medium">{profile.primaryGoal}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                <Heart className="w-4 h-4" />
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {profile.aversions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                  <ShieldOff className="w-4 h-4" />
                  Want to Avoid
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.aversions.map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.dreamCareers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                  <Star className="w-4 h-4" />
                  Dream Careers
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.dreamCareers.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <p className="text-sm text-slate-600">
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors mt-4 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset profile and start over
          </button>
        </div>
      </main>
    </div>
  );
}
