"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { getCareerById, CAREER_PATHS } from "@/lib/careers";
import { CareerPath } from "@/lib/types";
import Nav from "@/components/nav";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  GraduationCap,
  Briefcase,
  MessageCircle,
} from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-6 md:pt-18 pb-24">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </button>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-indigo-600 mb-1">
              {career.category}
            </p>
            <h1 className="text-3xl font-bold text-slate-900">{career.title}</h1>
            <p className="text-slate-600 mt-2">{career.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Salary</p>
              <p className="text-sm font-semibold text-slate-900">
                {career.salaryRange}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Time to Entry</p>
              <p className="text-sm font-semibold text-slate-900">
                {career.timeToEntry}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <GraduationCap className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Education</p>
              <p className="text-sm font-semibold text-slate-900 text-[11px] leading-tight">
                {career.education}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-slate-900">A Day in the Life</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {career.dayInLife}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Key Skills</h2>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {relatedCareers.length > 0 && (
            <div>
              <h2 className="font-semibold text-slate-900 mb-3">
                Related Paths
              </h2>
              <div className="grid gap-2">
                {relatedCareers.map(
                  (rc) =>
                    rc && (
                      <Link
                        key={rc.id}
                        href={`/explore/${rc.id}`}
                        className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 hover:border-indigo-300 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {rc.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {rc.salaryRange} · {rc.timeToEntry}
                          </p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                      </Link>
                    )
                )}
              </div>
            </div>
          )}

          <Link
            href="/mentor"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Ask your mentor about this career
          </Link>
        </div>
      </main>
    </div>
  );
}
