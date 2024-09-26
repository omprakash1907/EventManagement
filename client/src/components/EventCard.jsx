import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

const EventCard = ({ event, onDelete, onEdit, loggedInUser, showEditDelete = false, showDetailsButton = true }) => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchEventAttendees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, user is not authenticated");
          return;
        }

        const response = await axios.get(`https://eventmanagement-ksbh.onrender.com/api/events/${event._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAttendees(response.data.attendees);
      } catch (error) {
        console.error("Error fetching event attendees:", error);
      }
    };

    fetchEventAttendees();
  }, [event._id]);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <img src={`https://eventmanagement-ksbh.onrender.com${event.image}`} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <div className="text-sm text-gray-600 flex items-center mb-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-600 flex items-center mb-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {event.location}
        </div>
        <div className="text-sm text-gray-600">{event.attendees.length} attendees</div>

        {/* Conditionally show View Details button */}
        {showDetailsButton && (
          <Link to={`/event-details/${event._id}`}>
            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg">View Details</button>
          </Link>
        )}

        {/* Show Edit/Delete buttons for the event creator */}
        {showEditDelete && (
          <div className="flex justify-between mt-4">
            <button onClick={onEdit} className="bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2">
              <FontAwesomeIcon icon={faEdit} />
              <span>Edit</span>
            </button>
            <button onClick={onDelete} className="bg-red-500 text-white py-2 px-4 rounded flex items-center space-x-2">
              <FontAwesomeIcon icon={faTrashAlt} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
