import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import { supabase } from "./supabaseClient"; // Ensure this imports your Supabase client

const styles = {
  outerContainer: {
    width: "100%",
    height: "100dvh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  scrollableInner: {
    maxHeight: "90dvh",
    overflowY: "auto",
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem 1.5rem",
    boxSizing: "border-box",
    textAlign: "center",
  },
  logo: {
    display: "block",
    margin: "0 auto 1rem",
    width: "40%",
    height: "auto",
  },
  introText: {
    marginBottom: "15px",
    color: "#333",
    fontSize: "1.1rem",
  },
  toggleBtn: {
    display: "block",
    margin: "0 auto 15px",
    padding: "10px 20px",
    backgroundColor: "#DC143C",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "black",
    fontSize: "16px",
  },
  input: {
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#F1F3F5",
    padding: "12px",
    border: "none",
    width: "100%",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "black",
    border: "none",
    borderRadius: "8px",
    color: "yellow",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginBottom: "10px",
    fontSize: "0.9rem",
  },
  successText: {
    color: "green",
    marginBottom: "10px",
    fontSize: "1rem",
    fontWeight: "600",
  },
};

export default function SignUpLogin({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    const session = localStorage.getItem("session");
    const user = localStorage.getItem("user");
    if (session && user) {
      onLogin?.(JSON.parse(user));
    }
  }, [onLogin]);

  const toggleForm = () => {
    setError("");
    setSuccess("");
    setIsSignUp(!isSignUp);
    setForm({ email: "", username: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const email = form.email.trim();
    const username = form.username.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (isSignUp) {
      if (!email || !username || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      try {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;

        setSuccess(
          "Registration successful! Please confirm your email before login."
        );
        setIsSignUp(false);
        setForm({ email, username: "", password: "", confirmPassword: "" });
      } catch (err) {
        setError(err.message || "Registration failed.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      try {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Persist session & user
        const user = supabase.auth.user();
        localStorage.setItem("session", JSON.stringify(supabase.auth.session()));
        localStorage.setItem("user", JSON.stringify(user));

        const userData = {
          id: user?.id,
          email: user?.email || email,
          username: user?.user_metadata?.username || "",
        };

        setSuccess("Login successful!");
        onLogin?.(userData);
      } catch (err) {
        setError(err.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.scrollableInner}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <p style={styles.introText}>
          {isSignUp
            ? "Create your account to get started!"
            : "Welcome back! Please log in to continue."}
        </p>

        <button onClick={toggleForm} style={styles.toggleBtn}>
          {isSignUp ? "Switch to Log In" : "Switch to Sign Up"}
        </button>

        {error && <div style={styles.errorText}>{error}</div>}
        {success && <div style={styles.successText}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              style={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                style={styles.input}
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              style={styles.input}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                style={styles.input}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
