import React, { useState } from 'react';
import './App.css';
import blackbell from './notifybellblack.svg';
import backarrow from './backarrowblack.svg';
import solidcancel from './x-cancel-solid-icon.svg';
import redcancel from './red-x-icon.svg';
import greencheck from './green-check-icon.svg';

const initialNotifications = [
  { id: 1, type: 'expired', title: 'Expired Ingredient', name: 'Tomato', date: '2/05/2029' },
  { id: 2, type: 'new', title: 'New Ingredient', name: 'Tomato', date: '2/05/2029' },
  { id: 3, type: 'expired', title: 'Expired Ingredient', name: 'Tomato', date: '2/05/2029' },
  // Add as many as you want
];

function Notification({ onBack }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Remove notification by id
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className='NotificationPane'>
      <div className='NotificationDisplayWrap'>
        <div className='NotifyTopGroup'>
          <div
            className='BackArrowContainer'
            onClick={onBack}
            style={{ cursor: 'pointer', paddingLeft:"20px" }}
            role="button"
            tabIndex={0}
            aria-label="Back"
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onBack(); }}
          >
            <img src={backarrow} alt="back" style={{ width: '10vw' }} />
          </div>

          <div className='BlackBellContainer'>
            <div className='NotifyCountBlack'>
              <span>{notifications.length}</span>
            </div>
            <img src={blackbell} alt="notifications" style={{ width: '10vw' }} />
          </div>
        </div>

        <div className='NotificationDisplay'>
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No notifications</p>
          ) : (
            notifications.map(({ id, type, title, name, date }) => (
              <div key={id} className='NotificationItem'>
                <div className='NotifyTextContainer'>
                  <div className='TextTopGroup'>
                    <div className='SignContainer'>
                      <img
                        src={type === 'expired' ? redcancel : greencheck}
                        alt={type}
                        style={{ width: '6vw' }}
                      />
                    </div>
                    <span style={{ fontSize: 'large' }}><strong>{title}</strong></span>
                  </div>
                  <div className='TextBottomGroup'>
                    <span style={{ fontSize: 'large' }}>
                      <span>{name}</span> - {date}
                    </span>
                  </div>
                </div>
                <div
                  className='SolidCancelContainer'
                  onClick={() => removeNotification(id)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove notification ${title}`}
                  onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') removeNotification(id); }}
                >
                  <img src={solidcancel} alt="remove" style={{ width: '6vw' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
