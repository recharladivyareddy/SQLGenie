import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { FaUserCircle } from 'react-icons/fa'; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <h2>SQLGenie</h2>
      </div>

      <div className="navbar-actions">
        {user ? (
          <div className="user-menu">
            <FaUserCircle className="user-icon" onClick={toggleDropdown} size={28} />
            {dropdownOpen && (
              <div className="dropdown">
                <div className="username">{user.name}</div>
                <div className="username">{user.email}</div>

                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className='login-button' onClick={() => navigate('/')}>Login</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
