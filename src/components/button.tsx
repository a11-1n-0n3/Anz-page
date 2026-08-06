import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shared primitive. The API follows shadcn/ui so components added later with
 * `npx shadcn@latest add ...` match this styling out of the box.
 */
const buttonVariants = cva(
  // Pill shape: the single cheapest cue that a page was designed this decade.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[opacity,background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        /*
         * `primary` flips inside `.surface-dark` — dark pill on the light body,
         * light pill on the dark hero. That is why there is no separate
         * "on dark" variant: the token does the work.
         */
        default: "bg-primary text-primary-foreground hover:opacity-90",
        /*
         * The lit CTA. Fixed ink rather than a token because it sits on --neon
         * itself: #070d13 on #22d3ee is 10.8:1, and letting --foreground ride
         * along would put light text on cyan on the dark surface (1.3:1).
         */
        neon: "bg-neon text-[#070d13] hover:brightness-110",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        /*
         * Text-only secondary action sitting beside a filled CTA.
         *
         * It keeps the size padding rather than stripping it: `cn` merges with
         * tailwind-merge and `size` is applied after `variant`, so a `px-0`
         * here would lose to `px-7` anyway. The padding is also what gives it
         * a real touch target next to the primary button.
         */
        link: "underline decoration-transparent underline-offset-[6px] hover:decoration-current",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-[15px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Apply the button styling to the child (usually a <Link>) instead of rendering a <button>. */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
