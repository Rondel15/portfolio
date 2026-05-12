import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Rondel — Full Stack Developer",
  description:
    "Full stack developer specialising in Magento 2, Next.js, React, and Node.js. Based in the Philippines.",
  openGraph: {
    title: "Rondel — Full Stack Developer",
    description:
      "Full stack developer specialising in Magento 2, Next.js, React, and Node.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Nav />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
