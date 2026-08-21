import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
  srOnlyLabel,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Visually hide label (placeholder-driven inputs). */
  srOnlyLabel?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className={
          srOnlyLabel ? "sr-only" : "block text-sm font-medium"
        }
      >
        {label}
        {required && !srOnlyLabel ? (
          <span className="text-destructive"> *</span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
