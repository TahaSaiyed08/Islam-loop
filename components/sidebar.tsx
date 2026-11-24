import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { BASE_REPO_URL, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 bg-background px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link href="/learn" prefetch>
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <LogoMark className="size-10" />

          <span className="text-xl font-extrabold tracking-wide text-brand">
            {SITE_NAME}
          </span>
        </div>
      </Link>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Learn" href="/learn" icon="route" />
        <SidebarItem label="Find my level" href="/placement" icon="compass" />
        <SidebarItem label="Sources" href="/sources" icon="library" />
        <SidebarItem label="About" href="/about" icon="info" />
        <SidebarItem label="Settings" href="/settings" icon="settings" />
      </nav>

      <div className="space-y-1 p-4 text-sm text-neutral-600">
        <p>Free and non-commercial</p>
        <p>
          Based on{" "}
          <a
            href={BASE_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            sanidhyy/duolingo-clone
          </a>{" "}
          (MIT)
        </p>
      </div>
    </div>
  );
};
