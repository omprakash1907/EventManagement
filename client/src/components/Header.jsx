import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, handleLogout }) => {
  const navigate = useNavigate(); 

  const handleLogoutAndRedirect = () => {
    handleLogout(); 
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-red-600">Meetup</div>
      <div className="flex">
        <input
          type="text"
          placeholder="Search events"
          className="border rounded-l-lg p-2"
        />
        <input
          type="text"
          placeholder="Location"
          className="border-t border-b border-r rounded-r-lg p-2"
        />
        <button className="bg-red-600 text-white p-2 rounded ml-2">Search</button>
      </div>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            {/* Display user email with a round avatar */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                <span className="text-sm font-bold text-white">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{user.email}</span>
            </div>
            <button
              className="bg-red-600 text-white p-2 rounded"
              onClick={handleLogoutAndRedirect} // Handle logout and navigate
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to={'/login'} className="mr-4">Log in</Link>
            <Link to={'/signup'} className="bg-red-600 text-white p-2 rounded">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
