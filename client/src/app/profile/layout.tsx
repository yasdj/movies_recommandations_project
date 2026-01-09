// app/layout.tsx
import "../../styles/login.module.css";
import "../globals.css";
import type { Metadata } from "next";
import Shell from "../../components/shell"; // <-- nouveau

export const metadata: Metadata = {
  title: "Profile - Yassou",
  description: "Profile page",
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
