import React, { useState, useEffect } from "react";
import SignUpLogin from "./SignUpLogin"; // your existing login/signup component
import App from "./App"; // your main app component

export default function MainWrapper() {
  const [user, setUser] = useState(null);

  // On component mount, try to restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Called on successful login/signup
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // persist to localStorage
  };

  // Optional: handle logout (clear user)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
