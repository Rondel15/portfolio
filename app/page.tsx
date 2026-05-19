import Link from "next/link";
import { getFeatured } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import styles from "./page.module.css";

const stack = [
  { label: "Magento 2", sub: "Adobe Commerce" },
  { label: "Next.js", sub: "App Router" },
  { label: "React", sub: "& TypeScript" },
  { label: "Node.js", sub: "REST & APIs" },
  { label: "PHP", sub: "8.x" },
  { label: "Python", sub: "Automation & Tools" },
  { label: "MySQL", sub: "& Redis" },
];

export default function Home() {
  const featured = getFeatured();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Full Stack Developer</p>
          <h1 className={styles.heading}>
            Hi, I&apos;m{" "}
            <span className={styles.name}>Rondel</span>
            <span className={styles.dot}>.</span>
          </h1>
          <p className={styles.sub}>
            I build e-commerce experiences, custom Magento 2 modules,
            and modern web applications.
          </p>
          <div className={styles.ctas}>
            <Link href="/projects" className={styles.ctaPrimary}>
              View my work
            </Link>
            <Link href="/contact" className={styles.ctaSecondary}>
              Get in touch
            </Link>
          </div>
        </div>

        {/* Floating tag */}
        <div className={styles.availBadge}>
          <span className={styles.availDot} />
          Open to opportunities
        </div>
      </section>

      {/* Stack */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionLabel}>Tech Stack</h2>
          <div className={styles.stackGrid}>
            {stack.map((s) => (
              <div key={s.label} className={styles.stackItem}>
                <span className={styles.stackName}>{s.label}</span>
                <span className={styles.stackSub}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>Featured Projects</h2>
            <Link href="/projects" className={styles.seeAll}>
              See all →
            </Link>
          </div>
          <div className={styles.projectsGrid}>
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaHeading}>Let&apos;s build something.</h2>
            <p className={styles.ctaText}>
              Whether it&apos;s a complex Magento integration, a new web app,
              or something in between — I&apos;m up for the challenge.
            </p>
            <Link href="/contact" className={styles.ctaPrimary}>
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
