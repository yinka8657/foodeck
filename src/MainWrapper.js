import React, { useState, useEffect } from "react";
import SignUpLogin from "./SignUpLogin";
import App from "./App";
import { supabase } from "./supabaseClient"; // make sure you have this

export default function MainWrapper() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed?.id) {
            setUser(parsed);
            console.log("✅ Loaded user from localStorage:", parsed);
            return;
          }
        } catch {
          localStorage.removeItem("user");
        }
      }

      // fallback: fetch from Supabase directly
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ Synced user from Supabase:", user);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        console.log("⚠️ No logged-in user found");
      }
    };

    initUser();
  }, []);

  const handleLogin = async (userData) => {
    // always fetch fresh user after login
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ User logged in:", user);
    } else {
      console.error("❌ Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    console.log("👋 User logged out");
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
