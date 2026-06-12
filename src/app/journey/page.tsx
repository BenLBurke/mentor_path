"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import {
  loadJourney,
  saveJourney,
  clearJourney,
  loadProgress,
  saveProgress,
} from "@/lib/journey";
import { CAREER_PATHS } from "@/lib/careers";
import { Journey, UserProfile } from "@/lib/types";
import Nav from "@/components/nav";
import {
  Check,
  ChevronDown,
  Flag,
  Loader2,
  MapPin,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function JourneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
    setJourney(loadJourney());
    setCompleted(loadProgress());
    const fromQuery = searchParams.get("target");
    if (fromQuery) setTarget(fromQuery);
  }, [router, searchParams]);

  const suggestions = useMemo(() => {
    if (!profile) return [];
    const fromDreams = profile.dreamCareers;
    const fromCatalog = CAREER_PATHS.filter((c) =>
      c.skills.some((s) =>
        profile.interests.some((i) =>
          s.toLowerCase().includes(i.toLowerCase())
        )
      )
    )
      .slice(0, 4)
      .map((c) => c.title);
    return Array.from(new Set([...fromDreams, ...fromCatalog])).slice(0, 6);
  }, [profile]);

  const generate = async (chosenTarget: string) => {
    if (!chosenTarget.trim() || !profile || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: chosenTarget.trim(), profile }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      saveJourney(data.journey);
      saveProgress([]);
      setJourney(data.journey);
      setCompleted([]);
      setExpanded(data.journey.milestones[0]?.id ?? null);
    } catch {
      setError(
        "Couldn't build your journey. Make sure the claude CLI is set up, then try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    const next = completed.includes(id)
      ? completed.filter((c) => c !== id)
      : [...completed, id];
    setCompleted(next);
    saveProgress(next);
  };

  const startOver = () => {
    if (confirm("Clear this journey and build a new one?")) {
      clearJourney();
      setJourney(null);
      setCompleted([]);
      setTarget("");
    }
  };

  if (!profile) return null;

  const doneCount = journey
    ? journey.milestones.filter((m) => completed.includes(m.id)).length
    : 0;
  const pct = journey ? Math.round((doneCount / journey.milestones.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-10 md:pt-24 pb-28">
        {/* ----- Picker state: no journey yet ----- */}
        {!journey && (
          <div className="text-center space-y-10 animate-float-up">
            <div className="space-y-4">
              <p className="label-caps text-[#1e9fc4]">Your Journey</p>
              <h1 className="font-serif text-5xl md:text-6xl font-medium leading-tight">
                Where do you want
                <br />
                <span className="italic">to end up?</span>
              </h1>
              <p className="text-sm text-[#0e3a47]/60 max-w-md mx-auto leading-relaxed">
                Pick a destination and your mentor will map the whole path —
                from exactly where you are today to the day you arrive.
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                <p className="label-caps text-[#0e3a47]/45">Based on you</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTarget(s)}
                      className={`label-caps px-5 py-3 rounded-full border transition-all duration-300 cursor-pointer ${
                        target === s
                          ? "border-[#1e9fc4] bg-[#1e9fc4] text-white"
                          : "border-[#0e3a47]/25 bg-white/60 text-[#0e3a47] hover:border-[#0e3a47]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate(target)}
                placeholder="Or type any career or dream..."
                className="w-full max-w-md mx-auto block bg-transparent border-b border-[#0e3a47]/30 px-2 py-3 text-center font-serif text-2xl focus:outline-none focus:border-[#1e9fc4] placeholder:text-[#0e3a47]/30 transition-colors"
              />
              <button
                onClick={() => generate(target)}
                disabled={!target.trim() || loading}
                className="label-caps inline-flex items-center gap-3 border border-[#0e3a47] text-[#0e3a47] px-10 py-4 rounded-full hover:bg-[#0e3a47] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mapping your path...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Build My Journey
                  </>
                )}
              </button>
              {loading && (
                <p className="text-xs text-[#0e3a47]/50 animate-pulse">
                  Your mentor is charting every step — this takes a moment.
                </p>
              )}
              {error && <p className="text-sm text-red-500/80">{error}</p>}
            </div>
          </div>
        )}

        {/* ----- Timeline state ----- */}
        {journey && (
          <div className="space-y-12">
            <div className="text-center space-y-4 animate-float-up">
              <p className="label-caps text-[#1e9fc4]">
                The Road to · {journey.totalDuration}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl font-medium">
                {journey.target}
              </h1>
              {/* Progress bar */}
              <div className="max-w-xs mx-auto space-y-2 pt-2">
                <div className="h-1 rounded-full bg-[#0e3a47]/10 overflow-hidden">
                  <div
                    className="h-full bg-[#1e9fc4] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="label-caps text-[#0e3a47]/45">
                  {doneCount} of {journey.milestones.length} milestones · {pct}%
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-12 md:pl-16">
              {/* The line */}
              <div className="absolute left-[15px] md:left-[23px] top-3 bottom-3 w-px bg-[#3cbbde]/30" />
              <div
                className="absolute left-[15px] md:left-[23px] top-3 w-px bg-[#1e9fc4] transition-all duration-700"
                style={{
                  height: `calc((100% - 24px) * ${doneCount / journey.milestones.length})`,
                }}
              />

              {/* Start node */}
              <div className="relative mb-10 animate-float-up">
                <div className="absolute -left-12 md:-left-16 top-0.5 w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0e3a47] text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                </div>
                <p className="label-caps text-[#1e9fc4]">You are here</p>
                <p className="font-serif italic text-xl text-[#0e3a47]/85 mt-1">
                  {journey.startingPoint}
                </p>
              </div>

              {/* Milestones */}
              {journey.milestones.map((m, i) => {
                const done = completed.includes(m.id);
                const isOpen = expanded === m.id;
                return (
                  <div
                    key={m.id}
                    className="relative mb-8 animate-float-up"
                    style={{ animationDelay: `${(i + 1) * 80}ms` }}
                  >
                    {/* Node: click to toggle complete */}
                    <button
                      onClick={() => toggleComplete(m.id)}
                      title={done ? "Mark as not done" : "Mark as done"}
                      className={`absolute -left-12 md:-left-16 top-1 w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        done
                          ? "bg-[#1e9fc4] border-[#1e9fc4] text-white"
                          : "bg-white border-[#3cbbde]/50 text-[#3cbbde] hover:border-[#1e9fc4]"
                      }`}
                    >
                      {done ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <span className="font-serif text-sm md:text-lg">
                          {i + 1}
                        </span>
                      )}
                    </button>

                    {/* Card: click to expand */}
                    <div
                      className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                        done
                          ? "bg-[#e8f7fb]/70 border-[#1e9fc4]/30"
                          : "bg-white/70 border-[#3cbbde]/20"
                      } ${isOpen ? "shadow-[0_8px_32px_rgba(60,187,222,0.15)]" : ""}`}
                    >
                      <button
                        onClick={() => setExpanded(isOpen ? null : m.id)}
                        className="w-full text-left p-5 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="label-caps text-[#0e3a47]/45">
                              {m.timeframe}
                            </p>
                            <h3
                              className={`font-serif text-2xl font-medium mt-0.5 ${
                                done
                                  ? "text-[#0e3a47]/55 line-through decoration-1"
                                  : "text-[#0e3a47]"
                              }`}
                            >
                              {m.title}
                            </h3>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-[#1e9fc4] shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5 space-y-4 text-sm">
                            <p className="text-[#0e3a47]/70 leading-relaxed">
                              {m.description}
                            </p>
                            <div>
                              <p className="label-caps text-[#1e9fc4] mb-2">
                                Do this
                              </p>
                              <ul className="space-y-1.5">
                                {m.actions.map((a) => (
                                  <li
                                    key={a}
                                    className="flex gap-2.5 text-[#0e3a47]/75 leading-relaxed"
                                  >
                                    <span className="text-[#1e9fc4] mt-0.5">
                                      —
                                    </span>
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {m.skills.map((s) => (
                                <span
                                  key={s}
                                  className="label-caps px-4 py-2 rounded-full border border-[#0e3a47]/15 bg-white/60 text-[#0e3a47]/70"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className="font-serif italic text-base text-[#1e9fc4]">
                              For fun: {m.funFactor}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* End node */}
              <div
                className="relative animate-float-up"
                style={{
                  animationDelay: `${(journey.milestones.length + 1) * 80}ms`,
                }}
              >
                <div
                  className={`absolute -left-12 md:-left-16 top-0.5 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    pct === 100
                      ? "bg-[#1e9fc4] text-white"
                      : "bg-white border border-[#3cbbde]/50 text-[#3cbbde]"
                  }`}
                >
                  <Flag className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                </div>
                <p className="label-caps text-[#1e9fc4]">The destination</p>
                <p className="font-serif italic text-xl text-[#0e3a47]/85 mt-1">
                  {journey.endState}
                </p>
                {pct === 100 && (
                  <p className="font-serif text-2xl text-[#1e9fc4] mt-3 animate-float-up">
                    You made it. Time to dream bigger. ✨
                  </p>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startOver}
                className="label-caps inline-flex items-center gap-2 text-[#0e3a47]/40 hover:text-[#0e3a47] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Map a different journey
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <Suspense fallback={null}>
      <JourneyContent />
    </Suspense>
  );
}
