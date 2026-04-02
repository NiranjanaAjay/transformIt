import React from 'react';
import { useAppContext } from '../context/AppContext';

export function Navbar() {
  const { user, setCurrentPage, resetCampaign, setCurrentCampaign, currentCampaign } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    resetCampaign();
    setCurrentPage('landing');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => {
            if (currentCampaign) {
              setCurrentCampaign(null);
            } else {
              setCurrentPage('dashboard');
            }
          }}>
            ✨ TransformIt
          </h1>
        </div>

        <div className="navbar-menu">
          <button className="nav-link" onClick={() => setCurrentPage('dashboard')}>
            Dashboard
          </button>
          <button className="nav-link" onClick={() => setCurrentPage('campaigns')}>
            Past Campaigns
          </button>
        </div>

        <div className="navbar-profile">
          <div className="profile-dropdown">
            <button
              className="profile-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              🧚
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">{user?.name || 'User'}</div>
                <div className="dropdown-header" style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                  {user?.email}
                </div>
                <hr />
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
