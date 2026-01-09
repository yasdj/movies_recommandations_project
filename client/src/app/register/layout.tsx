import "../../styles/login.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yassou",
  description: "Login page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
