import React, { useState } from "react";
import logo from "./logo.svg";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    margin: "auto",
    padding: "0px 30px",
    borderRadius: "8px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "yellow",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    position: "fixed"
  },
  logo: {
    display: "block",
    margin: "0 auto 0px",
    width: "40vw",
    height: "fit-content",
  },
  introText: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#333",
    fontSize: "1.1rem",
  },
  toggleBtn: {
    display: "block",
    margin: "0 auto 5px",
    padding: "10px 20px",
    backgroundColor: "#DC143C",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "black",
    fontSize: "20px",
  },
  input: {
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#F1F3F5",
    padding: "12px",
    border: "none",
    boxSizing: "border-box",
    width: "100%",
    fontSize: "20px",
  },
  submitBtn: {
    width: "80%",
    padding: "12px",
    backgroundColor: "black",
    border: "none",
    borderRadius: "5px",
    color: "yellow",
    fontWeight: "700",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginBottom: "15px",
    fontSize: "0.9rem",
  },
  successText: {
    color: "green",
    marginBottom: "15px",
    fontSize: "1rem",
    fontWeight: "600",
    textAlign: "center",
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

  const toggleForm = () => {
    setError("");
    setSuccess("");
    setIsSignUp(!isSignUp);
    setForm({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

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
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Registration failed");
          return;
        }

        setSuccess("Registration successful! Confirm Email & Log in.");
        setIsSignUp(false);
        setForm({ email, username: "", password: "", confirmPassword: "" });
      } catch (err) {
        setError("Network error, please try again.");
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
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Login failed");
          return;
        }

        setSuccess("Login successful!");

        // store token and user
        localStorage.setItem("authToken", data.token || "");
        const userData = data.user || { email }; // fallback in case backend doesn't send user
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ notify MainWrapper
        onLogin?.(userData);
      } catch (err) {
        setError("Network error, please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div>
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

        <form onSubmit={handleSubmit} style={{ width: "80vw", margin: "auto" }}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
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
              <label htmlFor="username" style={styles.label}>Username</label>
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
            <label htmlFor="password" style={styles.label}>Password</label>
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
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
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

          <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}
              disabled={loading}
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
