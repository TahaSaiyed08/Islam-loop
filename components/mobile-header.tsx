import { SITE_NAME } from "@/lib/site";

import { MobileSidebar } from "./mobile-sidebar";
import { MobileStats } from "./mobile-stats";

// Ported from sanidhyy/duolingo-clone (MIT): fixed 50px bar below lg with the
// sheet menu. White with stats, as on the real app's mobile web.
export const MobileHeader = () => {
  return (
    <nav
      aria-label="Menu bar"
      className="fixed top-0 z-50 flex h-[50px] w-full items-center gap-x-3 border-b-2 border-swan bg-white px-4 lg:hidden"
    >
      <MobileSidebar />
      <span className="font-extrabold tracking-wide text-brand">
        {SITE_NAME}
      </span>
      <MobileStats />
    </nav>
  );
};
