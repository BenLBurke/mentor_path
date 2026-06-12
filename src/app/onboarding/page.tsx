"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/profile";
import { UserProfile } from "@/lib/types";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const AGE_RANGES = [
  { value: "middle-school", label: "Middle School (11–14)" },
  { value: "high-school", label: "High School (14–18)" },
  { value: "college", label: "College (18–25)" },
  { value: "adult", label: "Adult (25+)" },
] as const;

const GOALS = [
  "Get a scholarship",
  "Make good money",
  "Help people",
  "Be creative",
  "Work for myself",
  "Change the world",
  "Have work-life balance",
  "Travel and see the world",
];

const SAMPLE_INTERESTS = [
  "Technology",
  "Science",
  "Art & Design",
  "Music",
  "Sports",
  "Writing",
  "Math",
  "Animals",
  "Building things",
  "Talking to people",
  "Solving puzzles",
  "Business",
  "Medicine",
  "Law",
  "Cooking",
  "Gaming",
];

const SAMPLE_AVERSIONS = [
  "Blood / medical stuff",
  "Public speaking",
  "Sitting at a desk all day",
  "Heavy math",
  "Working alone",
  "Long years of school",
  "Low pay early on",
  "High stress",
  "Physical labor",
  "Rigid schedule",
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState<UserProfile["ageRange"] | "">("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [aversions, setAversions] = useState<string[]>([]);
  const [dreamCareers, setDreamCareers] = useState("");

  const toggle = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return ageRange !== "";
      case 2: return primaryGoal !== "";
      case 3: return interests.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim(),
      ageRange: ageRange as UserProfile["ageRange"],
      primaryGoal,
      interests,
      aversions,
      dreamCareers: dreamCareers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    router.push("/mentor");
  };

  const totalSteps = 6;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-lg w-full space-y-8">
        {/* Progress */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-indigo-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Step 0: Name */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              What should we call you?
            </h2>
            <p className="text-slate-500">Your mentor wants to know who they're talking to.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && canProceed() && setStep(1)}
            />
          </div>
        )}

        {/* Step 1: Age range */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Where are you in life, {name}?
            </h2>
            <p className="text-slate-500">This helps your mentor give age-appropriate guidance.</p>
            <div className="grid gap-3">
              {AGE_RANGES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setAgeRange(value)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    ageRange === value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              What matters most to you?
            </h2>
            <p className="text-slate-500">Pick the one that resonates the most right now.</p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setPrimaryGoal(goal)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-sm cursor-pointer ${
                    primaryGoal === goal
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              What gets you excited?
            </h2>
            <p className="text-slate-500">Pick as many as you want — no wrong answers.</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_INTERESTS.map((item) => (
                <button
                  key={item}
                  onClick={() => toggle(interests, item, setInterests)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    interests.includes(item)
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Aversions */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Anything you want to avoid?
            </h2>
            <p className="text-slate-500">
              This helps your mentor steer you away from paths that won't work. Skip if nothing applies.
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_AVERSIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => toggle(aversions, item, setAversions)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    aversions.includes(item)
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Dream careers */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Any dream careers in mind?
            </h2>
            <p className="text-slate-500">
              Even if it's wild — astronaut, pro gamer, whatever. If nothing comes to mind, that's fine too. Your mentor will help you discover options.
            </p>
            <textarea
              value={dreamCareers}
              onChange={(e) => setDreamCareers(e.target.value)}
              placeholder="e.g., Doctor, game designer, YouTuber, architect..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 disabled:opacity-0 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Meet Your Mentor
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
