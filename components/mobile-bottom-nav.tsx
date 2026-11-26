"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ICONS } from "@/components/nav-icons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/learn", label: "Learn", icon: NAV_ICONS.route },
  { href: "/placement", label: "Level", icon: NAV_ICONS.compass },
  { href: "/sources", label: "Sources", icon: NAV_ICONS.library },
  { href: "/settings", label: "Settings", icon: NAV_ICONS.settings },
] as const;

export const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex h-[64px] items-center justify-around border-t-2 border-swan bg-white px-2 lg:hidden"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide transition [&_svg]:size-6",
              active
                ? "border-brand-line bg-brand-soft text-primary"
                : "border-transparent text-wolf hover:bg-polar"
            )}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
