import React from 'react';
import './App.css';
import signouticon from './signouticon.svg';
import avataricon from './avataricon.svg';
import instagram from './instagram.svg';
import solidcancel from './x-cancel-solid-icon.svg';
import facebook from './facebook.svg';
import tiktok from './tiktok.svg';

function MenuBar({ isOpen, onClose, onSignOut, user }) {
  if (!isOpen) return null; // Don't render if menu is closed

  // Close menu if user clicks outside the container (on overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('MenuBarOverlay')) {
      onClose();
    }
  };

  return (
    <div className="MenuBarOverlay" onClick={handleOverlayClick}>
      <div className="MenuBarContainer">
        <div className="MenuContainer">

          {/* Top section with logo and close button */}
          <div className="MenuTopGroup">
          <div className="MenuMiddleGroup">
            <div className="Avatar">
              <img src={avataricon} alt="avatar" style={{ width: '100%' }} />
          </div>
          <div>
            <h2 style={{ margin:'auto' }}> Hello!</h2>
              <span style={{ fontSize: 'large', display:'block' }}>{user?.username || 'Guest'}</span>
            </div>
          </div>
            <div 
              className="CloseBtn" 
              onClick={onClose} 
              style={{ cursor: 'pointer' }} 
              aria-label="Close menu"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
            >
              <img src={solidcancel} alt="close" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Middle section with avatar and user name */}
         
          


          <div className='SocialsWrap'>
           <h4 style={{ textAlign: 'center', lineHeight:'0' }}>Official Socials:</h4>
            {/*Official Socials*/}
            <div className='SocialsContainer' style={{ margin: '0 auto' }}>
              <div className='SocialIcon'>
                <img src={facebook} alt="social" style={{ width: '100%' }}/>
              </div>
              <div className='SocialIcon'>
                <img src={instagram} alt="social" style={{ width: '100%' }}/>
              </div>
              <div className='SocialIcon'>
                <img src={tiktok} alt="social" style={{ width: '100%' }}/>
              </div>
            </div>
          </div>
          
          
          
          {/* Bottom section with Sign Out */}
          <div 
            className="MenuBottomGroup" 
            onClick={onSignOut} 
            style={{ cursor: 'pointer' }} 
            aria-label="Sign out"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onSignOut(); }}
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
