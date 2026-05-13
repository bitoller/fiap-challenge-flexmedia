import React from 'react';

type ActionIcon = 'checkin' | 'checkout' | 'services';

interface ActionButtonProps {
  icon: ActionIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon, title, subtitle, onClick }) => {
  return (
    <button type="button" className="action-button" onClick={onClick}>
      <div className="action-button-content">
        <div className="action-button-icon" aria-hidden="true">
          {icon === 'checkin' && (
            <svg viewBox="0 0 24 24" className="action-button-svg" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8.2" cy="12" r="3.4" />
              <path d="M11.6 12h6.1" />
              <path d="M15.4 12v1.9" />
              <path d="M17.2 12v1.1" />
              <path d="M18.8 12v1.6" />
            </svg>
          )}
          {icon === 'checkout' && (
            <svg viewBox="0 0 24 24" className="action-button-svg" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5h7" />
              <path d="M5 19h7" />
              <path d="M5 5v14" />
              <path d="M12 8l4 4-4 4" />
              <path d="M9 12h7" />
            </svg>
          )}
          {icon === 'services' && (
            <svg viewBox="0 0 24 24" className="action-button-svg" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5.5a3.5 3.5 0 0 0-3.5 3.5v1.6c0 .8-.3 1.6-.8 2.2L6.5 14v1h11v-1l-1.2-1.2c-.5-.6-.8-1.4-.8-2.2V9a3.5 3.5 0 0 0-3.5-3.5Z" />
              <path d="M9.3 16.8a3 3 0 0 0 5.4 0" />
            </svg>
          )}
        </div>
        <h3 className="action-button-title">{title}</h3>
        <p className="action-button-subtitle">{subtitle}</p>
      </div>
    </button>
  );
};
