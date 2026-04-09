import React from 'react';
import { useAppContext } from '../context/AppContext';

export function Navbar() {
  const { user, setCurrentPage, signOut } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onDocumentClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
    };
  }, []);

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => setCurrentPage('dashboard')}>
            TransformIt
          </h1>
        </div>

        <div className="navbar-menu">
          <button className="nav-link" onClick={() => setCurrentPage('dashboard')}>
            Dashboard
          </button>
        </div>

        <div className="navbar-profile">
          <div className="profile-dropdown" ref={menuRef}>
            <button
              className="profile-button"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">{user?.name || 'User'}</div>
                <div className="dropdown-header navbar-email">
                  {user?.email}
                </div>
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
