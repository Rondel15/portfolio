import { getBySlug, projects } from "@/lib/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Rondel`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getBySlug(slug);
  if (!project) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/projects" className={styles.back}>
          ← All projects
        </Link>

        <header className={styles.header}>
          <h1 className={styles.heading}>{project.title}</h1>
          <p className={styles.desc}>{project.longDescription}</p>

          <div className={styles.tags}>
            {project.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>

          {(project.liveUrl || project.repoUrl) && (
            <div className={styles.links}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBtn}
                >
                  Live site ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBtnSecondary}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          )}
        </header>

        <section className={styles.highlights}>
          <h2 className={styles.highlightsLabel}>Key Highlights</h2>
          <ul className={styles.highlightsList}>
            {project.highlights.map((h) => (
              <li key={h} className={styles.highlightItem}>
                <span className={styles.bullet} aria-hidden>→</span>
                {h}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
