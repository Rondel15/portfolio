import Link from "next/link";
import { Project } from "@/lib/projects";
import styles from "./ProjectCard.module.css";

const categoryColors: Record<Project["category"], string> = {
  magento: "orange",
  nextjs: "blue",
  react: "cyan",
  node: "green",
};

const categoryLabels: Record<Project["category"], string> = {
  magento: "Magento 2",
  nextjs: "Next.js",
  react: "React",
  node: "Node.js",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.top}>
          <span
            className={styles.category}
            data-color={categoryColors[project.category]}
          >
            {categoryLabels[project.category]}
          </span>
          <svg
            className={styles.arrow}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>

        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>

        <div className={styles.tags}>
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className={styles.tag}>+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
