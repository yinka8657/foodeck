import React, { useState } from 'react';
import './App.css';
import signouticon from './signouticon.svg';
import avataricon from './avataricon.svg';
import solidcancel from './x-cancel-solid-icon.svg';
import xicon from './x-icon.svg';
import sendmail from './send-mail.svg';
import feedback from './feedback.svg';

function MenuBar({ isOpen, onClose, onSignOut, user }) {
  const [clickedOnce, setClickedOnce] = useState(false);

  // Close if overlay clicked
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('MenuBarOverlay')) {
      onClose();
    }
  };

  // Feedback click logic
  const handleClick = () => {
    if (!clickedOnce) {
      setClickedOnce(true);
    } else {
      window.location.href =
        'mailto:afrifoody@gmail.com?subject=Feedback&body=Hi Afrifoody team,';
      setClickedOnce(false);
    }
  };

  return (
    <div
      className={`MenuBarOverlay ${isOpen ? 'show' : ''}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`MenuBarContainer ${isOpen ? 'open' : 'closed'}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="MenuContainer">
          {/* Top section */}
          <div className="MenuTopGroup">
            <div className="MenuMiddleGroup">
              <div className="Avatar">
                <img src={avataricon} alt="avatar" style={{ width: '100%' }} />
              </div>
              <div>
                <h2 style={{ margin: 'auto' }}> Hello!</h2>
                <span style={{ fontSize: 'large', display: 'block' }}>
                  {user?.username || 'Guest'}
                </span>
              </div>
            </div>
            <div
              className="CloseBtn"
              onClick={onClose}
              style={{ cursor: 'pointer' }}
              aria-label="Close menu"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClose();
              }}
            >
              <img src={solidcancel} alt="close" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Feedback */}
          <div className="Feedback" onClick={handleClick}>
            <img
              src={clickedOnce ? sendmail : feedback}
              alt="feedback"
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Socials */}
          <div className="SocialsWrap">
            <h4 style={{ textAlign: 'center', lineHeight: '0' }}>
              Official Socials:
            </h4>
            <div className="SocialsContainer" style={{ margin: '0 auto' }}>
              <a
                href="https://x.com/Afrifoody"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="SocialIcon">
                  <img src={xicon} alt="social" style={{ width: '100%' }} />
                </div>
              </a>
            </div>
          </div>

          {/* Sign out */}
          <div
            className="MenuBottomGroup"
            onClick={onSignOut}
            style={{ cursor: 'pointer' }}
            aria-label="Sign out"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSignOut();
            }}
          >
            <div className="SignOutIcon">
              <img src={signouticon} alt="sign out" style={{ width: '100%' }} />
            </div>
            <span style={{ fontSize: 'x-large' }}>Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
