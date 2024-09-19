import React, { useState, useEffect } from 'react';
import EventList from '../components/EventList';

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
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">The people platform—Where interests become friendships</h1>
            <p className="mt-4 text-gray-600">Sign up to join the fun.</p>
          </>
        )}
        <button className="bg-teal-500 text-white py-2 px-4 rounded mt-4">
          {user ? 'View Events' : 'Join Meetup'}
        </button>
      </div>

      <EventList />
    </div>
  );
};

export default Home;
