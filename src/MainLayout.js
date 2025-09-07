import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderBar from './HeaderBar';
import Nav from './Nav';
import MenuBar from './Menubar';
import Notification from './Notification';
import { SelectedIngredientsProvider } from './SelectedIngredientsContext';

const MainLayout = ({ onLogout, user }) => {
  const location = useLocation();

  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 70) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 👉 Hide *everything layout-related* for these routes
  const hideLayoutRoutes = ["/install", "/recipe", "/ingredientPage"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(open => !open);
  const closeMenu = () => setMenuOpen(false);
  const toggleNotification = () => setNotificationOpen(open => !open);
  const closeNotification = () => setNotificationOpen(false);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    closeMenu();
  };

  return (
    <SelectedIngredientsProvider>
      {!shouldHideLayout && (
        <HeaderBar
          onMenuToggle={toggleMenu}
          onNotificationToggle={toggleNotification}
          style={{
            transition: "transform 0.3s ease",
            transform: showTopBar ? "translateY(0)" : "translateY(-100%)"
          }}
        />
      )}

      {/* 👉 Child routes render here */}
      <div className="MainContent">
        <Outlet context={{ showTopBar }} />
      </div>

      {!shouldHideLayout && <Nav />}

      {!shouldHideLayout && menuOpen && (
        <MenuBar
          isOpen={menuOpen}
          onClose={closeMenu}
          onSignOut={handleSignOut}
          user={user}
        />
      )}

      {!shouldHideLayout && notificationOpen && (
        <Notification onBack={closeNotification} />
      )}
    </SelectedIngredientsProvider>
  );
};

export default MainLayout;
