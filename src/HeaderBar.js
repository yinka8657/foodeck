import './App.css';
import hamburger from './hamburger.svg';
import notifybell from './notifybell.svg';
import logo from './logo.svg';
import { useLocation } from 'react-router-dom';

function HeaderBar({ onMenuToggle, onNotificationToggle }) {
  const location = useLocation();

  // Hide elements on specific paths
  const hideHeaderElements = ['/ingredient-to-recipe/suggestions', '/ingredient-to-recipe'].includes(location.pathname);
  const hideTitleElement = ['/', '/ingredient-to-recipe'].includes(location.pathname);
  const hideIngredientTitle = ['/ingredient-to-recipe/suggestions', '/'].includes(location.pathname);

  // Debug function for click and key press on hamburger
  const handleToggleMenu = () => {
    console.log("Hamburger toggled");
    onMenuToggle();
  };

  // Debug function for click and key press on notification bell
  const handleToggleNotification = () => {
    console.log("Notification toggled");
    if (onNotificationToggle) {
      onNotificationToggle();
    }
  };

  return (
    <div className="HeaderContainer">
      <div className="HeaderWrap">
        {!hideHeaderElements && (
          <>
            <div
              className="HamburgerIcon"
              onClick={handleToggleMenu}
              style={{ cursor: 'pointer' }}
              aria-label="Toggle menu"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleToggleMenu();
                }
              }}
            >
              <img src={hamburger} alt="menu" style={{ width: '10vw' }} />
            </div>
            <div className="Logo">
              <img src={logo} alt="logo" style={{ width: '30vw' }} />
            </div>
          </>
        )}

        {!hideTitleElement && (
          <div className="RecipeSuggestPageTitle" style={{lineHeight:"0px"}}>
            <h2>Recipe Suggestion</h2>
          </div>
        )}

        {!hideIngredientTitle && (
          <div className="RecipeSuggestPageTitle" style={{lineHeight:"0px"}}>
            <h2>Ingredient List</h2>
          </div>
        )}

        <div
          className="NotifyBellIcon"
          onClick={handleToggleNotification}
          style={{ cursor: 'pointer' }}
          aria-label="Toggle notifications"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleToggleNotification();
            }
          }}
        >
          <div className="NotifyCountBlack">
            <span>2</span>
          </div>
          <img src={notifybell} alt="notification" style={{ width: '10vw' }} />
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
