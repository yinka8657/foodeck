import React, { useState } from "react";
import logo from './logo.svg';

const styles = {
  container: {
    maxWidth: "400px",
    height: 'calc(100vh - 1px)',
    margin: "auto",
    padding: "0px 30px",
    borderRadius: "8px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "yellow",
    display:"flex",
    justifyContent:"center",
    alignItems: "center",

  },
  logo: {
    display: "block",
    margin: "0 auto 30px",
    width: "40vw",
    height: "fit-content",
  },
  introText: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontSize: "1.1rem",
  },
  toggleBtn: {
    display: "block",
    margin: "0 auto 30px",
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
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "black",
    fontSize:"20px",
  },
  input: {
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#F1F3F5",
    padding: "15px",
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

    if (isSignUp) {
      if (!form.email || !form.username || !form.password || !form.confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Call backend register API
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            username: form.username,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed");
          return;
        }

        setSuccess("Registration successful! You can now log in.");
        setIsSignUp(false);
        setForm({
          email: form.email,
          username: "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError("Network error, please try again.");
      }
    } else {
      // Login flow
      if (!form.username || !form.password) {
        setError("Please fill in all fields.");
        return;
      }

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Login failed");
          return;
        }

        setSuccess("Login successful!");
        onLogin(data.user); // pass user info to parent (e.g., save auth state)
        localStorage.setItem("authToken", data.token || "");
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        setError("Network error, please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
      />
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

      <form onSubmit={handleSubmit} style={{width:'80vw', margin:'auto'}}>
        {isSignUp && (
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
        )}

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
        <div style={{display:'flex', justifyContent:"center", paddingTop:"20px"}}>
            <button type="submit" style={styles.submitBtn}>
              {isSignUp ? "Sign Up" : "Log In"}
            </button>
        </div>
       
      </form>
      </div>
    </div>
  );
}
