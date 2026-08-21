import { cn } from "@/lib/utils";

/** Responsive card list. Pass `<li>` children. `snap` = mobile horizontal scroll. */
export function CardGrid({
  children,
  cols = 3,
  snap = false,
  className,
}: {
  children: React.ReactNode;
  cols?: 2 | 3;
  snap?: boolean;
  className?: string;
}) {
  if (snap) {
    return (
      <ul
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:gap-5 md:overflow-visible md:px-0 md:pb-0",
          cols === 2 && "md:grid-cols-2",
          cols === 3 && "md:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {children}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "grid",
        cols === 2 && "gap-3 sm:grid-cols-2 sm:gap-5",
        cols === 3 && "gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </ul>
  );
}
