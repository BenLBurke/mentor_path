"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { getCareersByCategory } from "@/lib/careers";
import Nav from "@/components/nav";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const grouped = getCareersByCategory();

  useEffect(() => {
    if (!loadProfile()) router.replace("/onboarding");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-10 md:pt-24 pb-24">
        <div className="text-center space-y-4 mb-14 animate-float-up">
          <p className="label-caps text-[#1e9fc4]">The Possibilities</p>
          <h1 className="font-serif text-5xl font-medium">
            Explore <span className="italic">careers</span>
          </h1>
          <p className="text-sm text-[#0e3a47]/60 max-w-md mx-auto">
            The daily reality of each path — not just the title.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(grouped).map(([category, careers], idx) => (
            <section key={category} className="animate-float-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="flex items-center gap-4 mb-5">
                <p className="label-caps text-[#1e9fc4] shrink-0">{category}</p>
                <div className="h-px flex-1 bg-[#3cbbde]/25" />
              </div>
              <div className="grid gap-3">
                {careers.map((career) => (
                  <Link
                    key={career.id}
                    href={`/explore/${career.id}`}
                    className="group block bg-white/70 backdrop-blur-sm rounded-2xl border border-[#3cbbde]/20 p-5 hover:border-[#1e9fc4]/50 hover:shadow-[0_8px_32px_rgba(60,187,222,0.12)] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-serif text-2xl font-medium text-[#0e3a47]">
                        {career.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#1e9fc4] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-[#0e3a47]/60 mb-4 line-clamp-2 leading-relaxed">
                      {career.description}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <span className="label-caps text-[#0e3a47]/45">
                        {career.salaryRange}
                      </span>
                      <span className="label-caps text-[#0e3a47]/45">
                        {career.timeToEntry}
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
