import { useState } from "react";
import api, { setToken } from "./api/api";
import "./LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await api.post("/api/auth/login", { username, password });
        setToken(res.data.token);
        onLogin?.();
      } else {
        await api.post("/api/auth/register", { username, password });
        setSuccess("Account created! You can now log in.");
        setMode("login");
        setPassword("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Inject placeholder color override via a <style> tag */}
      <style>{`
        .login-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Username
              <input
                className="login-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                disabled={loading}
                style={styles.input}
                placeholder="your username"
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={styles.input}
                placeholder="••••••••"
              />
            </label>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <p style={styles.switchText}>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setSuccess("");
              }}
              style={styles.switchLink}
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#16213e",
    borderRadius: "10px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.4)",
  },
  title: {
    margin: "0 0 1.5rem",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  input: {
    padding: "0.6rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.08)",
    fontSize: "1rem",
    outline: "none",
    color: "#fff",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.7rem",
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "0.875rem",
    margin: "0",
    padding: "0.6rem 0.75rem",
    backgroundColor: "rgba(233,69,96,0.15)",
    borderRadius: "6px",
  },
  success: {
    color: "#6bffb8",
    fontSize: "0.875rem",
    margin: "0",
    padding: "0.6rem 0.75rem",
    backgroundColor: "rgba(107,255,184,0.1)",
    borderRadius: "6px",
  },
  switchText: {
    marginTop: "1.25rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.5)",
  },
  switchLink: {
    background: "none",
    border: "none",
    color: "#e94560",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
    fontSize: "0.875rem",
    textDecoration: "underline",
  },
};