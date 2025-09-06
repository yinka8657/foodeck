import React, { useState, useEffect } from "react";
import SignUpLogin from "./SignUpLogin";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import InstallPage from "./InstallPage";
import { supabase } from "./supabaseClient"; // ✅ supabase client with persistSession

export default function MainWrapper() {
  const [user, setUser] = useState(null);

  // ✅ Initialize user on first load
  useEffect(() => {
    const initUser = async () => {
      // try localStorage first
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

      // fallback: fetch from Supabase session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session?.user && !error) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user));
        console.log("✅ Synced user from Supabase:", session.user);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        console.log("⚠️ No logged-in user found");
      }
    };

    initUser();
  }, []);

  // ✅ Keep app in sync with Supabase auth events
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("user", JSON.stringify(session.user));
          console.log(`🔄 Auth event: ${event}, user updated`);
        } else {
          setUser(null);
          localStorage.removeItem("user");
          console.log(`🔄 Auth event: ${event}, user cleared`);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ✅ Called after login success
  const handleLogin = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session?.user && !error) {
      setUser(session.user);
      localStorage.setItem("user", JSON.stringify(session.user));
      console.log("✅ User logged in:", session.user);
    } else {
      console.error("❌ Login error:", error);
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
    console.log("👋 User logged out");
  };

  return (
    <Routes>
      {/* Public onboarding route */}
      <Route path="/install" element={<InstallPage />} />

      {/* Everything else requires auth */}
      <Route
        path="/*"
        element={
          !user ? (
            <SignUpLogin onLogin={handleLogin} />
          ) : (
            <App user={user} onLogout={handleLogout} />
          )
        }
      />
    </Routes>
  );
}
