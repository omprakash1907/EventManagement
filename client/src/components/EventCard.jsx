import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventCard = ({ event, onDelete, loggedInUser }) => {
  const navigate = useNavigate();

  // Handle edit (redirect to edit page)
  const handleEdit = () => {
    navigate(`/edit-event/${event._id}`); // Redirect to edit page with event ID
  };

  // Handle delete
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
    <div className="border rounded shadow-lg p-4 flex flex-col justify-between relative h-full">
      <img src={`http://localhost:5000${event.image}`} alt={event.title} className="w-full h-32 object-cover mb-4" />
      <div className="mb-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p>{event.host}</p>
        <p>{event.date}</p>
        <p>{event.location}</p>
        <p>{event.attendees.length} attendees</p>
      </div>

      {/* Show Edit and Delete buttons only if the logged-in user is the creator of the event */}
      {loggedInUser && loggedInUser._id === event.creator._id && (
        <div className="mt-auto flex justify-between space-x-4">
          {/* Update Button */}
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faEdit} />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-red-700"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
