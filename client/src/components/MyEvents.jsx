import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

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

  // Handle event deletion from the list
  const handleDelete = (eventId) => {
    setEvents(events.filter((event) => event._id !== eventId));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <EventCard key={index} event={event} onDelete={handleDelete} loggedInUser={user} />
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
