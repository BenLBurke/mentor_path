"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProfile, clearProfile } from "@/lib/profile";
import { UserProfile } from "@/lib/types";
import Nav from "@/components/nav";
import { RotateCcw } from "lucide-react";

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

  const section = (label: string, children: React.ReactNode) => (
    <div className="space-y-3 text-center">
      <p className="label-caps text-[#1e9fc4]">{label}</p>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-10 md:pt-24 pb-24">
        <div className="text-center space-y-3 mb-12 animate-float-up">
          <p className="label-caps text-[#1e9fc4]">Your Journey</p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium">
            {profile.name}
          </h1>
          <p className="label-caps text-[#0e3a47]/50">
            {ageLabels[profile.ageRange]} · Since{" "}
            {new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-10 animate-float-up delay-100">
          {section(
            "North Star",
            <p className="font-serif italic text-3xl text-[#0e3a47]">
              {profile.primaryGoal}
            </p>
          )}

          {section(
            "Interests",
            <div className="flex flex-wrap justify-center gap-3">
              {profile.interests.map((i) => (
                <span
                  key={i}
                  className="label-caps px-5 py-2.5 rounded-full border border-[#1e9fc4]/40 bg-white/60 text-[#0e3a47]"
                >
                  {i}
                </span>
              ))}
            </div>
          )}

          {profile.aversions.length > 0 &&
            section(
              "Steering Clear Of",
              <div className="flex flex-wrap justify-center gap-3">
                {profile.aversions.map((a) => (
                  <span
                    key={a}
                    className="label-caps px-5 py-2.5 rounded-full border border-[#0e3a47]/20 bg-white/40 text-[#0e3a47]/60"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}

          {profile.dreamCareers.length > 0 &&
            section(
              "Dream Careers",
              <p className="font-serif italic text-2xl text-[#0e3a47]/85">
                {profile.dreamCareers.join(" · ")}
              </p>
            )}

          <div className="text-center pt-6">
            <button
              onClick={handleReset}
              className="label-caps inline-flex items-center gap-2 text-[#0e3a47]/40 hover:text-[#0e3a47] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset and start over
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
