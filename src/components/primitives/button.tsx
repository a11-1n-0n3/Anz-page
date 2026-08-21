import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// One size + shared motion for every button — only `variant` (color) and children differ.
const buttonVariants = cva(
  [
    "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold",
    "transition-[opacity,background-color,color,box-shadow,transform,filter] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:opacity-90 hover:shadow-lg",
        // White ink is fixed: #fff on --brand is 10.98:1 on either surface,
        // while --brand as TEXT is 1.75:1 on dark
        brand:
          "bg-brand text-white shadow-[0_8px_28px_-6px_rgba(0,7,205,0.65)] hover:brightness-125 hover:shadow-[0_12px_32px_-6px_rgba(0,7,205,0.8)]",
        outline:
          "border-2 border-foreground/25 bg-transparent shadow-sm hover:border-foreground/40 hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border border-border bg-secondary text-secondary-foreground shadow-sm hover:bg-accent",
        link: "h-auto px-0 font-medium underline decoration-transparent underline-offset-[6px] shadow-none hover:decoration-current",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
