"use client";

import { Compass, Info, Library, Route, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

// lucide icons replace the upstream image icons; a name (not a component) is passed
// so the sidebar can stay a server component.
const ICONS = {
  route: Route,
  compass: Compass,
  library: Library,
  info: Info,
  settings: Settings,
};

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
        <Icon aria-hidden className="mr-5 size-8 shrink-0 stroke-[1.75]" />
        {label}
      </Link>
    </Button>
  );
};
