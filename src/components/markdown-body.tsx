import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const imgClass =
  "my-6 h-auto w-full max-w-full rounded-lg border border-border bg-card object-contain";

export function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <div className="text-base leading-relaxed text-foreground/90 sm:text-[17px] [&_li>p]:m-0">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-lg font-semibold tracking-tight text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mt-4 text-pretty">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-4 border-l-2 border-brand-ink/40 pl-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>
          ),
          table: ({ children }) => (
            <div className="mt-4 max-w-full overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm sm:text-[15px]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-3 py-2 text-left align-top font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 align-top">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-border" />,
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-brand-ink underline underline-offset-2"
            >
              {children}
            </a>
          ),
          pre: ({ children }) => (
            <pre className="mt-4 max-w-full overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-[12px] leading-relaxed sm:p-4 sm:text-[13px]">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            if (className) return <code className={className}>{children}</code>;
            return (
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]">
                {children}
              </code>
            );
          },
          img: ({ src, alt }) => {
            if (typeof src !== "string") return null;
            if (/^https?:\/\//i.test(src)) {
              return (
                // ponytail: arbitrary remote hosts; next/image needs a domain allowlist
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt ?? ""} className={imgClass} />
              );
            }
            return (
              <Image
                src={src}
                alt={alt ?? ""}
                width={1280}
                height={800}
                className={imgClass}
              />
            );
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
