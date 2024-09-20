import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import axios from 'axios';

const EventList = ({ searchTerm, location, date }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  // Filter events based on searchTerm, location, and date
  const filteredEvents = events.filter((event) => {
    const matchesSearchTerm = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location ? event.location.toLowerCase() === location.toLowerCase() : true;
    const matchesDate = date ? new Date(event.date).toLocaleDateString() === new Date(date).toLocaleDateString() : true;

    return matchesSearchTerm && matchesLocation && matchesDate;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <EventCard key={index} event={event} />
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventList;
