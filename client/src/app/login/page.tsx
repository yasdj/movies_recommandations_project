"use client";

import { useState } from "react";
import styles from "../../styles/login.module.css";
import { FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { post } from "../api/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await post<{ id: string; username: string }>(
        "/api/user/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("username", data.username);
      localStorage.setItem("id", data.id);

      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className={styles.icon} />
          </div>
          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <FaEyeSlash className={styles.icon} />
              ) : (
                <FaEye className={styles.icon} />
              )}
            </span>
          </div>

          <div className={styles.rememberForgot}>
            <label>
              <input type="checkbox" />
              Remember me{" "}
            </label>
            <a href="#">Forgot password?</a>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Log in</button>
        </form>

        <div className={styles.registerLink}>
          <p>
            {"Don't have an account? "}
            <Link href="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
