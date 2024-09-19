import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventCard = ({ event, onDelete, loggedInUser }) => {
  const navigate = useNavigate();

  // Handle edit (redirect to edit page)
  const handleEdit = () => {
    navigate(`/edit-event/${event._id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found.');
        }
  
        await axios.delete(`http://localhost:5000/api/events/${event._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass token correctly
          },
        });
        onDelete(event._id); // Notify parent component about the deletion
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };
  

  return (
    <div className="border rounded shadow-lg p-4 relative">
      <img src={`http://localhost:5000${event.image}`} alt={event.title} className="w-full h-32 object-cover mb-4" />
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p>{event.host}</p>
      <p>{event.date}</p>
      <p>{event.location}</p>
      <p>{event.attendees.length} attendees</p>

      {/* Show Edit and Delete buttons only if the logged-in user is the creator of the event */}
      {loggedInUser && loggedInUser._id === event.creator._id && (
        <div className="absolute top-2 right-2 space-x-2">
          <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
