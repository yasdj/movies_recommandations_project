// components/Sidebar.tsx
import Link from "next/link";
import styles from "../styles/sidebar.module.css";
import { MdLogout, MdOutlineAccountCircle } from "react-icons/md";
import { RiMovieAiLine } from "react-icons/ri";
import { FiInfo } from "react-icons/fi";
import { FiSidebar } from "react-icons/fi";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: Props) {
  return (
    <aside
      id="sidebar"
      className={`${styles.sidebar} ${open ? styles.open : ""}`}
      aria-hidden={!open}
    >
      {/* Bouton du menu */}
      <button
        className={styles.menuButtonSidebar}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={onToggle}
      >
        <FiSidebar className={styles.menuIconSidebar} />
      </button>
      <nav className={styles.nav}>
        <div className={styles.mainMenuContainer}>
          <div className={styles.separator}>
            <span className={styles.label}>
              MAIN MENU
              <span />
            </span>
          </div>
          <Link href="/dashboard" className={styles.link} onClick={onToggle}>
            <span className={styles.iconBox}>
              <RiMovieAiLine className={styles.icon} />
            </span>
            <span className={styles.label}>Recommandations</span>
          </Link>
          <Link href="/profile" className={styles.link} onClick={onToggle}>
            <span className={styles.iconBox}>
              <MdOutlineAccountCircle className={styles.icon} />
            </span>
            <span className={styles.label}>My Profile</span>
          </Link>
          <Link href="/help" className={styles.link} onClick={onToggle}>
            <span className={styles.iconBox}>
              <FiInfo className={styles.icon} />
            </span>
            <span className={styles.label}>Help & information</span>
          </Link>
        </div>
        <div className={styles.systemContainer}>
          <div className={styles.separator}>
            <span className={styles.label}>SYSTEM</span>
          </div>
          <Link href="/login" className={styles.link} onClick={onToggle}>
            <span className={styles.iconBox}>
              <MdLogout className={styles.icon} />
            </span>
            <span className={styles.label}>Log out</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
