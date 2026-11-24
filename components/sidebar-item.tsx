"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ICONS } from "@/components/nav-icons";
import { Button } from "@/components/ui/button";

// Original flat icons replace the upstream image icons; a name (not a component) is
// passed so the sidebar can stay a server component.
const ICONS = NAV_ICONS;

type SidebarItemProps = {
  label: string;
  icon: keyof typeof ICONS;
  href: string;
};

export const SidebarItem = ({ label, icon, href }: SidebarItemProps) => {
  const Icon = ICONS[icon];
  const pathname = usePathname();
  const isActive = pathname === href || pathname === `${href}/`;

  return (
    <Button
      variant={isActive ? "sidebarOutline" : "sidebar"}
      className="h-[52px] justify-start"
      asChild
    >
      <Link href={href} prefetch aria-current={isActive ? "page" : undefined}>
        <span className="mr-5 flex">
          <Icon />
        </span>
        {label}
      </Link>
    </Button>
  );
};
