"use client";

import styles from "../../styles/register.module.css";
import { FaLock, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import { post } from "../api/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = await post<{ id: string; username: string }>("/api/user", {
        username,
        email,
        password,
      });

      localStorage.setItem("username", user.username);
      localStorage.setItem("id", user.id);

      router.push("/login");
    } catch (err: unknown) {
      console.error("Erreur lors de l'inscription :", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputBox}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className={styles.inputBox}>
            <MdEmail className={styles.icon} />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
            />
          </div>
          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>
          <button type="submit">Sign up</button>
        </form>

        <div className={styles.alreadyRegisteredLink}>
          <p>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
