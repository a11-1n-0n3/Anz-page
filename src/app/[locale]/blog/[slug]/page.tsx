import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ProjectDetail } from "@/components/project-detail";
import { getPost, listPosts } from "@/lib/posts";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    listPosts().map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getPost(slug);
  if (!project) return {};

  const loc = locale as Locale;
  return {
    title: project.title[loc],
    description: project.excerpt[loc],
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getPost(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
