import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom'; // For redirecting

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(100);
  const [image, setImage] = useState(null);

  const navigate = useNavigate(); // Hook to handle redirection

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Prepare form data for submission
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      // Send POST request to create event
      const response = await axios.post('https://eventmanagement-ksbh.onrender.com/api/events/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
          'Content-Type': 'multipart/form-data' // Set Content-Type to multipart/form-data
        }
      });

      console.log('Event created successfully:', response.data);

      // SweetAlert2 success message
      Swal.fire({
        title: 'Success!',
        text: 'Event created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect to the home page after the user clicks 'OK'
        navigate('/');
      });

    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);

      // SweetAlert2 error message
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create the event. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Create Event</h1>
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
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
