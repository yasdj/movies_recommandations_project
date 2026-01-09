"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/header.module.css";
import SearchBar from "./searchBar";

type Props = {
  OnClose: () => void;
  isSidebarOpen: boolean;
};

export default function Header({ isSidebarOpen, OnClose }: Props) {
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  return (
    <header
      className={`${styles.header} ${isSidebarOpen ? styles.headerShift : ""}`}
    >
      <div className={styles.rightArea}>
        <SearchBar />
        <div className={styles.profile}>
          <Link href="/profile" onClick={OnClose}>
            <Image
              src="/pp.jpg"
              alt="Profil"
              width={32}
              height={32}
              className={styles.avatar}
            />
          </Link>
          <span className={styles.profileName}>
            <Link href="/profile" className={styles.link} onClick={OnClose}>
              {username}
            </Link>
          </span>
        </div>
      </div>
    </header>
  );
}
