import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shuto — Dashboards automatisés pour piloter votre marque",
  description: "Des dashboards automatisés pour suivre vos KPIs de marque, analyser la concurrence et piloter votre stratégie. En temps réel.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
