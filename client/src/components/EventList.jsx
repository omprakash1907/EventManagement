import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import axios from 'axios';

const EventList = ({ loggedInUser }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);  // Set the events state with the fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle event deletion from the list
  const handleDelete = (eventId) => {
    setEvents(events.filter(event => event._id !== eventId)); // Remove deleted event from the list
  };

  // Display loading or error if applicable
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Events near you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <EventCard key={index} event={event} loggedInUser={loggedInUser} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
