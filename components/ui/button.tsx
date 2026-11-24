import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Ported from sanidhyy/duolingo-clone (MIT): the same variants, sizes and 3D edge.
// The press now sinks the face the way the real app does: the bottom edge moves to a
// transparent top border, so the face drops 4px while the box keeps its height and
// nothing around it jumps. Colours are the Roadmap palette (DESIGN.md).
const sink =
  "active:border-b-0 active:border-t-4 active:border-t-transparent active:bg-clip-padding";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-[15px] font-extrabold uppercase tracking-wide ring-offset-background transition-[filter,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-wolf border-swan border-2 border-b-4 hover:bg-polar active:border-b-2 active:translate-y-[2px]",

        // custom
        locked: "bg-swan text-hare border-[#CACACA] border-b-4 hover:bg-swan",

        primary: `bg-sand text-accent-foreground border-sand-dark border-b-4 hover:brightness-105 ${sink}`,
        primaryOutline: "bg-white text-sand-ink hover:bg-polar",

        secondary: `bg-brand text-white border-brand-dark border-b-4 hover:brightness-110 ${sink}`,
        secondaryOutline: "bg-white text-brand hover:bg-polar",

        danger: `bg-rose-600 text-white border-rose-800 border-b-4 hover:brightness-110 ${sink}`,
        dangerOutline: "bg-white text-rose-700 hover:bg-polar",

        super: `bg-brand-dark text-white border-black/60 border-b-4 hover:brightness-110 ${sink}`,
        superOutline: "bg-white text-brand-dark hover:bg-polar",

        ghost:
          "bg-transparent text-wolf border-transparent border-0 hover:bg-polar",

        sidebar:
          "bg-transparent text-wolf border-2 border-transparent hover:bg-polar transition-none",
        sidebarOutline:
          "bg-brand-soft text-primary border-brand-line border-2 hover:bg-brand-soft transition-none",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",

        // custom
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
