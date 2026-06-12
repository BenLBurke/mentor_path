"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/profile";
import { UserProfile } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

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

  const pill = (selected: boolean, danger = false) =>
    `label-caps px-5 py-3 rounded-full border transition-all duration-300 cursor-pointer ${
      selected
        ? danger
          ? "border-[#0e3a47] bg-[#0e3a47] text-white"
          : "border-[#1e9fc4] bg-[#1e9fc4] text-white"
        : "border-[#0e3a47]/25 bg-white/60 text-[#0e3a47] hover:border-[#0e3a47]"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === step
                  ? "w-2.5 h-2.5 bg-[#1e9fc4]"
                  : i < step
                    ? "w-1.5 h-1.5 bg-[#1e9fc4]/60"
                    : "w-1.5 h-1.5 bg-[#0e3a47]/15"
              }`}
            />
          ))}
        </div>

        <div key={step} className="animate-float-up space-y-6 text-center">
          {/* Step 0: Name */}
          {step === 0 && (
            <>
              <p className="label-caps text-[#1e9fc4]">First things first</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium">
                What should we <span className="italic">call you?</span>
              </h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="w-full max-w-sm mx-auto block bg-transparent border-b border-[#0e3a47]/30 px-2 py-3 text-center font-serif text-2xl focus:outline-none focus:border-[#1e9fc4] placeholder:text-[#0e3a47]/30 transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && canProceed() && setStep(1)}
              />
            </>
          )}

          {/* Step 1: Age range */}
          {step === 1 && (
            <>
              <p className="label-caps text-[#1e9fc4]">Chapter of life</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium">
                Where are you, <span className="italic">{name}?</span>
              </h2>
              <div className="grid gap-3 max-w-sm mx-auto pt-2">
                {AGE_RANGES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setAgeRange(value)}
                    className={pill(ageRange === value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <>
              <p className="label-caps text-[#1e9fc4]">Your north star</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium">
                What matters <span className="italic">most to you?</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setPrimaryGoal(goal)}
                    className={pill(primaryGoal === goal)}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <>
              <p className="label-caps text-[#1e9fc4]">No wrong answers</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium">
                What gets you <span className="italic">excited?</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {SAMPLE_INTERESTS.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggle(interests, item, setInterests)}
                    className={pill(interests.includes(item))}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 4: Aversions */}
          {step === 4 && (
            <>
              <p className="label-caps text-[#1e9fc4]">Optional, but honest</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium">
                Anything to <span className="italic">avoid?</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {SAMPLE_AVERSIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggle(aversions, item, setAversions)}
                    className={pill(aversions.includes(item), true)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 5: Dream careers */}
          {step === 5 && (
            <>
              <p className="label-caps text-[#1e9fc4]">Dream freely</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium">
                Any careers <span className="italic">in mind?</span>
              </h2>
              <p className="text-sm text-[#0e3a47]/60 max-w-sm mx-auto">
                Even if it&apos;s wild — astronaut, pro gamer, whatever. Blank is
                fine too; your mentor will help you discover options.
              </p>
              <textarea
                value={dreamCareers}
                onChange={(e) => setDreamCareers(e.target.value)}
                placeholder="Doctor, game designer, architect..."
                rows={2}
                className="w-full max-w-md mx-auto block bg-transparent border-b border-[#0e3a47]/30 px-2 py-3 text-center font-serif text-xl focus:outline-none focus:border-[#1e9fc4] placeholder:text-[#0e3a47]/30 resize-none transition-colors"
              />
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="label-caps flex items-center gap-2 text-[#0e3a47]/50 hover:text-[#0e3a47] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="label-caps border border-[#0e3a47] text-[#0e3a47] px-10 py-3.5 rounded-full hover:bg-[#0e3a47] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="label-caps bg-[#0e3a47] text-white px-10 py-3.5 rounded-full hover:bg-[#1e9fc4] transition-all duration-300 cursor-pointer"
            >
              Meet Your Mentor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
