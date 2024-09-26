import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';

const MyEvents = ({ user }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://eventmanagement-ksbh.onrender.com/api/events/my-events', {
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

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://eventmanagement-ksbh.onrender.com/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`); // Redirect to edit page with event ID
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-red-100 p-4 mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Events</h1>
        <button onClick={goToHome} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Home
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <EventCard
            key={index}
            event={event}
            onDelete={() => handleDelete(event._id)} // Pass the delete handler
            onEdit={() => handleEdit(event._id)} // Pass the edit handler
            loggedInUser={user}
            showEditDelete={true} // Enable edit and delete buttons
            showDetailsButton={false} // Disable view details button
          />
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
