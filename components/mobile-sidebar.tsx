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
      <SheetTrigger aria-label="Open menu">
        <Menu className="text-white" />
      </SheetTrigger>

      <SheetContent className="z-[100] p-0" side="left">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
