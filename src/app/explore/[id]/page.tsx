"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { getCareerById, CAREER_PATHS } from "@/lib/careers";
import { CareerPath } from "@/lib/types";
import Nav from "@/components/nav";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [career, setCareer] = useState<CareerPath | null>(null);

  useEffect(() => {
    if (!loadProfile()) {
      router.replace("/onboarding");
      return;
    }
    const c = getCareerById(params.id as string);
    if (!c) {
      router.replace("/explore");
      return;
    }
    setCareer(c);
  }, [params.id, router]);

  if (!career) return null;

  const relatedCareers = career.relatedPaths
    .map((id) => CAREER_PATHS.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 md:pt-22 pb-24">
        <button
          onClick={() => router.back()}
          className="label-caps flex items-center gap-2 text-[#0e3a47]/50 hover:text-[#0e3a47] mb-10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="space-y-10">
          <div className="text-center space-y-4 animate-float-up">
            <p className="label-caps text-[#1e9fc4]">{career.category}</p>
            <h1 className="font-serif text-5xl md:text-6xl font-medium">
              {career.title}
            </h1>
            <p className="text-[#0e3a47]/65 max-w-lg mx-auto leading-relaxed">
              {career.description}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#3cbbde]/25 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#3cbbde]/20 animate-float-up delay-100">
            {[
              ["Salary", career.salaryRange],
              ["Time to Entry", career.timeToEntry],
              ["Education", career.education.split("(")[0].trim()],
            ].map(([label, value]) => (
              <div key={label} className="p-5 text-center space-y-1.5">
                <p className="label-caps text-[#0e3a47]/45">{label}</p>
                <p className="font-serif text-lg leading-tight text-[#0e3a47]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="animate-float-up delay-200 space-y-3 text-center">
            <p className="label-caps text-[#1e9fc4]">A Day in the Life</p>
            <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-[#0e3a47]/85 max-w-xl mx-auto">
              &ldquo;{career.dayInLife}&rdquo;
            </p>
          </div>

          <div className="animate-float-up delay-200 space-y-4 text-center">
            <p className="label-caps text-[#1e9fc4]">Key Skills</p>
            <div className="flex flex-wrap justify-center gap-3">
              {career.skills.map((skill) => (
                <span
                  key={skill}
                  className="label-caps px-5 py-2.5 rounded-full border border-[#0e3a47]/20 bg-white/60 text-[#0e3a47]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {relatedCareers.length > 0 && (
            <div className="animate-float-up delay-300 space-y-4">
              <div className="flex items-center gap-4">
                <p className="label-caps text-[#1e9fc4] shrink-0">
                  Related Paths
                </p>
                <div className="h-px flex-1 bg-[#3cbbde]/25" />
              </div>
              <div className="grid gap-3">
                {relatedCareers.map(
                  (rc) =>
                    rc && (
                      <Link
                        key={rc.id}
                        href={`/explore/${rc.id}`}
                        className="group flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl border border-[#3cbbde]/20 px-5 py-4 hover:border-[#1e9fc4]/50 transition-all duration-300"
                      >
                        <div>
                          <p className="font-serif text-xl text-[#0e3a47]">
                            {rc.title}
                          </p>
                          <p className="label-caps text-[#0e3a47]/45 mt-1">
                            {rc.salaryRange} · {rc.timeToEntry}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#1e9fc4] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )
                )}
              </div>
            </div>
          )}

          <div className="text-center animate-float-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/journey?target=${encodeURIComponent(career.title)}`}
              className="label-caps inline-block bg-[#0e3a47] text-white px-10 py-4 rounded-full hover:bg-[#1e9fc4] transition-all duration-300"
            >
              Map my journey to this career
            </Link>
            <Link
              href="/mentor"
              className="label-caps inline-block border border-[#0e3a47] text-[#0e3a47] px-10 py-4 rounded-full hover:bg-[#0e3a47] hover:text-white transition-all duration-300"
            >
              Ask your mentor about it
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
