import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Rondel",
  description: "Full stack developer specialising in Magento 2 and modern web technologies.",
};

const experience = [
  {
    role: "Full Stack Developer",
    company: "Tecnet",
    period: "Present",
    desc: "Building and maintaining Adobe Commerce Cloud storefronts, custom Magento 2 modules, third-party integrations, and frontend theming for clients including Digidirect — one of Australia's leading electronics retailers.",
  },
];

const skills = {
  "E-Commerce": ["Magento 2", "Adobe Commerce Cloud", "Particular Audience", "Algolia", "Pronto", "MSI", "Knockout.js", "Luma / Blank"],
  "Frontend": ["Next.js", "React", "TypeScript", "CSS Modules", "Tailwind"],
  "Backend": ["Node.js", "PHP 8.x", "REST APIs", "GraphQL"],
  "Infrastructure": ["Upsun", "MySQL", "Fastly CDN"],
  "Tools": ["Claude AI", "VS Code", "Git", "Elasticsearch"],
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>About me</p>
          <h1 className={styles.heading}>Developer.<br />Problem solver.</h1>
        </header>

        <div className={styles.bio}>
          <p>
            I&apos;m a full stack developer with deep expertise in Magento 2 /
            Adobe Commerce and modern JavaScript frameworks. I currently work at Tecnet
            , a web development services company based in the Philippines, where
            I build custom modules, integrations, and frontend experiences for
            clients including{" "}
            <a
              href="https://digidirect.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Digidirect
            </a>
            {" "}on Adobe Commerce Cloud.
          </p>
          <p>
            I enjoy working across the full stack — from developing Magento 2
            custom modules and ERP integrations on the backend, to crafting
            polished Knockout.js templates.
          </p>
          <p>
            When I&apos;m not coding, you&apos;ll find me singing or playing
            with my band — or spending time with my dogs.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Experience</h2>
          <div className={styles.expList}>
            {experience.map((e) => (
              <div key={e.role} className={styles.expItem}>
                <div className={styles.expMeta}>
                  <span className={styles.expRole}>{e.role}</span>
                  <span className={styles.expPeriod}>{e.period}</span>
                </div>
                <span className={styles.expCompany}>{e.company}</span>
                <p className={styles.expDesc}>{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Skills</h2>
          <div className={styles.skillsGrid}>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className={styles.skillGroup}>
                <h3 className={styles.skillCategory}>{category}</h3>
                <ul className={styles.skillList}>
                  {items.map((s) => (
                    <li key={s} className={styles.skillItem}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
