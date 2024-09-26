import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRsvp, setHasRsvp] = useState(false); // Track if user has RSVP'd
  const [isFull, setIsFull] = useState(false); // Track if the event is fully booked

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authorization required');
          setLoading(false);
          return;
        }

        // Fetch event details
        const response = await axios.get(`https://eventmanagement-ksbh.onrender.com/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        const eventData = response.data;
        setEvent(eventData);
        setIsFull(eventData.attendees.length >= eventData.maxAttendees); // Check if the event is fully booked
        setLoading(false);

        // Fetch RSVP status for the current user
        const rsvpResponse = await axios.get(`https://eventmanagement-ksbh.onrender.com/api/events/${id}/rsvp-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasRsvp(rsvpResponse.data.hasRsvp); // Check if the current user has RSVP'd
      } catch (error) {
        console.error('Error fetching event details or RSVP status:', error);
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Handle RSVP action
  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to RSVP!');
        return;
      }

      const response = await axios.post(
        `https://eventmanagement-ksbh.onrender.com/api/events/${id}/rsvp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      setHasRsvp(true); // Mark that the user has RSVP'd
      setEvent({ ...event, attendees: [...event.attendees, { _id: response.data.user._id, name: response.data.user.name }] }); // Update the attendee list
    } catch (error) {
      alert(error.response?.data?.message || 'Error RSVPing');
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <img
        src={`https://eventmanagement-ksbh.onrender.com${event.image}`}
        alt={event.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Max Attendees:</strong> {event.maxAttendees}</p>
      <p><strong>Attendees:</strong> {event.attendees.length}</p>

      {/* Display RSVP button if the user hasn't RSVP'd and the event is not full */}
      {!hasRsvp && !isFull && (
        <button onClick={handleRsvp} className="bg-red-500 text-white py-2 px-4 rounded mt-4">
          Book Now
        </button>
      )}

      {/* Show a message if the user has already RSVP'd */}
      {hasRsvp && <p className="text-green-500">You have RSVP'd for this event.</p>}

      {/* Show a message if the event is fully booked */}
      {isFull && <p className="text-red-500">This event is fully booked.</p>}

    </div>
  );
};

export default EventDetails;
