"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, MessageCircle, User } from "lucide-react";

const links = [
  { href: "/mentor", label: "Mentor", icon: MessageCircle },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/journey", label: "Journey", icon: Map },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#3cbbde]/20 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="hidden md:block py-3 font-serif italic text-xl text-[#0e3a47]"
        >
          MentorPath
        </Link>
        <div className="flex flex-1 md:flex-none items-center justify-around md:gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-3 transition-colors ${
                  active
                    ? "text-[#1e9fc4]"
                    : "text-[#0e3a47]/50 hover:text-[#0e3a47]"
                }`}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" strokeWidth={1.5} />
                <span className="label-caps">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
