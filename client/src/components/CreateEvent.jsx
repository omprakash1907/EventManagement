import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(100);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      const response = await axios.post('http://localhost:5000/api/events/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Event created:', response.data);
      // Optionally, redirect to your events page
    } catch (error) {
      console.error('Error creating event:', error);
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
