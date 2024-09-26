import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

const EditEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();

  // State variables for event data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(100);
  const [image, setImage] = useState(null); // To handle image uploads

  // Fetch event details by ID when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage

        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`https://eventmanagement-ksbh.onrender.com/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        const event = response.data;

        // Pre-fill the input fields with the event data
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date.split('T')[0]); // Format the date to be displayed in the date input
        setLocation(event.location);
        setMaxAttendees(event.maxAttendees);
      } catch (error) {
        console.error('Error fetching event data:', error);
        if (error.response && error.response.status === 401) {
          // If the user is unauthorized, redirect to login page
          navigate('/login');
        }
      }
    };

    fetchEvent();
  }, [id, navigate]);

  // Handle form submission for updating the event
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('maxAttendees', maxAttendees);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        throw new Error('No token found');
      }

      await axios.put(`https://eventmanagement-ksbh.onrender.com/api/events/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show SweetAlert for success
      Swal.fire({
        title: 'Success!',
        text: 'Event updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/my-events'); 
      });
    } catch (error) {
      console.error('Error updating event:', error);

      // Show SweetAlert for error
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update the event.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-lg">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-lg">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-lg">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-lg">Max Attendees</label>
          <input
            type="number"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-lg">Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
