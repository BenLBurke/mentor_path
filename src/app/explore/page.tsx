"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { getCareersByCategory } from "@/lib/careers";
import Nav from "@/components/nav";
import Link from "next/link";
import { Clock, DollarSign, GraduationCap, ChevronRight } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700",
  Healthcare: "bg-emerald-100 text-emerald-700",
  "Business & Finance": "bg-amber-100 text-amber-700",
  "Creative & Design": "bg-pink-100 text-pink-700",
  Education: "bg-purple-100 text-purple-700",
  "Sports & Athletics": "bg-orange-100 text-orange-700",
};

export default function ExplorePage() {
  const router = useRouter();
  const grouped = getCareersByCategory();

  useEffect(() => {
    if (!loadProfile()) router.replace("/onboarding");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-6 md:pt-18 pb-24">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Explore Careers</h1>
          <p className="text-slate-500">
            See what different careers actually look like — the daily reality,
            not just the title.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([category, careers]) => (
            <section key={category}>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {category}
              </h2>
              <div className="grid gap-3">
                {careers.map((career) => (
                  <Link
                    key={career.id}
                    href={`/explore/${career.id}`}
                    className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {career.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {career.salaryRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {career.timeToEntry}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {career.education.split("(")[0].trim()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
