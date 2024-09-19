import React, { useState, useEffect } from 'react';
import EventList from '../components/EventList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';  // Assuming you'll use React Router for navigation

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is in localStorage when the component mounts or refreshes
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user state if found
    }
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="text-center my-12">
        {user ? (
          <>
            <h1 className="text-4xl font-bold">Welcome, {user.name} 👋</h1>
            <p className="mt-4 text-gray-600">Here are your upcoming events:</p>

            {/* Buttons for viewing and creating events */}
            <div className="flex justify-center space-x-4 mt-8">
              <Link to="/my-events">
                <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>View My Events</span>
                </button>
              </Link>
              <Link to="/create-event">
                <button className="bg-green-500 text-white py-2 px-4 rounded flex items-center space-x-2">
                  <FontAwesomeIcon icon={faPlusCircle} />
                  <span>Create Event</span>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">The people platform—Where interests become friendships</h1>
            <p className="mt-4 text-gray-600">Sign up to join the fun.</p>
            <button className="bg-teal-500 text-white py-2 px-4 rounded mt-4">Join Meetup</button>
          </>
        )}
      </div>

      {/* List of events */}
      <EventList />
    </div>
  );
};

export default Home;
