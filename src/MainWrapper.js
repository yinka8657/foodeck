import React, { useState, useEffect } from "react";
import SignUpLogin from "./SignUpLogin";
import App from "./App";

export default function MainWrapper() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <SignUpLogin onLogin={handleLogin} />
      ) : (
        <App user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
