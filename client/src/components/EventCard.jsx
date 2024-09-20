import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventCard = ({ event, onDelete, loggedInUser }) => {
  const navigate = useNavigate();
  const [hasRsvp, setHasRsvp] = useState(false); // Track if the user has RSVP'd
  const [isFull, setIsFull] = useState(false); // Track if the event is fully booked
  const [attendees, setAttendees] = useState([]); // Store populated attendees data

  // Format the event date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Fetch RSVP status and event capacity when the component mounts
  useEffect(() => {
    const checkRsvpStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // If the user is not logged in, no need to check RSVP status

        const response = await axios.get(
          `http://localhost:5000/api/events/${event._id}/rsvp-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHasRsvp(response.data.hasRsvp); // Set RSVP status for the logged-in user
      } catch (error) {
        console.error("Error fetching RSVP status:", error);
      }
    };

    const fetchEventAttendees = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${event._id}`
        );
        setAttendees(response.data.attendees); // Populate the attendees
      } catch (error) {
        console.error("Error fetching event attendees:", error);
      }
    };

    if (loggedInUser) {
      checkRsvpStatus(); // Check RSVP status if a user is logged in
    }
    fetchEventAttendees(); // Fetch the attendees of the event
  }, [event._id, loggedInUser]);

  // Handle RSVP action
  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to RSVP!");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/events/${event._id}/rsvp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      setHasRsvp(true); // Set RSVP status to true after a successful RSVP
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };

  // Handle edit (redirect to edit page)
  const handleEdit = () => {
    navigate(`/edit-event/${event._id}`); // Redirect to edit page with event ID
  };

  // Handle delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found.");
        }

        await axios.delete(`http://localhost:5000/api/events/${event._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token correctly
          },
        });
        onDelete(event._id); // Notify parent component about the deletion
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="border rounded shadow-lg p-4 flex flex-col justify-between relative h-full">
      <img
        src={`http://localhost:5000${event.image}`}
        alt={event.title}
        className="w-full h-32 object-cover mb-4"
      />
      <div className="mb-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p>{event.host}</p>
        <p>{formatDate(event.date)}</p> {/* Formatted event date */}
        <p>{event.location}</p>
        <p>{event.attendees.length} attendees</p>
        {loggedInUser && loggedInUser._id === event.creator._id && (
          <>
            {event.attendees.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Attendees:</h4>
                <ul className="list-disc pl-5">
                  {event.attendees.map((attendee) => (
                    <li key={attendee._id}>
                      {attendee.name} ({attendee.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Show if the event is fully booked */}
      {isFull && <p className="text-red-500 ">This event is fully booked</p>}

      {/* Show RSVP button if not already RSVP'd, event is not full, and user is NOT the creator */}
      <button
        onClick={handleRsvp}
        className="bg-red-500 text-white py-2 px-4 rounded"
      >
        Book Now
      </button>

      {/* Show RSVP status */}
      {hasRsvp && <p className="text-green-500">You have RSVP'd</p>}

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
            className="bg-green-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-green-700"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Show list of attendees */}
      {attendees.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Attendees:</h4>
          <ul className="list-disc pl-5">
            {attendees.map((attendee) => (
              <li key={attendee._id}>
                {attendee.name} ({attendee.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventCard;
