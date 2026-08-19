import Image from "next/image";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";


export function BrandMark({
  className,
  priority = false,
  size = "md",
}: {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md";
}) {
  const icon = size === "sm" ? 28 : 36;
  const name =
    size === "sm"
      ? "text-[17px] leading-none"
      : "text-[20px] leading-none";
  const sub =
    size === "sm"
      ? "mt-0.5 text-[8px] tracking-[0.22em]"
      : "mt-1 text-[9px] tracking-[0.26em]";

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      <Image
        src="/assets/logo.png"
        alt=""
        width={icon}
        height={icon}
        // Opaque light PNG — rounded badge until a transparent mark lands
        className={cn("rounded-md", size === "sm" ? "size-7" : "size-9")}
        priority={priority}
      />
      <span className="flex flex-col items-center">
        <span
          className={cn(
            "font-display font-bold text-foreground uppercase tracking-[0.28em]",
            name,
          )}
        >
          {siteConfig.name}
        </span>
        <span
          className={cn(
            "font-sans font-medium text-muted-foreground uppercase",
            sub,
          )}
        >
          {siteConfig.lockupSub}
        </span>
      </span>
    </span>
  );
}
