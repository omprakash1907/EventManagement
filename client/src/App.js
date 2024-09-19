import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  const [user, setUser] = useState(null); // Centralized user state

  useEffect(() => {
    // Check if the user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user state if found in localStorage
    }
  }, []);

  const handleLogin = (userData) => {
    // Set the user state and store the data in localStorage after login
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user info to localStorage
  };

  const handleLogout = () => {
    // Clear user state and remove from localStorage on logout
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        {/* Pass user state and logout handler to the Header */}
        <Header user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Protect the login and signup routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute user={user}>
                <Login handleLogin={handleLogin} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute user={user}>
                <Signup />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
