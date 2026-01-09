// app/layout.tsx
import "../../styles/login.module.css";
import type { Metadata } from "next";
import Shell from "../../components/shell"; // <-- nouveau

export const metadata: Metadata = {
  title: "Home - Yassou",
  description: "Home page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Shell>{children}</Shell> {/* Header + Sidebar + contenu */}
    </>
  );
}
