import "../styles/login.module.css";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ScrollbarsOnScroll from "../components/scrollBar"; // On va l’ajouter

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yassou",
  description: "Login page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        {/* Active l’affichage de la barre pendant le scroll */}
        <ScrollbarsOnScroll hideAfter={600} />
        {children}
      </body>
    </html>
  );
}
