import { SITE_NAME } from "@/lib/site";

import { MobileSidebar } from "./mobile-sidebar";
import { MobileStats } from "./mobile-stats";

export const MobileHeader = () => {
  return (
    <nav
      aria-label="Menu bar"
      className="fixed top-0 z-50 flex h-[50px] w-full items-center gap-x-4 border-b bg-brand px-4 lg:hidden"
    >
      <MobileSidebar />
      <span className="font-extrabold tracking-wide text-white">
        {SITE_NAME}
      </span>
      <MobileStats />
    </nav>
  );
};
