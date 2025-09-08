import React, { useState, useEffect } from "react";
import SignUpLogin from "./SignUpLogin";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import InstallPage from "./InstallPage";
import Onboarding from "./Onboarding"; // 👈 your Swiper.js onboarding component
import { supabase } from "./supabaseClient";

export default function MainWrapper() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false); // 👈 track onboarding

  // ✅ Initialize user & onboarding on first load
  useEffect(() => {
    const initUser = async () => {
      try {
       // // 🔹 Check if onboarding was already seen
        const seenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (!seenOnboarding) {
          setShowOnboarding(true);
          setIsLoading(false);
          return; // 👈 stop here until user finishes onboarding
        } //

        // 🔹 Check localStorage user
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed?.id) {
              setUser(parsed);
              console.log("✅ Loaded user from localStorage:", parsed);
              setIsLoading(false);
              return;
            }
          } catch {
            localStorage.removeItem("user");
          }
        }

        // 🔹 Fallback: fetch from Supabase session
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
      } catch (err) {
        console.error("❌ initUser error:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  // ✅ Supabase auth state sync
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

    return () => subscription.subscription.unsubscribe();
  }, []);

  // ✅ After onboarding is complete
  const handleFinishOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  // ✅ Login & Logout helpers
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
    console.log("👋 User logged out");
  };

  // ✅ Prevent flicker
  if (isLoading) {
    return <div className="splash-screen">Loading...</div>;
  }

  // ✅ Onboarding takes precedence
  if (showOnboarding) {
    return <Onboarding onFinish={handleFinishOnboarding} />;
  }

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
