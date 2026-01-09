// components/Shell.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "../styles/shell.module.css";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((s) => !s), []);

  useEffect(() => {
    if (pathname === "/profile") {
      setIsSidebarOpen(true);
    }
  }, [pathname]);

  // Fermer avec la touche Échap
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar]);

  return (
    <div className={styles.shell}>
      <div className={styles.glassCard}>
        <Header isSidebarOpen={isSidebarOpen} OnClose={closeSidebar} />
        <Sidebar open={isSidebarOpen} onToggle={toggleSidebar} />
        {/* Overlay cliquable quand la sidebar est ouverte */}
        {isSidebarOpen && (
          <div className={styles.overlay} onClick={closeSidebar} />
        )}

        <main
          className={`${styles.main} ${isSidebarOpen ? styles.shifted : ""}`}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
