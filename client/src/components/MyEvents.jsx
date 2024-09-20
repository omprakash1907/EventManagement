import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';

const MyEvents = ({ user }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch the user's events using the token stored in localStorage
    const fetchMyEvents = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/events/my-events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching user events:', error);
        }
      }
    };

    fetchMyEvents();
  }, []);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter((event) => event._id !== eventId));
  };

  return (
    <div className="container mx-auto p-8">
    <div className="bg-red-100 p-4 mb-8 flex justify-between items-center">
      <h1 className="text-4xl font-bold">My Events</h1>
      <button
        onClick={goToHome}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Home
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {events.map((event, index) => (
        <EventCard key={index} event={event} onDelete={handleDelete} loggedInUser={user} />
      ))}
    </div>
  </div>
  );
};

export default MyEvents;
