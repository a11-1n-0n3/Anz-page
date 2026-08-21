import { cn } from "@/lib/utils";

export function EmptyState({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-center text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}
