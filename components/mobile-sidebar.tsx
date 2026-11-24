import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className="-ml-2.5 flex size-11 items-center justify-center rounded-md"
      >
        <Menu className="text-wolf" />
      </SheetTrigger>

      <SheetContent className="z-[100] p-0" side="left">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
