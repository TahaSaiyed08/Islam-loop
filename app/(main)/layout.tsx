import type { PropsWithChildren } from "react";

import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main
        id="main"
        className="h-full pb-20 pt-[50px] lg:pb-0 lg:pl-[256px] lg:pt-0"
      >
        <div className="mx-auto h-full max-w-[1056px] pt-6">{children}</div>
      </main>
      <MobileBottomNav />
    </>
  );
};

export default MainLayout;
