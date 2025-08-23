import React, { useState } from "react";
import HeaderBar from './HeaderBar';
import Nav from './Nav';
import MenuBar from './Menubar'; // side menu component
import Notification from './Notification'; // your notification pane
import { SelectedIngredientsProvider } from './SelectedIngredientsContext'; // import your context provider
import { useLocation } from "react-router-dom";

const MainLayout = ({ children, onLogout, user }) => {
  const location = useLocation();

  // List of routes where Header/Nav should be hidden
  const hideLayoutRoutes = ["/install"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Toggle menu open/close
  const toggleMenu = () => setMenuOpen(open => !open);
  const closeMenu = () => setMenuOpen(false);

  // Toggle notification pane open/close
  const toggleNotification = () => setNotificationOpen(open => !open);
  const closeNotification = () => setNotificationOpen(false);

  // Sign out handler that clears auth and calls parent handler
  const handleSignOut = () => {
    // Remove auth data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Call parent logout handler to update app state
    if (onLogout) onLogout();

    closeMenu();
  };

  return (
    <SelectedIngredientsProvider>
      
      {/* Pass togglers to HeaderBar */}
      
      {!shouldHideLayout && <HeaderBar 
        onMenuToggle={toggleMenu} 
        onNotificationToggle={toggleNotification} 
      />}

      {/* Render children directly (context provides state) */}
      {children}

      {!shouldHideLayout && <Nav />}

      {/* MenuBar with sign out button */}
      {menuOpen && (
        <MenuBar
          isOpen={menuOpen}
          onClose={closeMenu}
          onSignOut={handleSignOut} // Updated sign out handler
          user={user}
        />
      )}

      {/* Notification pane */}
      {notificationOpen && (
        <Notification
          onBack={closeNotification} 
        />
      )}
    </SelectedIngredientsProvider>
  );
};

export default MainLayout;
