import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Rondel",
  description: "Get in touch for collaboration, freelance work, or just to say hello.",
};

const channels = [
  {
    label: "Email",
    value: "rondeldalumpines@email.com",
    href: "mailto:rondeldalumpines@email.com",
    desc: "Best for project enquiries",
  },
  {
    label: "GitHub",
    value: "github.com/Rondel15",
    href: "https://github.com/Rondel15",
    desc: "See my code",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/rondel-dalumpines-6b1625187/",
    href: "https://linkedin.com/in/rondel-dalumpines-6b1625187/",
    desc: "Professional profile",
  },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.heading}>
            Let&apos;s work<br />
            <em>together.</em>
          </h1>
          <p className={styles.sub}>
            Whether you need a Magento 2 expert, a full stack developer for
            your next project, or just want to connect — reach out.
          </p>
        </header>

        <div className={styles.channels}>
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={styles.channel}
            >
              <div className={styles.channelInner}>
                <span className={styles.channelLabel}>{c.label}</span>
                <span className={styles.channelValue}>{c.value}</span>
                <span className={styles.channelDesc}>{c.desc}</span>
              </div>
              <span className={styles.channelArrow}>↗</span>
            </a>
          ))}
        </div>

        <p className={styles.note}>
          Based in the Philippines, available for remote work globally.
        </p>
      </div>
    </div>
  );
}
