"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, User, Map } from "lucide-react";

const links = [
  { href: "/mentor", label: "Mentor", icon: MessageCircle },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 py-3 font-bold text-indigo-600"
        >
          <Map className="w-5 h-5" />
          MentorPath
        </Link>
        <div className="flex flex-1 md:flex-none items-center justify-around md:gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-3 text-xs md:text-sm font-medium transition-colors ${
                  active
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
