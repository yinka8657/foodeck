import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

export default function LogoPage({ onFinish }) {
  // Track fade state for smooth transition
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show logo for 3 seconds before starting fade out
    const showTimer = setTimeout(() => {
      setFade(true); // Start fade-out
    }, 3000); // 3 seconds splash time

    // After fade-out animation (0.5s), call onFinish to hide splash page
    const hideTimer = setTimeout(() => {
      onFinish();
    }, 3500); // 3s display + 0.5s fade

    // Cleanup timers when component unmounts
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        height: '100vh',               // Fill the entire screen
        display: 'flex',               // Center content horizontally
        justifyContent: 'center',      // Center horizontally
        alignItems: 'center',          // Center vertically
        backgroundColor: 'yellow',     // Splash background color
        opacity: fade ? 0 : 1,          // Change opacity when fading
        transition: 'opacity 0.5s ease-out', // Smooth fade animation
      }}
    >
      <img
        src={logo} // Logo image
        alt="Logo"
        style={{ width: 150 }} // Size of logo
      />
    </div>
  );
}
