import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Rondel",
  description: "A selection of projects I've built across Magento 2, Next.js, React, and Node.js.",
};

export default function ProjectsPage() {
  const magento = projects.filter((p) => p.category === "magento");
  const web = projects.filter((p) => p.category !== "magento");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Portfolio</p>
          <h1 className={styles.heading}>Projects</h1>
          <p className={styles.sub}>
            A selection of work across e-commerce, full stack development,
            and custom integrations.
          </p>
        </header>

        <section className={styles.group}>
          <h2 className={styles.groupLabel}>Magento 2 / Adobe Commerce</h2>
          <div className={styles.grid}>
            {magento.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        <section className={styles.group}>
          <h2 className={styles.groupLabel}>Web & Full Stack</h2>
          <div className={styles.grid}>
            {web.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
